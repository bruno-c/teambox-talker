class NullMailer
  def deliver(subject, body)
  end
  
  def deliver_error(message)
    raise message
  end
  
  def deliver_exception(exception, message=nil)
    raise exception
  end
end