require File.dirname(__FILE__) + "/../test_helper"

class PermissionTest < ActiveSupport::TestCase
  def test_cant_add_admin
    permission = rooms(:main).permissions.create(:user => users(:quentin))
    assert_not_nil permission.errors.on(:user)
  end
  
  def test_admin_can_access_all_rooms
    assert users(:quentin).permission?(rooms(:main))
    assert users(:quentin).permission?(Room.new)
  end
  
  def test_everyone_can_access_public
    Permission.delete_all
    rooms(:main).update_attribute :private, false
    assert users(:aaron).permission?(rooms(:main))
  end
  
  def test_restricted_user_can_access_private_rooms
    Permission.delete_all
    rooms(:main).update_attribute :private, true
    assert ! users(:aaron).permission?(rooms(:main))
  end
  
  def test_update_access
    Permission.update_access [users(:quentin).id]
    assert_equal 0, Permission.count
  end
end
