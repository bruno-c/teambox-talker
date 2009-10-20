require "em/mysql"

module Talker
  class MysqlAuthenticator
    def initialize(options)
      EventedMysql.settings.update options
    end
    
    def authenticate(room_id, user_id, token, &callback)
      sql = <<-SQL
        SELECT talker_token
        FROM users
        INNER JOIN rooms ON rooms.account_id = users.account_id
        WHERE users.id = #{user_id.to_i}
          AND users.state = 'active'
          AND rooms.id = #{room_id.to_i}
        LIMIT 1
      SQL
      
      Talker.logger.debug{"Querying for authentication:\n#{sql}"}
      
      EventedMysql.select(sql) do |results|
        result = results[0]
        
        if result && result.key?("talker_token")
          Talker.logger.debug{"Authentication succeded for user ##{user_id} in room ##{room_id}"}
          callback.call results[0]["talker_token"] == token
        else
          Talker.logger.warn "Authentication failed for user ##{user_id} in room ##{room_id} with token #{token}"
          callback.call(false)
        end
      end
    end
  end
end
