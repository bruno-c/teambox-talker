require "em/mysql"

module Talker
  class MysqlAuthenticator
    def initialize(options)
      EventedMysql.settings.update options
    end
    
    def authenticate(room, user, token, &callback)
      EventedMysql.select(<<-SQL) do |results|
          SELECT talker_token
          FROM users
          LEFT JOIN rooms ON rooms.account_id = users.account_id
          WHERE users.name = '#{user}'
            AND rooms.id = #{room.to_i}
          LIMIT 1
        SQL
        
        result = results[0]
        
        if result && result.key?("talker_token")
          callback.call results[0]["talker_token"] == token
        else
          callback.call(false)
        end
      end
    end
    
    private
      def quote(s)
        s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
  end
end
