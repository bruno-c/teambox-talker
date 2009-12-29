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
    def authenticate(token, &callback)
      token = token.to_s
      
      sql = <<-SQL
        SELECT id, name, email, account_id, admin
        FROM users
        WHERE users.talker_token = '#{quote(token)}'
          AND users.state = 'active'
        LIMIT 1
      SQL
      
      Talker::Server.logger.debug{"Querying for authentication:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        if result = results[0]
          user = User.new("id" => result["id"].to_i, "name" => result["name"], "email" => result["email"])
          user.account_id = result["account_id"].to_i
          user.admin = (result["admin"] == "1")
          callback.call user
        else
          Talker::Server.logger.warn "Authentication failed with token #{token}"
          callback.call nil
        end
      end
    end
    
    def authorize_room(user, room, &callback)
      yield true if user.admin
      
      sql = <<-SQL
        SELECT id
        FROM rooms as r
        WHERE account_id = #{user.account_id}
          AND (id = #{room.to_i} OR name = '#{quote(room)}')
          AND (private = 0
               OR EXISTS (SELECT *
                          FROM permissions
                          WHERE user_id = #{user.id}
                            AND room_id = r.id)
              )
        LIMIT 1
      SQL
      
      Talker::Server.logger.debug{"Querying for room authorization:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        if result = results[0]
          room_id = result["id"].to_i
          callback.call room_id
        else
          Talker::Server.logger.warn "Authorization failed for #{user.name} in room #{room}"
          callback.call nil
        end
      end
    end
    
    
    ## Connections
    
    def store_connection(channel_type, channel_id, user_id, state)
      sql = <<-SQL
        INSERT INTO connections (channel_type, channel_id, user_id, state, created_at, updated_at)
        VALUES ('#{quote(channel_type.to_s.capitalize)}', '#{quote(channel_id)}', #{user_id.to_i}, '#{quote(state)}', NOW(), NOW())
      SQL
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
      db.update sql
    end

    def delete_connection(channel_type, channel_id, user_id)
      sql = <<-SQL
        DELETE FROM connections
        WHERE channel_type = '#{quote(channel_type.to_s.capitalize)}'
          AND channel_id = '#{quote(channel_id)}'
          AND user_id = #{user_id.to_i}
      SQL
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
    
    def insert_paste(permalink, content, &callback)
      content = content.to_s
      time = Time.now.utc.to_i
      
      sql = "INSERT INTO pastes (content, permalink, created_at, updated_at) " +
            "VALUES ('#{quote(content)}', '#{quote(permalink)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
      
      Talker::Server.logger.debug sql
      db.insert sql, &callback
    end
    
    
    ## Events
    
    def insert_event(room, event, callback)
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
          AND created_at > #{find_event_sql}
           OR (created_at = #{find_event_sql}
               AND uuid > '#{quote(last_event_id)}')
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