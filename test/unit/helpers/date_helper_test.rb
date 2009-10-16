require File.dirname(__FILE__) + "/../../test_helper"

class DateHelperTest < ActionView::TestCase
  def test_human_date 
    today = Time.now 
    day_before_yesterday, yesterday, tomorrow, day_after_tomorrow = today - 2.days, today - 1.day, today + 1.day, today + 2.days 
     
    assert_equal "Today", human_date(today) 
    assert_equal "Today", human_date(today.to_date) 
    assert_equal "Today", human_date(today.beginning_of_day) 
    assert_equal "Today", human_date(tomorrow.beginning_of_day - 1.second) 
     
    assert_equal "Yesterday", human_date(yesterday) 
    assert_equal "Yesterday", human_date(yesterday.to_date) 
    assert_equal "Yesterday", human_date(yesterday.beginning_of_day) 
    assert_equal "Yesterday", human_date(today.beginning_of_day - 1.second) 
     
    assert_equal "Tomorrow", human_date(tomorrow) 
    assert_equal "Tomorrow", human_date(tomorrow.to_date) 
    assert_equal "Tomorrow", human_date(tomorrow.beginning_of_day) 
    assert_equal "Tomorrow", human_date(day_after_tomorrow.beginning_of_day - 1.second) 
     
    assert_equal day_before_yesterday.strftime("%B %e, %Y"), human_date(day_before_yesterday, "%B %e, %Y") 
    assert_equal day_before_yesterday.strftime("%B %e, %Y"), human_date(day_before_yesterday.to_date, "%B %e, %Y") 
     
    assert_equal day_after_tomorrow.strftime("%B %e, %Y"), human_date(day_after_tomorrow, "%B %e, %Y") 
    assert_equal day_after_tomorrow.strftime("%B %e, %Y"), human_date(day_after_tomorrow.to_date, "%B %e, %Y") 
  end
end
