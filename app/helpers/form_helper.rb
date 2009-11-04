module FormHelper
  def submit_button(title="Submit", options={})
    options[:class] = [options.delete(:class), "submit button"].compact.join(" ")
    content_tag :button, title, { :type => "submit", :name => "commit", :value => title }.update(options)
  end
  
  def ok_button(title="Ok", options={})
    submit_button title, options.merge(:class => "icon ok #{options[:class]}")
  end

  def cancel_button(url=:back, options={})
    link_to "Cancel", url, options.merge(:class => "button negative icon cancel #{options[:class]}")
  end
  
  def buttons(ok_title="Save", options={})
    ok_button(ok_title, options) + " or " + cancel_button(options.delete(:cancel_to) || :back, options)
  end
end
