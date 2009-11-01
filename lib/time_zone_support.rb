module TimeZoneSupport
  def self.included(base)
    base.send :before_filter, :set_time_zone
  end
  
  protected
    def browser_time_zone
      return nil if cookies[:tzoffset].blank?
      min = cookies[:tzoffset].to_i
      offset_seconds = -min.minutes
      # Try to find the proper timezone taking into account DST
      # taken from: http://spongetech.wordpress.com/2009/02/27/detecting-browser-time-zone-with-rails/#comment-725
      ActiveSupport::TimeZone.us_zones.find { |z| ((z.now.dst? && z.utc_offset == offset_seconds-3600) || (!z.now.dst? && z.utc_offset == offset_seconds)) && !["Arizona","Chihuahua","Mazatlan"].include?(z.name)}
    end

    def set_time_zone
      if logged_in?
        if current_user.time_zone.nil? && time_zone = browser_time_zone
          logger.info "Setting time zone to #{time_zone.name}"
          current_user.update_attribute(:time_zone, time_zone.name)
        end
        Time.zone = current_user.time_zone
      else
        Time.zone = browser_time_zone
      end
    end
end