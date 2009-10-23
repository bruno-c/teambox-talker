module DateHelper
  def human_date(date) 
    return "" if date.blank?
    
    today = Time.zone.today
    date = date.to_date
    
    prefix = case today - date
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
end
