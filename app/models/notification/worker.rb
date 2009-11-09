class Notification
  class Worker
    SLEEP = 5

    cattr_accessor :logger
    self.logger = RAILS_DEFAULT_LOGGER

    def initialize(options={})
      @quiet = options[:quiet]
    end

    def start
      say "*** Starting notification worker #{Notification.worker_name}"

      trap('TERM') { say "Exiting in <= #{SLEEP}s..."; Notification.stop = true }
      trap('INT')  { say 'Exiting in <= #{SLEEP}s...'; Notification.stop = true }

      loop do
        result = nil

        realtime = Benchmark.realtime do
          result = Notification.work
        end

        count = result.sum

        break if Notification.stop

        if count.zero?
          sleep(SLEEP)
        else
          say "#{count} notifications processed at %.4f j/s, %d failed ..." % [count / realtime, result.last]
        end

        break if $exit
      end

    ensure
      Notification.clear_locks!
    end

    def say(text)
      puts text unless @quiet
      logger.info text if logger
    end
  end
end