class Notification < ActiveRecord::Base
  MAX_RUN_TIME   = 1.hour     # Max time a job can run before it is considered as failed
  INTERVAL       = 10.minutes # Interval of check for due notifications
  MAX_MESSAGES   = 10         # Make number of message sent per notification fetch
  
  belongs_to :room
  belongs_to :account
  
  validates_presence_of :url
  
  # Lot of this shit taken from Delayed::Job
  
  cattr_accessor :worker_name
  self.worker_name = "host:#{Socket.gethostname} pid:#{Process.pid}" rescue "pid:#{Process.pid}"
  
  cattr_accessor :stop
  self.stop = false
  
  def failed?
    failed_at
  end
  
  def run_at
    ran_at + INTERVAL
  end
  
  def run_with_lock
    unless lock
      logger.warn "[Notificaton] Failed to acquire lock for ##{id}"
      return nil
    end
    
    begin
      perform
      self.failed_at = self.last_error = nil
      return true  # did work
    rescue Exception => error
      self.failed_at = self.class.db_time_now
      self.last_error = error.message
      logger.error "[Notificaton] ##{id} failed with #{error.class.name}: #{error.message}"
      logger.error error.backtrace.join("\n")
      return false  # work failed
    end
  ensure
    unlock
    self.ran_at = self.class.db_time_now
    save(false)
  end
  
  def perform
    options = { :user_agent => "Talker http://talkerapp.com" }
    options[:if_modified_since] = fetched_at if fetched_at
    options[:if_none_match] = etag if etag
    options[:http_authentication] = [user_name, password] if user_name.present?
    
    feed = Feedzirra::Feed.fetch_and_parse(url, options)
    
    # Returns a HTTP response code if not modified
    if feed.is_a?(Fixnum)
      return
    end
    
    entries = feed.entries
    
    # If we already fetch, do not publish duplicates
    if last_published_at
      entries = entries.select { |e| e.published > last_published_at }
    end
    
    entries.first(MAX_MESSAGES).each do |entry|
      send_message entry.title
      send_message entry.url
      send_message entry.content
      self.last_published_at = entry.published
    end
    
    self.fetched_at = feed.last_modified
    self.etag = feed.etag
  end
  
  def send_message(message)
    puts message
  end
  
  def lock
    now = self.class.db_time_now
    affected_rows = if locked_by != worker_name
      # We don't own this job so we will update the locked_by name and the locked_at
      self.class.update_all(["locked_at = ?, locked_by = ?", now, worker_name], ["id = ? and (locked_at is null or locked_at < ?)", id, (now - MAX_RUN_TIME.to_i)])
    else
      # We already own this job, this may happen if the job queue crashes.
      # Simply resume and update the locked_at
      self.class.update_all(["locked_at = ?", now], ["id = ? and locked_by = ?", id, worker_name])
    end
    if affected_rows == 1
      self.locked_at    = now
      self.locked_by    = worker_name
      return true
    else
      return false
    end
  end

  # Unlock this job (note: not saved to DB)
  def unlock
    self.locked_at    = nil
    self.locked_by    = nil
  end
  
  # Do num jobs and return stats on success/failure.
  # Exit early if interrupted.
  def self.work(num = 100)
    success, failure = 0, 0

    num.times do
      case self.reserve_and_run_one
      when true
        success += 1
      when false
        failure += 1
      else
        break  # leave if no work could be done
      end
      break if stop # leave if we're exiting
    end

    return [success, failure]
  end
  
  # Run the next job we can get an exclusive lock on.
  # If no jobs are left we return nil
  def self.reserve_and_run_one

    # We get up to 5 jobs from the db. In case we cannot get exclusive access to a job we try the next.
    # this leads to a more even distribution of jobs across the worker processes
    find_available(5).each do |notifcation|
      t = notifcation.run_with_lock
      return t unless t == nil  # return if we did work (good or bad)
    end

    nil # we didn't do any work, all 5 were not lockable
  end
  
  # Find a few candidate jobs to run (in case some immediately get locked by others).
  # Return in random order prevent everyone trying to do same head job at once.
  def self.find_available(limit)
    time_now = db_time_now

    conditions = ['(ran_at <= ? or ran_at IS NULL) AND (locked_at IS NULL OR locked_at < ?) OR (locked_by = ?)',
                  time_now - INTERVAL, time_now - MAX_RUN_TIME, worker_name]

    records = ActiveRecord::Base.silence do
      find(:all, :conditions => conditions, :order => "ran_at ASC", :limit => limit)
    end

    records.sort_by { rand() }
  end
  
  private
    # Get the current time (GMT or local depending on DB)
    # Note: This does not ping the DB to get the time, so all your clients
    # must have syncronized clocks.
    def self.db_time_now
      (ActiveRecord::Base.default_timezone == :utc) ? Time.now.utc : Time.zone.now
    end
  
    def self.clear_locks!
      update_all("locked_by = null, locked_at = null", ["locked_by = ?", worker_name])
    end
end
