module FormHelper
  def submit_button(title="Submit", options={})
    options[:class] = [options.delete(:class), "submit button"].compact.join(" ")
    options[:title] = title
    onclick = options[:onclick] || "$(this).parents('form')[0].submit(); return false;"
    link_to_function title, onclick, options
  end
  
  def ok_button(title="Ok")
    submit_button title, :class => "icon ok"
  end

  def cancel_button(url=:back)
    link_to "Cancel", url, :class => "button negative icon cancel"
  end
  
  def buttons(ok_title="Save", options={})
    ok_button(ok_title) + " or " + cancel_button(options[:cancel_to] || :back)
  end
end
