module FormattingHelper
  def escape_json(json)
    json.gsub(/&/, '&amp;').
         gsub(/</, '&lt;').
         gsub(/>/, '&gt;')
  end
  
  def current_view
    @template.instance_variable_get(:@_first_render).name
  end
  
  def possessive(noun)
    noun + (noun.ends_with?("s") ? "'" : "'s")
  end
end
