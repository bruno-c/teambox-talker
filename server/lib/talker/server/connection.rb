require "yajl"

class Talker::Server::Connection < EM::Connection
  attr_accessor :server
  
  def post_init
    @parser = Yajl::Parser.new
    # once a full JSON object has been parsed from the stream
    # object_parsed will be called, and passed the constructed object
    @parser.on_parse_complete = method(:object_parsed)
    @encoder = Yajl::Encoder.new
    
    @room = nil
  end

  def object_parsed(obj)
    @last_message_at = Time.now
    puts "#{@user_name || '?'}: " + obj.inspect
    
    case obj["type"]
    when "connect"
      authenticate obj["room"], obj["user"], obj["token"]
    when "message"
      message_received obj["id"], obj["content"]
    when "close"
      close
    when "ping"
      # ignore
    end
  end
  
  def authenticate(room_name, user, token)
    room = @server.find_room(room_name)
    unless room && room.authenticate(user, token)
      close "Authentication failed"
      return
    end
    
    @room = room
    @user_name = user
    @subscription_id = @room.subscribe { |message| send_data message }
    presence :join
  end
  
  def message_received(id, content)
    close "Not connected to a room" and return unless @room
    
    @room.send_message(%Q|{"type":"message", "id":"#{id}", "content":#{Yajl::Encoder.encode(content)}, "from":"#{@user_name}"}\n|)
  end
  
  def presence(type)
    @room.send_message(%Q|{"type":"#{type}", "user":"#{@user_name}"}\n|)
  end
  
  def close(error_message=nil)
    send_data(%Q|{"type":"error", "message":"#{error_message}"}\n|) if error_message
    close_connection_after_writing
  end
  
  
  ## EventMachine callbacks
  
  def receive_data(data)
    # continue passing chunks
    @parser << data
  rescue Yajl::ParseError
    close "Invalid JSON"
  end
  
  def unbind
    if @room
      @room.unsubscribe @subscription_id
      presence :leave
    end
  end
end
