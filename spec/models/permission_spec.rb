require File.dirname(__FILE__) + "/../spec_helper"

describe Permission do
  it "cant add admin" do
    permission = Factory(:room).permissions.create(:user => Factory(:admin_user))
    permission.errors.on(:user).should_not be_nil
  end
  
  it "admin can access all rooms" do
    Factory(:admin_user).permission?(Factory(:room)).should_not be_nil
    Factory(:admin_user).permission?(Room.new).should_not be_nil
  end
  
  it "everyone can access public" do
    Permission.delete_all
    main = Factory(:room)
    main.update_attribute :private, false
    Factory(:user).permission?(main).should_not be_nil
  end
  
  it "restricted user can access private rooms" do
    Permission.delete_all
    main = Factory(:room)
    main.update_attribute :private, true
    Factory(:user).permission?(main).should_not be_true
  end
  
  it "update access" do
    Permission.update_access [Factory(:admin_user).id]
    Permission.count.should == 0
  end
end
