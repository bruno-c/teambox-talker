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
    when "ping"
      # ignore
    end
  rescue Exception => e
    error "Error processing command"
  end
  
  def uid
    "#{@server.port}-#{signature}"
  end
  
  def authenticate(room_name, user, token)
    room = @server.find_room(room_name)
    unless room && room.authenticate(user, token)
      error "Authentication failed"
      return
    end
    
    @room = room
    @user_name = user
    @subscription = @room.subscribe(@user_name, uid) { |message| send_data message }
    presence :join
  rescue SubscriptionError => e
    error "Failed to subscribe to room"
  end
  
  def message_received(id, content)
    error "Not connected to a room" and return unless @room
    
    @room.send_message(%Q|{"type":"message", "id":"#{id}", "content":#{Yajl::Encoder.encode(content)}, "from":"#{@user_name}"}\n|)
  end
  
  def presence(type)
    @room.send_message(%Q|{"type":"#{type}", "user":"#{@user_name}"}\n|)
  end
  
  def error(message)
    send_data(%Q|{"type":"error", "message":"#{message}"}\n|)
    close_connection_after_writing
  end
  
  
  ## EventMachine callbacks
  
  def receive_data(data)
    # continue passing chunks
    @parser << data
  rescue Yajl::ParseError
    error "Invalid JSON"
  end
  
  def unbind
    if @room
      @room.unsubscribe @subscription
      presence :leave
    end
  end
end
