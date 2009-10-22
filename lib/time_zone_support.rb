module TimeZoneSupport
  def self.included(base)
    base.send :before_filter, :set_time_zone
  end
  
  protected
    # Taken from http://techno-weenie.net/2008/2/6/timezone-awareness-in-rails
    # The browsers give the # of minutes that a local time needs to add to
    # make it UTC, while TimeZone expects offsets in seconds to add to 
    # a UTC to make it local.
    def browser_time_zone
      return nil if cookies[:tzoffset].blank?
      min = cookies[:tzoffset].to_i
      ActiveSupport::TimeZone[-min.minutes]
    end

    def set_time_zone
      @browser_time_zone = browser_time_zone
      
      if logged_in? && @browser_time_zone && @browser_time_zone.name != current_user.time_zone
        logger.info "Setting time zone to #{@browser_time_zone}"
        current_user.update_attribute(:time_zone, @browser_time_zone.name)
      end
      
      Time.zone = logged_in? ? current_user.time_zone : @browser_time_zone
    end
end