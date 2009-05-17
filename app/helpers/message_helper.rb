module MessageHelper
  def format_message(text)
    text = sanitize(text)
    text.gsub!(/\r\n?/, "\n")  # \r\n and \r -> \n
    text.gsub!(/\n/, '<br />') # newline   -> br
    text
  end
end