module FormHelper
  def submit_button(title="Submit", options={})
    options[:class] = [options.delete(:class), "submit button"].compact.join(" ")
    options[:title] = title
    onclick = options[:onclick] || "$(this).parents('form')[0].submit(); return false;"
    link_to_function title, onclick, options
  end
end
