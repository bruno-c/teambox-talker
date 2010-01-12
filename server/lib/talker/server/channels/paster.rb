require "openssl"

module Talker::Server
  module Channels
    class Paster
      MAX_LENGTH = 500 * 1024 # 500 KB
      PREVIEW_LINES = 15
    
      def self.truncate(channel, content, force=false)
        content = content[0, MAX_LENGTH] if content.size > MAX_LENGTH
        
        if pastable?(channel, content) || force
          truncated_content, paste_info = paste(channel.id, content)
          yield truncated_content, paste_info
        else
          yield content, nil
        end
      end
    
      def self.paste(room_id, content)
        lines = content.split("\n")
      
        if lines.size > PREVIEW_LINES
          preview_lines = lines.first(PREVIEW_LINES)
          truncated_content = preview_lines.join("\n") + "\n..."
        else
          preview_lines = lines
          truncated_content = content
        end
      
        permalink = generate_permalink
      
        # Insert in DB
        Talker::Server.storage.insert_paste(room_id, permalink, content)
      
        paste_info = {
          "id" => permalink,
          "lines" => lines.size,
          "preview_lines" => preview_lines.size
        }
      
        [truncated_content, paste_info]
      end
    
      def self.pastable?(channel, content)
        channel.type == "room" && content.include?("\n")
      end
    
      def self.generate_permalink
        # Same as ActiveSupport::SecureRandom.hex(10) in Rails
        OpenSSL::Random.random_bytes(10).unpack("H*")[0]
      end
    end
  end
end
