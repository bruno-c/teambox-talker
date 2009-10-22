class NullMailer
  def deliver(subject, body)
  end
  
  def deliver_error(message)
  end
  
  def deliver_exception(exception, message=nil)
  end
end