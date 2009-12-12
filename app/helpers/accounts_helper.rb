module AccountsHelper
  def will_downgrade_to_free
    !@account.recurring
  end
  
  def up_down_grade(plan)
    plan > @account.plan ? "Upgrade" : "Downgrade"
  end
  
  def meter_tag(rate)
    content_tag(:div,
      content_tag(:span, "&nbsp;", :style => "width: #{number_to_percentage rate * 100.0}"),
      :class => "meter")
  end
end
