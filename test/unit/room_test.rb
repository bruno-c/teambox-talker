require File.dirname(__FILE__) + "/../test_helper"

class RoomTest < ActiveSupport::TestCase
  def test_creation
    create_room!
  end
end
