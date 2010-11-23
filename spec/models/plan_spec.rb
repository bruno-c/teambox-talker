require File.dirname(__FILE__) + "/../spec_helper"

describe Plan do
  it "paying subscribe url" do
    account = Factory(:account, :subdomain => 'master')
    user = Factory(:admin_user, :name => 'quentin', :email => 'quentin@example.com')
    account.users << user
    url = Plan.all[1].subscribe_url(account, "/")
    url.should match("https://spreedly.com/")
    url.should match("/master?")
    url.should match("return_url=%2F")
    url.should match("first_name=quentin")
    url.should match("email=quentin%40example.com")
  end
end
