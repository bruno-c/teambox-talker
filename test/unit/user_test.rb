require File.dirname(__FILE__) + "/../test_helper"

class UserTest < ActiveSupport::TestCase
  def test_creation
    create_user!
  end
end
