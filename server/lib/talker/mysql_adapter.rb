require "em/mysql"
require "yajl"

module Talker
  class MysqlAdapter
    def initialize(options={})
      settings = EventedMysql.settings
      
      # default options
      settings.update :encoding => "utf8",
                      :connections => 4,
                      :on_error => proc { |e| Talker::Notifier.error "Unexpected MySQL Error", e }
                     
      settings.update options
      
      @encoder = Yajl::Encoder.new
      
      Talker.logger.info "#{EventedMysql.connection_pool.size} connections to MySQL #{settings[:database]}@#{settings[:host]}"
    end
    
    def db
      EventedMysql
    end
    
    
    ## Authentication
    def authenticate(room, token, &callback)
      room = room.to_s
      token = token.to_s
      
      sql = <<-SQL
        SELECT users.id AS id, users.name AS name, users.email AS email, rooms.id AS room_id
        FROM users
        INNER JOIN rooms ON rooms.account_id = users.account_id
        WHERE users.talker_token = '#{quote(token)}'
          AND users.state = 'active'
          AND (rooms.id = #{room.to_i} OR rooms.name = '#{quote(room)}')
          AND (users.admin = 1
               OR rooms.private = 0
               OR EXISTS (SELECT *
                          FROM permissions
                          WHERE user_id = users.id
                            AND room_id = rooms.id)
              )
        LIMIT 1
      SQL
      
      Talker.logger.debug{"Querying for authentication:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        if result = results[0]
          user = User.new("id" => result["id"].to_i, "name" => result["name"], "email" => result["email"])
          room_id = result["room_id"].to_i
          Talker.logger.debug{"Authentication succeded for user ##{user.name} in room ##{room}"}
          callback.call(user, room_id)
        else
          Talker.logger.warn "Authentication failed in room ##{room} with token #{token}"
          callback.call(nil, nil)
        end
      end
    end
    
    
    ## Connections
    
    def store_connection(room_id, user_id, state)
      sql = <<-SQL
        INSERT INTO connections (room_id, user_id, state, created_at, updated_at)
        VALUES (#{room_id.to_i}, #{user_id.to_i}, '#{state}', NOW(), NOW())
      SQL
      db.insert sql
    end

    def update_connection(room_id, user_id, state)
      sql = <<-SQL
        UPDATE connections
        SET state = '#{state}', updated_at = NOW()
        WHERE room_id = #{room_id} AND user_id = #{user_id}
      SQL
      db.update sql
    end

    def delete_connection(room_id, user_id)
      sql = <<-SQL
        DELETE FROM connections
        WHERE room_id = #{room_id.to_i}
        AND user_id = #{user_id.to_i}
      SQL
      db.raw sql
    end
    
    # yields [room_id, user_info_hash, state] for each connection
    def load_connections(&callback)
      sql = <<-SQL
        SELECT connections.room_id AS room_id, users.id AS user_id,
               users.name AS name, users.email AS email,
               connections.state as state
        FROM connections
        INNER JOIN users ON users.id = connections.user_id
      SQL
      db.select(sql) do |results|
        results.each do |result|
          user = User.new("id" => result["user_id"].to_i, "name" => result["name"].to_s, "email" => result["email"].to_s)
          callback.call(result["room_id"].to_i, user, result["state"])
        end
      end
    end
    
    
    ## Pastes
    
    def insert_paste(permalink, content, &callback)
      content = content.to_s
      time = Time.now.utc.to_i
      
      sql = "INSERT INTO pastes (content, permalink, created_at, updated_at) " +
            "VALUES ('#{quote(content)}', '#{quote(permalink)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
      
      Talker.logger.debug sql
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
      
      Talker.logger.debug sql
      db.insert sql, callback, errback_for(event)
    end
    
    # Load events that happened since a give event (by ID)
    # yields raw JSON encoded event, NOT objects.
    def load_events(room_id, last_event_id, &callback)
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
      
      Talker.logger.debug sql
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
        proc { |e| Talker::Notifier.error "Error #{action}: #{object.inspect}", e }
      end
  end
end