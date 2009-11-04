module UrlHelper
  def link_to_with_active(name, url, options = {})
    link_to name, url, options.merge(:class => [options[:class], ('active' if current_page?(url))].compact.join(' '))
  end
  
  def root_url
    "#{request.protocol}#{request.host_with_port}/"
  end
end
