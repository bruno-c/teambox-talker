module FormattingHelper
  def escape_json(json)
    json.gsub(/&/, '&amp;').
         gsub(/</, '&lt;').
         gsub(/>/, '&gt;')
  end
end
