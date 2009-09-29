$:.unshift File.dirname(__FILE__) + "/../../vendor/em-mysql/lib"
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

if __FILE__ == $PROGRAM_NAME
  EM.run do
    a = Talker::MysqlAuthenticator.new(:database => "talker_development", :username => "root")
    a.authenticate(1, "macournoyer", "e2b95d09a4fd5fbeaea0fdbcd582407fe38c6181") do |success|
      puts success
      EM.stop
    end
  end
end