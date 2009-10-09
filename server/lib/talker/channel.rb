require "mq"
require "yajl"

module Talker
  class Channel
    CHANNEL_PREFIX = "talker.channel".freeze
    USER_CHANNEL_PREFIX = "talker.connection".freeze
    LOG_CHANNEL = "talker.log".freeze
    
    attr_reader :name
    
    def initialize(name)
      @name = name
      @users = {}
      
      @exchange = MQ.fanout("#{CHANNEL_PREFIX}.#{@name}")
      
      # Redistribute all messages to Logger service.
      MQ.queue(LOG_CHANNEL).bind(@exchange)
      
      @encoder = Yajl::Encoder.new
    end
    
    def users
      @users.values
    end
    
    # Add a user w/o broadcasting presence
    def <<(user)
      @users[user.id] = user
    end
    
    def present?(user)
      @users.key?(user.id)
    end
    
    def join(user)
      unless present?(user)
        send_message :type => "join", :user => user.info
        # Send list of online users to new user
        send_private_message user.id, :type => "users", :users => users.map { |user| user.info }
        @users[user.id] = user
      end
    end
    
    def leave(user)
      if present?(user)
        send_message :type => "leave", :user => user.info
        @users.delete(users.id)
      end
    end
    
    def send_message(message)
      @encoder.encode(message) do |chunk|
        @exchange.publish(chunk)
      end
    end
    
    def send_private_message(user_id, message)
      queue = user_queue(user_id)
      @encoder.encode(message) do |chunk|
        queue.publish(chunk)
      end
    end
    
    def user_queue(user_id)
      MQ.queue("#{USER_CHANNEL_PREFIX}.#{@name}.#{user_id}")
    end
  end
end