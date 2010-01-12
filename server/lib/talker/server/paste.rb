require "openssl"
require "easy_sync"

module Talker::Server
  class Paste
    class NotFound < RuntimeError; end
    
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
      @channel.type == "room" && @content.include?("\n")
    end
    
    def create(force=false)
      raise ArgumentError, "channel required" unless @channel
      
      @content = @content[0, MAX_LENGTH] if @content.size > MAX_LENGTH
      
      if pastable? || force
        truncate!
        @attributions = EasySync::Changeset.create_attributions(@content)
        
        # Create in DB
        Talker::Server.storage.insert_paste(@channel.id, @permalink, @content, @attributions)
        true
      else
        false
      end
    end
    
    def apply(diff, &callback)
      raise ArgumentError, "existing paste required" unless @permalink && @attributions
      
      changeset = EasySync::Changeset.unpack(diff)
      # Content must end w/ linebreak for easysync to work
      @content = changeset.apply_to_text(@content + "\n").chomp!
      if @content.size == 0
        # Reset attributions
        @attributions = EasySync::Changeset.create_attributions(@content)
      else
        @attributions = changeset.apply_to_attributions(@attributions)
      end
      
      Talker::Server.storage.update_paste(@permalink, @content, @attributions, &callback)
    rescue EasySync::InvalidChangeset => e
      Talker::Server.logger.warn "Ignoring invalid changeset (#{e}): #{diff.inspect}"
    end
    
    def info
      { "id" => @permalink,
        "lines" => @lines,
        "preview_lines" => @preview_lines }
    end
    
    def self.find(permalink)
      Talker::Server.storage.load_paste(permalink) do |content, attributions|
        raise NotFound, "Paste #{permalink} not found" unless content
        yield new(content, nil, permalink, attributions)
      end
    end
    
    def self.truncate(channel, content, force)
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
