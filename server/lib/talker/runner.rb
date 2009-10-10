module Talker
  class Runner
    attr_reader :options
    
    def initialize
      @options = {
        :host => Talker::Channel::Server::DEFAULT_HOST,
        :port => Talker::Channel::Server::DEFAULT_PORT,
        :amqp => {
          :host => "localhost",
          :port => 5672
        },
        :descriptor_table_size => 4096,
        :user => nil,
        :logger => nil,
        :debug => false,
        :database => {
          :database => "talker_development",
          :user => "root",
          :password => "",
          :host => "localhost"
        }
      }
    end
    
    def [](name)
      @options[name]
    end

    def []=(name, value)
      @options[name] = value
    end
    
    def run(service)
      EM.run do
        start_amqp
        
        server = case service
        when "channel"
          build_channel_server
        when "presence"
          build_presence_server
        when "logger"
          build_logger
        else
          raise ArgumentError, "Invalid service name: " + service.inspect +
                               ", accepted services are: channel, presence, logger"
        end
        
        config_limits
        config_logger
        install_signals server

        $0 = "talker-#{server.to_s}"
        puts "Starting #{server.to_s} ..."
        server.start
      end
    end
    
    def start_amqp
      require "amqp"
      puts "Connected to AMQP on #{options[:amqp][:host]}:#{options[:amqp][:port]}"
      AMQP.connect :host => options[:amqp][:host], :port => options[:amqp][:port]
    end
    
    def install_signals(server)
      trap('INT') do
        puts "Stopping ..."
        server.stop
        # FIXME hang
        #AMQP.stop { EM.stop }
        EM.stop
      end
    end
    
    def config_limits
      if options[:descriptor_table_size]
        size = EM.set_descriptor_table_size options[:descriptor_table_size]
        puts "Descriptor table size set to #{size}"
      end
      if options[:user]
        puts "Running as user #{options[:user]}"
        EM.set_effective_user options[:user]
      end
    end
    
    def config_logger
      require "logger"
      if options[:logger]
        Talker.logger = ::Logger.new(options[:logger])
      else
        Talker.logger = ::Logger.new(STDOUT)
      end
      if options[:debug]
        Talker.logger.level = ::Logger::DEBUG
      else
        Talker.logger.level = ::Logger::INFO
      end
      Talker.logger.debug "Demo mode ACTIVATED!"
    end
    
    def build_channel_server
      server = Talker::Channel::Server.new(:host => options[:host], :port => options[:port])
      server.authenticator = Talker::MysqlAuthenticator.new(options[:database])
      server
    end

    def build_presence_server
      persister = Talker::Presence::MysqlPersister.new(options[:database])
      Talker::Presence::Server.new(persister)
    end
    
    def build_logger
      Talker::Logger.new options[:database]
    end
  end
end