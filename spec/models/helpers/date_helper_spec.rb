require File.dirname(__FILE__) + "/../../spec_helper"

describe DateHelper do
  include DateHelper

  it "humanizes date" do
    today = Time.zone.now 
    day_before_yesterday, yesterday, tomorrow, day_after_tomorrow = today - 2.days, today - 1.day, today + 1.day, today + 2.days 
    
    human_date(today).should match("Today")
    human_date(today.to_date).should match("Today")
    human_date(today.beginning_of_day).should match("Today")
    human_date(tomorrow.beginning_of_day - 1.second).should match("Today")
    
    human_date(yesterday).should match("Yesterday")
    human_date(yesterday.to_date).should match("Yesterday")
    human_date(yesterday.beginning_of_day).should match("Yesterday")
    human_date(today.beginning_of_day - 1.second).should match("Yesterday")
    
    human_date(tomorrow).should match("Tomorrow")
    human_date(tomorrow.to_date).should match("Tomorrow")
    human_date(tomorrow.beginning_of_day).should match("Tomorrow")
    human_date(day_after_tomorrow.beginning_of_day - 1.second).should match("Tomorrow")
  end
end
