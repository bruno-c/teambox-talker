module DateHelper
  def human_date(date) 
    return "" if date.blank?
    
    today = Time.zone.today
    date = date.to_date
    prefix = case (today - date).to_i
      when  1 then "Yesterday, "
      when  0 then "Today, "
      when -1 then "Tomorrow, "
      else "%A, "
      end
    
    sufix = if today.year != date.year
      ", %Y"
    end
    
    date.strftime("#{prefix}%B %e#{sufix}")
  end
  
  def human_day(date)
    return "" if date.blank?
    
    today = Time.zone.today
    date = date.to_date
    
    format = case (today - date).to_i
    when  1 then "Yesterday"
    when  0 then "Today"
    when -1 then "Tomorrow"
    else "%A"
    end
    
    date.strftime(format)
  end
  
  def month_name(date)
    date.strftime("%B")
  end
  
  def same_month?(date1, date2=Date.today)
    date1.year == date2.year && date1.month == date2.month
  end
  
  def months_until(until_date)
    date = Date.today
    dates = [date]
    while date > until_date.to_date
      date = date.months_ago(1)
      dates << date
    end
    dates
  end
end
