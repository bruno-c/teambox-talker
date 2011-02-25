require File.dirname(__FILE__) + "/../spec_helper"

describe Permission do

  it "cant add admin" do
    room = Factory(:room)
    user = Factory(:user)
    room.account.users << user
    user.registration_for(room.account).update_attribute(:admin, true)
    permission = room.permissions.create(:user => user)
    permission.errors.on(:user).should_not be_nil
  end
  
  it "admin can access all rooms" do

    account = Factory(:account)
    user = Factory(:user)
    account.users << user

    account.rooms << Factory(:room)
    account.rooms << Factory(:room)
    account.rooms << Factory(:room)

    user.registration_for(account).update_attribute(:admin, true)

    account.rooms.each do |room|
      user.permission?(room).should_not be_nil
    end

  end
  
  it "everyone can access public" do
    Permission.delete_all
    main = Factory(:room)
    main.update_attribute :private, false
    Factory(:user).permission?(main).should_not be_nil
  end
  
  it "only restricted users can access private rooms" do
    Permission.delete_all
    main = Factory(:room)
    main.update_attribute :private, true
    Factory(:user).permission?(main).should_not be_true
  end
  
  it "update access" do

    account = Factory(:account)
    user = Factory(:user)

    account.users << user
    user.registration_for(account).update_attribute(:admin, true)

    account.rooms << Factory(:room)
    room = account.rooms.first

    room.permissions.update_access [user]
    room.permissions.count.should == 1

  end
end
