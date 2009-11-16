class Feed
  class Worker
    SLEEP = 5

    cattr_accessor :logger
    self.logger = RAILS_DEFAULT_LOGGER

    def initialize(options={})
      @quiet = options[:quiet]
    end

    def start
      say "*** Starting notification worker #{Feed.worker_name}"

      trap('TERM') { say "Exiting in ~ #{SLEEP}s..."; Feed.stop = true }
      trap('INT')  { say "Exiting in ~ #{SLEEP}s..."; Feed.stop = true }
      
      EM.run do
        run
      end

    ensure
      Feed.clear_locks!
    end
    
    def run
      result = nil
      
      stop and return if Feed.stop

      realtime = Benchmark.realtime do
        result = Feed.work
      end

      count = result.sum

      stop and return if Feed.stop

      if count.zero?
        EM.add_timer(SLEEP) { run }
        return
      else
        say "#{count} feeds processed at %.4f j/s, %d failed ..." % [count / realtime, result.last]
        EM.next_tick { run }
      end
    end
    
    def stop
      EM.stop
    end

    def say(text)
      puts text unless @quiet
      logger.info text if logger
    end
  end
end