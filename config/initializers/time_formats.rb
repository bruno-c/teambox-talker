Time::DATE_FORMATS[:js] = lambda { |time| 
  time.strftime("%s").to_i * 1000
}