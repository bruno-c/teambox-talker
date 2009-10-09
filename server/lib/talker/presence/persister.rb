require "em/mysql"

module Talker
  module Presence
    # Persistence presence info in a MySQL db.
    class Persister
      def initialize(options)
        EventedMysql.settings.update options
      end
      
      def store(room_id, user_id)
        sql = <<-SQL
          INSERT INTO connections (room_id, user_id, created_at, updated_at)
          VALUES (#{room_id.to_i}, #{user_id.to_i}, NOW(), NOW())
        SQL
        EventedMysql.insert sql
      end

      def delete(room_id, user_id)
        sql = <<-SQL
          DELETE FROM connections (room_id, user_id)
          WHERE room_id = #{room_id.to_i}
          AND user_id = #{user_id.to_i}
        SQL
        EventedMysql.delete sql
      end
      
      # yields [room_id, user_info_hash] for each connection
      def load(&callback)
        sql = <<-SQL
          SELECT connections.room_id AS room_id, users.id AS user_id, users.name AS name, users.email AS email
          FROM connections
          INNER JOIN users ON users.id = connections.user_id
        SQL
        EventedMysql.select(sql) do |results|
          results.each do |room_id, user_id, name, email|
            callback.call(room_id, {"id" => user_id, "name" => name, "email" => email})
          end
        end
      end
    end
  end
end