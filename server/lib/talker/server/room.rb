class Talker::Server::Room
  attr_reader :name
  
  def initialize(name)
    @name = name
    @channel = EM::Channel.new
  end
  
  def authenticate(user, token)
    # TODO
    true
  end
  
  def subscribe(&block)
    @channel.subscribe(&block)
  end
  
  def unsubscribe(sid)
    @channel.unsubscribe(sid)
  end
  
  def send_message(data)
    @channel.push(data)
  end
end