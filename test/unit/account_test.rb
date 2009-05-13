require File.dirname(__FILE__) + "/../test_helper"

class AccountTest < ActiveSupport::TestCase
  def test_creation
    create_account!
  end
end
