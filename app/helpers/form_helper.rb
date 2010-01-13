module FormHelper
  def submit_button(title="Submit", options={})
    options[:class] = [options.delete(:class), "submit button"].compact.join(" ")
    content_tag :button, title, { :type => "submit", :name => "commit", :value => title }.update(options)
  end
  
  def button_with_icon(title, icon, options={})
    submit_button title, options.merge(:class => "icon #{icon} #{options[:class]}")
  end

  def ok_button(title="Ok", options={})
    button_with_icon title, "ok", options
  end

  def next_button(title="Next", options={})
    button_with_icon title, "next", options
  end

  def cancel_button(url=:back, options={})
    link_to "Cancel", url, options.merge(:class => "button neutral icon cancel #{options[:class]}")
  end
  
  def buttons(ok_title="Save", options={})
    ok_button(ok_title, options) + " or " + cancel_button(options.delete(:cancel_to) || :back, options)
  end
end
