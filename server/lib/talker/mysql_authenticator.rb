require "em/mysql"

module Talker
  class MysqlAuthenticator
    include Escaping
    
    def initialize(options)
      EventedMysql.settings.update options
    end
    
    def authenticate(room_id, token, &callback)
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
  end
end
