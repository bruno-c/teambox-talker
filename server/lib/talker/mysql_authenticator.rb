require "em/mysql"

module Talker
  class MysqlAuthenticator
    include Escaping
    
    def initialize(options)
      EventedMysql.settings.update options
    end
    
    def authenticate(room, token, user=nil, &callback)
      if user
        authenticate_guest_user room, token, user, &callback
      else
        authenticate_registered_user room, token, &callback
      end
    end
    
    def authenticate_registered_user(room_id, token, &callback)
      callback.call(nil) if room_id.nil? || token.nil?
      
      sql = <<-SQL
        SELECT users.id AS id, users.name AS name, users.email AS email
        FROM users
        INNER JOIN rooms ON rooms.account_id = users.account_id
        WHERE users.talker_token = '#{quote(token)}'
          AND users.state = 'active'
          AND rooms.id = #{room_id.to_i}
        LIMIT 1
      SQL
      
      Talker.logger.debug{"Querying for authentication:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        if result = results[0]
          user = User.new("id" => result["id"].to_i, "name" => result["name"], "email" => result["email"])
          Talker.logger.debug{"Authentication succeded for user ##{user.name} in room ##{room_id}"}
          callback.call(user)
        else
          Talker.logger.warn "Authentication failed in room ##{room_id} with token #{token}"
          callback.call(nil)
        end
      end
    end
    
    def authenticate_guest_user(room_id, token, user, &callback)
      callback.call(nil) if room_id.nil? || token.nil? || !user.is_a?(Hash) || user["name"].nil? || user["email"].nil?
      
      sql = <<-SQL
        SELECT id
        FROM rooms
        WHERE id = #{room_id.to_i}
          AND public_token = '#{quote(token)}'
        LIMIT 1
      SQL
      
      Talker.logger.debug{"Querying for guest authentication:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        if result = results[0]
          user = User.new("name" => user["name"].to_s, "email" => user["email"].to_s)
          Talker.logger.debug{"Guest authentication succeded for user ##{user.name} in room ##{room_id}"}
          callback.call(user)
        else
          Talker.logger.warn "Guest authentication failed in room ##{room_id} with token #{token}"
          callback.call(nil)
        end
      end
    end
  end
end
