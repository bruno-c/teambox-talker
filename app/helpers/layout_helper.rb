module LayoutHelper
  def flash_tags
    flash.map do |name, message|
      content_tag :div, message, :id => "flash_#{name}", :class => "flash #{name}"
    end.join
  end
end
