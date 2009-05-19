module MessageHelper
  def format_message(text)
    text = sanitize(text)
    text.gsub!(/\r\n?/, "\n")  # \r\n and \r -> \n
    text.gsub!(/\n/, '<br />') # newline   -> br
    text
  end
  
  def add_message(message)
    page.call "chat.log", message.id, render(:partial => "messages/message", :object => message)
  end
  
  def leave_room(user)
    page.call "chat.leave", user.id, render(:partial => "user", :object => user)
  end
  
  def join_room(user)
    page.call "chat.join", user.id, render(:partial => "user", :object => user)
  end
end