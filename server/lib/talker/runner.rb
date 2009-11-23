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
    
    def reset
      config_logger
      EM.run do
        start_amqp
        log "Deleting queues and exchanges"
        Queues.delete
        stop_amqp
      end
    end
    
    def run(service)
      config_logger
      config_mailer
      config_limits
      
      EM.run do
        start_amqp
        start_mysql
        
        create_queues
        
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
        
        install_signals server
      
        $0 = "talker-#{server.to_s}"
        log "Starting #{server.to_s} ..."
        server.start
      end
    end
    
    def start_mysql
      Talker.storage = MysqlAdapter.new(options[:database])
    end
    
    def start_amqp
      require "amqp"
      log "Connected to AMQP on #{options[:amqp][:host]}:#{options[:amqp][:port]}"
      AMQP.start :host => options[:amqp][:host], :port => options[:amqp][:port]
    end
    
    def create_queues
      log "Creating core queues and exchanges"
      Queues.create
    end
    
    def stop_amqp
      log "Waiting for AMQP to finish ..."
      AMQP.stop do
        log "Terminating event loop"
        EM.stop
      end
    end
    
    def install_signals(server)
      trap('INT') do
        Talker.logger.info "INT signal received, soft stopping ..."
        log "Closing server connections ..."
        server.stop do
          stop_amqp
        end
      end
      trap('QUIT') do
        log "QUIT signal received, hard stopping ..."
        log "Terminating event loop"
        EM.stop
      end
    end
    
    def config_limits
      if options[:descriptor_table_size]
        size = EM.set_descriptor_table_size options[:descriptor_table_size]
        log "Descriptor table size set to #{size}"
      end
      if options[:user]
        log "Running as user #{options[:user]}"
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
      Talker.logger.debug "Debug mode ACTIVATED!"
    end
    
    def config_mailer
      Talker.mailer = Talker::Mailer.new
    end
    
    def build_channel_server
      Talker::Channel::Server.new(:host => options[:host], :port => options[:port])
    end

    def build_presence_server
      Talker::Presence::Server.new
    end
    
    def build_logger
      Talker::Logger::Server.new
    end
    
    def log(msg)
      Talker.logger.info msg
    end
  end
end