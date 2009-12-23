require File.dirname(__FILE__) + "/../test_helper"

class RoomTest < ActiveSupport::TestCase
  def setup
    @room = rooms(:main)
  end
  
  def test_creation
    create_room!
  end
  
  def test_admin_has_access_to_all_rooms
    assert_equal Room.count, Room.with_permission(users(:quentin)).count
  end
  
  def test_user_has_not_access_to_all_rooms
    assert_not_equal Room.count, Room.with_permission(users(:aaron)).count
  end
  
  def test_send_message
    @room.expects(:publish).with do |event|
      assert_equal 'message', event[:type]
      assert_equal "ohaie\nthere", event[:content]
      assert_not_nil event[:time]
      assert_not_nil event[:id]
      assert_equal User.talker, event[:user]
      true
    end
    @room.send_message("ohaie\nthere")
  end

  def test_send_messages
    @room.expects(:publish).with do |*events|
      assert_equal 'ohaie', events[0][:content]
      assert_equal 'there', events[1][:content]
      events.all? do |event|
        assert_equal 'message', event[:type]
        assert_not_nil event[:time]
        assert_not_nil event[:id]
        assert_equal User.talker, event[:user]
        true
      end
    end
    @room.send_message(["ohaie", "there"])
  end

  def test_send_pasteless_messages
    @room.expects(:publish).with do |*events|
      events.all? do |event|
        assert_nil event[:paste]
        assert_equal "dude", event[:pass_that]
        true
      end
    end
    @room.send_message(["ohaie\nyou", "ohaie\nme"], :paste => false, :pass_that => "dude")
  end
  
  def test_add_permission
    Permission.delete_all
    assert_difference "Permission.count", 1 do
      @room.private = true
      @room.invitee_ids = [users(:aaron).id]
      @room.save
    end
  end
  
  def test_remove_permission
    @room.private = true
    @room.invitee_ids = []
    @room.save
    assert_equal 0, @room.permissions.count
  end

  def test_public_room_delete_all_permissiosn
    @room.private = false
    @room.invitee_ids = [users(:aaron).id]
    @room.save
    assert_equal 0, @room.permissions.count
  end
end
