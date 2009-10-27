require "em/mysql"

module Talker
  module Presence
    # Persistence presence info in a MySQL db.
    class MysqlPersister
      def initialize(options)
        EventedMysql.settings.update options
      end
      
      def store(room_id, user_id, state)
        sql = <<-SQL
          INSERT INTO connections (room_id, user_id, state, created_at, updated_at)
          VALUES (#{room_id.to_i}, #{user_id.to_i}, '#{state}', NOW(), NOW())
        SQL
        EventedMysql.insert sql
      end

      def update(room_id, user_id, state)
        sql = <<-SQL
          UPDATE connections
          SET state = '#{state}', updated_at = NOW()
          WHERE room_id = #{room_id} AND user_id = #{user_id}
        SQL
        EventedMysql.update sql
      end

      def delete(room_id, user_id)
        sql = <<-SQL
          DELETE FROM connections
          WHERE room_id = #{room_id.to_i}
          AND user_id = #{user_id.to_i}
        SQL
        EventedMysql.raw sql
      end
      
      # yields [room_id, user_info_hash, state] for each connection
      def load(&callback)
        sql = <<-SQL
          SELECT connections.room_id AS room_id, users.id AS user_id,
                 users.name AS name, users.email AS email,
                 connections.state as state
          FROM connections
          INNER JOIN users ON users.id = connections.user_id
        SQL
        EventedMysql.select(sql) do |results|
          results.each do |result|
            user = {"id" => result["user_id"].to_i, "name" => result["name"], "email" => result["email"]}
            callback.call(result["room_id"].to_i, user, result["state"])
          end
        end
      end
    end
  end
end