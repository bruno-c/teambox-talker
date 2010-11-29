require File.dirname(__FILE__) + "/../../test_helper"

class DateHelperTest < ActionView::TestCase
  it "human date" do
    today = Time.zone.now 
    day_before_yesterday, yesterday, tomorrow, day_after_tomorrow = today - 2.days, today - 1.day, today + 1.day, today + 2.days 
     
    assert_match "Today", human_date(today)
    assert_match "Today", human_date(today.to_date)
    assert_match "Today", human_date(today.beginning_of_day) 
    assert_match "Today", human_date(tomorrow.beginning_of_day - 1.second) 
     
    assert_match "Yesterday", human_date(yesterday) 
    assert_match "Yesterday", human_date(yesterday.to_date) 
    assert_match "Yesterday", human_date(yesterday.beginning_of_day) 
    assert_match "Yesterday", human_date(today.beginning_of_day - 1.second) 
     
    assert_match "Tomorrow", human_date(tomorrow) 
    assert_match "Tomorrow", human_date(tomorrow.to_date) 
    assert_match "Tomorrow", human_date(tomorrow.beginning_of_day) 
    assert_match "Tomorrow", human_date(day_after_tomorrow.beginning_of_day - 1.second) 
  end
end
