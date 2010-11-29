require File.dirname(__FILE__) + "/../test_helper"

describe "Permission", ActiveSupport::TestCase do
  it "cant add admin" do
    permission = rooms(:main).permissions.create(:user => users(:quentin))
    permission.errors.on(:user).should.not == nil
  end
  
  it "admin can access all rooms" do
    users(:quentin).permission?(rooms(:main)).should.not == nil
    users(:quentin).permission?(Room.new).should.not == nil
  end
  
  it "everyone can access public" do
    Permission.delete_all
    rooms(:main).update_attribute :private, false
    users(:aaron).permission?(rooms(:main)).should.not == nil
  end
  
  it "restricted user can access private rooms" do
    Permission.delete_all
    rooms(:main).update_attribute :private, true
     users(:aaron).permission?(rooms(:main)).should.not == true
  end
  
  it "update access" do
    Permission.update_access [users(:quentin).id]
    Permission.count.should == 0
  end
end
