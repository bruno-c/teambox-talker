require File.dirname(__FILE__) + "/../test_helper"

class RoomTest < ActiveSupport::TestCase
  def setup
    @room = rooms(:main)
  end
  
  def test_creation
    create_room!
  end
  
  def test_channel
    room = Room.new
    room.stubs(:id).returns(123)
    assert_equal "rooms/123", room.channel
  end
  
  def test_join
    assert_not_nil @room.join(users(:quentin))
  end

  def test_join_twice_returns_nil
    assert_not_nil @room.join(users(:quentin))
    assert_nil @room.join(users(:quentin))
  end
  
  def test_leave
    assert_nil @room.leave(users(:quentin))
  end

  def test_leave_when_connected
    @room.join(users(:quentin))
    assert_not_nil @room.leave(users(:quentin))
  end
end
