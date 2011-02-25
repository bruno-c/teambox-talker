require "em/mysql"
require "yajl"

module Talker::Server
  class MysqlAdapter
    def initialize(options={})
      settings = EventedMysql.settings
      
      # default options
      settings.update :encoding => "utf8",
                      :connections => 4,
                      :on_error => proc { |e| Notifier.error "Unexpected MySQL Error", e }
      
      settings.update options
      
      @encoder = Yajl::Encoder.new
      
      Talker::Server.logger.info "#{EventedMysql.connection_pool.size} connections to MySQL #{settings[:database]}@#{settings[:host]}"
    end
    
    def db
      EventedMysql
    end
    
    
    ## Authentication
    def authenticate(token)
      token = token.to_s
      
      sql = <<-SQL
        SELECT *
        FROM users
        WHERE users.talker_token = '#{quote(token)}'
          AND users.state = 'active'
        LIMIT 1
      SQL


      EventedMysql.select(sql) do |results|
        if result = results[0]
          user = User.new("id" => result["id"].to_i, "name" => result["name"], "email" => result["email"])
          yield user
        else
          Talker::Server.logger.warn "Authentication failed with token #{token}"
          yield nil
        end
      end
    end
    
    def authorize_room(user, room)
      
      sql = <<-SQL
        SELECT id FROM rooms
        WHERE 
          (id = #{room.to_i} OR name = '#{quote(room)}')
          AND
          (
            EXISTS (
              select * from registrations where
              registrations.user_id = #{user.id} and
              registrations.account_id = rooms.account_id and
              (registrations.admin = 1 OR rooms.private = 0)
            ) 
            OR EXISTS (
              SELECT *
              FROM permissions
              WHERE user_id = #{user.id}
              AND room_id = rooms.id
            )
            OR EXISTS (
              SELECT *
              FROM users
              WHERE room_id = rooms.id
            )
          )
        LIMIT 1
      SQL
     
      Talker::Server.logger.debug{"Querying for room authorization:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        if result = results[0]
          yield result["id"].to_i
        else
          Talker::Server.logger.warn "Authorization failed for #{user.name} in room #{room}"
          yield nil
        end
      end
    end
    
    
    ## Connections
    
    def store_connection(channel_type, channel_id, user_id, state)
      sql = <<-SQL
        INSERT INTO connections (channel_type, channel_id, user_id, state, created_at, updated_at)
        VALUES ('#{quote(channel_type.to_s.capitalize)}', '#{quote(channel_id)}', #{user_id.to_i}, '#{quote(state)}', NOW(), NOW())
      SQL
      Talker::Server.logger.debug sql
      db.insert sql
    end

    def update_connection(channel_type, channel_id, user_id, state)
      sql = <<-SQL
        UPDATE connections
        SET state = '#{state}', updated_at = NOW()
        WHERE channel_type = '#{quote(channel_type.to_s.capitalize)}'
          AND channel_id = '#{quote(channel_id)}'
          AND user_id = #{user_id.to_i}
      SQL
      Talker::Server.logger.debug sql
      db.update sql
    end

    def delete_connection(channel_type, channel_id, user_id)
      sql = <<-SQL
        DELETE FROM connections
        WHERE channel_type = '#{quote(channel_type.to_s.capitalize)}'
          AND channel_id = '#{quote(channel_id)}'
          AND user_id = #{user_id.to_i}
      SQL
      Talker::Server.logger.debug sql
      db.raw sql
    end
    
    # yields [channel_type, channel_id, user_info_hash, state] for each connection
    def load_connections(&callback)
      sql = <<-SQL
        SELECT connections.channel_type AS channel_type, connections.channel_id AS channel_id,
               users.id AS user_id, users.name AS name, users.email AS email,
               connections.state as state
        FROM connections
        INNER JOIN users ON users.id = connections.user_id
      SQL
      db.select(sql) do |results|
        results.each do |result|
          user = User.new("id" => result["user_id"].to_i, "name" => result["name"].to_s, "email" => result["email"].to_s)
          callback.call result["channel_type"].downcase, result["channel_id"], user, result["state"]
        end
      end
    end
    
    
    ## Pastes
    
    def insert_paste(room_id, permalink, content, &callback)
      content = content.to_s
      time = Time.now.to_i
      
      sql = "INSERT INTO pastes (id, room_id, content, created_at, updated_at) " +
            "VALUES ('#{quote(permalink)}', #{room_id.to_i}, '#{quote(content)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
      
      Talker::Server.logger.debug sql
      db.insert sql, &callback
    end
    
    def update_paste(permalink, content, attributions, &callback)
      time = Time.now.to_i
      
      sql = "UPDATE pastes SET content = '#{quote(content)}', attributions = '#{quote(attributions)}', updated_at = FROM_UNIXTIME(#{time})" +
            "WHERE id = '#{quote(permalink)}'"
      
      Talker::Server.logger.debug sql
      db.insert sql, &callback
    end
    
    # yields [content, attributions]
    def load_paste(permalink)
      sql = "SELECT content, attributions " +
            "FROM pastes " +
            "WHERE id = '#{quote(permalink)}' " +
            "LIMIT 1"
      
      Talker::Server.logger.debug sql
      
      db.select sql do |results|
        if result = results.first
          yield result["content"], result["attributions"]
        else
          yield nil, nil
        end
      end
    end
    
    
    ## Events
    
    def insert_event(room, event, &callback)
      id = event["id"].to_s
      room_id = room.to_i
      type = event["type"].to_s
      content = event["content"].to_s
      time = (event["time"] || Time.now.utc).to_i
      payload = @encoder.encode(event)
      
      sql = "INSERT INTO events (uuid, room_id, type, content, payload, created_at, updated_at) " +
            "VALUES ('#{quote(id)}', #{room_id}, '#{quote(type)}', '#{quote(content)}', '#{quote(payload)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
      
      Talker::Server.logger.debug sql
      db.insert sql, callback, errback_for(event)
    end
    
    # Load events that happened since a give event (by ID)
    # yields raw JSON encoded event, NOT objects.
    def load_room_events(room_id, last_event_id, &callback)
      room_id = room_id.to_i
      last_event_id = last_event_id.to_s
      
      find_event_sql = "(SELECT created_at FROM events WHERE uuid = '#{quote(last_event_id)}')"
      sql = <<-SQL
        SELECT payload
        FROM events
        WHERE room_id = #{room_id}
          AND (
              created_at > #{find_event_sql}
              OR (created_at = #{find_event_sql}
                  AND uuid > '#{quote(last_event_id)}')
              )
        ORDER BY created_at desc, uuid desc
        LIMIT 50
      SQL
      
      Talker::Server.logger.debug sql
      db.select sql do |results|
        results.reverse.each do |result|
          yield result["payload"]
        end
      end
    end
    
    
    private
      def quote(s)
        return "" if s.nil?
        s.to_s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
      
      def errback_for(object, action = :inserting)
        proc { |e| Notifier.error "Error #{action}: #{object.inspect}", e }
      end
  end
end
