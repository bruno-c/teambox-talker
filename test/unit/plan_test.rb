require File.dirname(__FILE__) + "/../test_helper"

class PlanTest < ActiveSupport::TestCase
  def test_free_subscribe_url
    assert_equal "/", Plan.free.subscribe_url(accounts(:master), "/")
  end

  def test_paying_subscribe_url
    url = Plan.all[1].subscribe_url(accounts(:master), "/")
    assert_match "https://spreedly.com/", url
    assert_match "/master?", url
    assert_match "return_url=%2F", url
    assert_match "first_name=quentin", url
    assert_match "email=quentin%40example.com", url
  end
end