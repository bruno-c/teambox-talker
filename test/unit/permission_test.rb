require File.dirname(__FILE__) + "/../test_helper"

class PermissionTest < ActiveSupport::TestCase
  def test_admin_can_access_all_rooms
    assert users(:quentin).permission?(rooms(:main))
    assert users(:quentin).permission?(Room.new)
  end
  
  def test_restricted_user_can_access_specified_rooms
    assert users(:aaron).permission?(rooms(:main))
  end
  
  def test_creating_permission_sets_user_to_restricted
    Permission.delete_all
    users(:aaron).update_attribute :restricted, false
    
    users(:aaron).permissions.create! :room => rooms(:main)
    assert users(:aaron).reload.restricted
  end

  def test_destroyinh_permission_unsets_user_from_restricted
    users(:aaron).update_attribute :restricted, true
    
    users(:aaron).permissions.destroy_all
    assert ! users(:aaron).reload.restricted
  end
end
