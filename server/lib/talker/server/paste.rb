require "openssl"
require "easy_sync"

module Talker::Server
  class Paste
    class InvalidState < RuntimeError; end
    
    # TODO cache only working when one logger is up.
    # need to move cache to memcache or setup some kind of revision number.
    CACHE = Cache.new(
      10 * (1024 ** 2) # Max cache size = 10 MB
    )
    
    MAX_LENGTH = 500 * 1024 # 500 KB
    PREVIEW_LINES = 15
    
    attr_reader :content, :permalink, :preview_lines, :lines, :truncated_content
    
    def initialize(content, channel=nil, permalink=nil, attributions=nil)
      @content = content
      @channel = channel
      @permalink = permalink
      @attributions = attributions
    end
    
    def pasted?
      !!@permalink
    end
    
    def pastable?
      raise ArgumentError, "channel required" unless @channel
      @channel.type == "room" && @content.include?("\n")
    end
    
    def create(force=false)
      raise ArgumentError, "channel required" unless @channel
      
      @content = @content[0, MAX_LENGTH] if @content.size > MAX_LENGTH
      
      if pastable? || force
        truncate!
        
        # Create in DB
        Talker::Server.storage.insert_paste(@channel.id, @permalink, @content)
        true
      else
        false
      end
    end
    
    def reset_attributions
      @attributions = EasySync::Changeset.create_attributions(@content)
    end
    
    def apply(diff, &callback)
      raise ArgumentError, "existing paste required" unless @permalink
      
      changeset = EasySync::Changeset.unpack(diff)
      
      reset_attributions if @attributions.nil? || @attributions.empty?
      
      # Content must end w/ linebreak for easysync to work
      @content = changeset.apply_to_text(@content + "\n").chomp!
      
      if @content.size == 0
        reset_attributions
      else
        @attributions = changeset.apply_to_attributions(@attributions)
      end
      
      Talker::Server.storage.update_paste(@permalink, @content, @attributions, &callback)
    end
    
    def info
      { "id" => @permalink,
        "lines" => @lines,
        "preview_lines" => @preview_lines }
    end
    
    def size
      @content.size
    end
    
    def self.find(permalink)
      # Cached! Yupidoo!
      if paste = CACHE[permalink]
        yield paste
        return
      end
      
      # Cache miss, load from db ...
      Talker::Server.storage.load_paste(permalink) do |content, attributions|
        if content
          # Paste found
          paste = new(content, nil, permalink, attributions)
          CACHE[permalink] = paste
          yield paste
          
        else
          # Paste NOT found
          yield nil
          
        end
      end
    end
    
    def self.truncate(content, channel, force=false)
      paste = new(content, channel)
      
      if paste.create(force)
        yield paste.truncated_content, paste.info
      else
        yield paste.content, nil
      end
    end
    
    private
      def truncate!
        lines = @content.split("\n")

        if lines.size > PREVIEW_LINES
          preview_lines = lines.first(PREVIEW_LINES)
          @truncated_content = preview_lines.join("\n") + "\n..."
        else
          preview_lines = lines
          @truncated_content = content
        end

        @permalink = generate_permalink
        @lines = lines.size
        @preview_lines = preview_lines.size
      end
      
      def generate_permalink
        # Same as ActiveSupport::SecureRandom.hex(10) in Rails
        OpenSSL::Random.random_bytes(10).unpack("H*")[0]
      end
  end
end
