class Notification < ActiveRecord::Base
  MAX_RUN_TIME = 10.minutes
  
  belongs_to :room
  belongs_to :account
  
  validates_presence_of :url
  
  # Lot of this shit taken from Delayed::Job
  
  cattr_accessor :worker_name
  self.worker_name = "host:#{Socket.gethostname} pid:#{Process.pid}" rescue "pid:#{Process.pid}"
  
  def failed?
    failed_at
  end
  
  def run_with_lock
    unless lock
      logger.warn "[Notificaton] Failed to acquire lock for ##{id}"
      return nil
    end
    
    begin
      perform
    rescue Exception => e
      self.failed_at = self.class.db_time_now
      logger.error "[Notificaton] ##{id} failed with #{error.class.name}: #{error.message}"
    end
  end
  
  def perform
    feed = Feedzirra::Feed.fetch_and_parse(url, :user_agent => "Talker http://talkerapp.com",
                                                :if_modified_since => fetched_at,
                                                :if_none_match => etag,
                                                :http_authentication => ([user_name, password] if user_name.present?)
    
    feed.entries.select { |e| e.published > last_published_at }.each do |entry|
      send_message entry.title
      send_message entry.url
      send_message entry.content
      self.last_published_at = entry.published
    end
    
    self.fetched_at = feed.last_modified
    self.etag = feed.etag
  end
  
  def send_message(message)
    # TODO
  end
  
  def lock
    now = self.class.db_time_now
    affected_rows = if locked_by != worker
      # We don't own this job so we will update the locked_by name and the locked_at
      self.class.update_all(["locked_at = ?, locked_by = ?", now, worker], ["id = ? and (locked_at is null or locked_at < ?)", id, (now - MAX_RUN_TIME.to_i)])
    else
      # We already own this job, this may happen if the job queue crashes.
      # Simply resume and update the locked_at
      self.class.update_all(["locked_at = ?", now], ["id = ? and locked_by = ?", id, worker])
    end
    if affected_rows == 1
      self.locked_at    = now
      self.locked_by    = worker
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
  
  # Find a few candidate jobs to run (in case some immediately get locked by others).
  # Return in random order prevent everyone trying to do same head job at once.
  def self.find_available(limit = 5)
    time_now = db_time_now

    conditions = ['(run_at <= ? AND (locked_at IS NULL OR locked_at < ?) OR (locked_by = ?)) AND failed_at IS NULL',
                  time_now, time_now - MAX_RUN_TIME, worker_name]

    records = ActiveRecord::Base.silence do
      find(:all, :conditions => conditions, :order => "run_at ASC", :limit => limit)
    end

    records.sort_by { rand() }
  end

  # Run the next job we can get an exclusive lock on.
  # If no jobs are left we return nil
  def self.reserve_and_run_one(max_run_time = MAX_RUN_TIME)

    # We get up to 5 jobs from the db. In case we cannot get exclusive access to a job we try the next.
    # this leads to a more even distribution of jobs across the worker processes
    find_available(5).each do |notifcation|
      t = notifcation.run_with_lock
      return t unless t == nil  # return if we did work (good or bad)
    end

    nil # we didn't do any work, all 5 were not lockable
  end
  
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
