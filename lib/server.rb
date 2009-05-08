require File.dirname(__FILE__) + "/../config/boot.rb"
require "eventmachine"
require "json"

class Server < EM::Connection
  POLICY_FILE_REQUEST = "<policy-file-request/>".freeze
  POLICY_RESPONSE = %[
    <?xml version="1.0"?>
    <!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">
    <cross-domain-policy>
      <allow-access-from domain="*" to-ports="*" />
    </cross-domain-policy>
  \0].freeze
  @@connections = Hash.new { |h, k| h[k] = [] }
  
  def self.start(host, port)
    EM.run do
      puts ">> Listening on #{host}:#{port}"
      EM.start_server host, port, self
    end
  end

  def post_init
    @buf = BufferedTokenizer.new("\0")
    @ip = Socket.unpack_sockaddr_in(get_peername).last rescue '0.0.0.0'
    puts ">> got connection from #{@ip}"
  end

  def unbind
    puts ">> got disconnect from #{@ip}"
    @@connections.each do |room, connections|
      connections.delete(self)
    end
  end
  
  def receive_data(data)
    if data.strip == POLICY_FILE_REQUEST
      send_data POLICY_RESPONSE
      close_connection_after_writing
      return
    end
    
    @buf.extract(data).each do |packet|
      json = JSON.parse(packet)
      puts ">> got packet from #{@ip}: #{json.inspect}"
      
      room = json["room"]
      
      # TODO optimize this
      connections = @@connections[room]
      connections << self unless connections.include?(self)
      
      puts ">> Now #{connections.size} users in room #{room}"
      
      if json["type"] == "message"
        publish_message room, json["user"], json["message"]
      end
    end
  end
  
  def publish_message(room_id, user_id, content)
    # TODO validate args
    
    # TODO make async
    message = Message.create :room_id => room_id, :user_id => user_id, :content => content
    user = User.select(:name)[:id => 1]
    
    @@connections[room_id].each do |connection|
      connection.send_message user, message
    end
  end
  
  def send_message(user, message)
    data = %({"user":#{user.name.to_json},"content":#{message.content.to_json}}\0)
    puts ">> sending to #{@ip}: #{data}"
    send_data data
  end
end

trap("INT") { EM.stop }
Server.start "0.0.0.0", 1234
