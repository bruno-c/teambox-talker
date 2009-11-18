module UrlHelper
  def link_to_with_active(name, url, options = {})
    link_to name, url, options.merge(:class => [options[:class], ('active' if current_page?(url))].compact.join(' '))
  end
  
  def root_url
    "#{request.protocol}#{request.host_with_port}/"
  end
  
  def link_to_log(room, date, options={})
    link_to [options.delete(:prefix), human_date(date), options.delete(:postfix)].compact.join(" "),
            room_log_path(room, date.year, date.month, date.day), options
  end
end
