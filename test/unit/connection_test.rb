require File.dirname(__FILE__) + "/../test_helper"

class ConnectionTest < ActiveSupport::TestCase
  def test_account_on_room
    assert_equal rooms(:main).account, Connection.new(:channel => rooms(:main)).account
  end

  def test_account_on_paste
    assert_equal pastes(:poem).room.account, Connection.new(:channel => pastes(:poem)).account
  end

  def test_account_on_nil
    assert_equal nil, Connection.new.account
  end
end
