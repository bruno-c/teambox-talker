require File.dirname(__FILE__) + "/../spec_helper"

describe Room do
  before do
    Room.delete_all
    @room = Factory(:room)
  end

  after do
    Room.delete_all
  end
  
  it "admin has access to all rooms" do
    Room.with_permission(Factory(:admin_user)).count.should == Room.count
  end
  
  it "user has not access to all rooms" do
    Factory(:room, :private => true, :account => Factory(:account, :plan => Plan.all[1]))
    user = Factory(:user, :account => Factory(:account, :plan => Plan.free))

    Room.with_permission(user).count.should_not == Room.count
  end
  
  it "sends one message" do
    @room.expects(:publish).with do |event|
      event[:type].should == 'message'
      event[:content].should == "ohaie\nthere"
      event[:time].should_not be_nil
      event[:id].should_not be_nil
      event[:user].should == User.talker
      true
    end
    @room.send_message("ohaie\nthere")
  end

  it "sends many messages" do
    @room.expects(:publish).with do |*events|
      events[0][:content].should == 'ohaie'
      events[1][:content].should == 'there'
      events.all? do |event|
        event[:type].should == 'message'
        event[:time].should_not be_nil
        event[:id].should_not be_nil
        event[:user].should == User.talker
        true
      end
    end
    @room.send_message(["ohaie", "there"])
  end

  it "send pasteless messages" do
    @room.expects(:publish).with do |*events|
      events.all? do |event|
        event[:paste].should == nil
        event[:pass_that].should == "dude"
        true
      end
    end
    @room.send_message(["ohaie\nyou", "ohaie\nme"], :paste => false, :pass_that => "dude")
  end
  
  it "add permission" do
    Permission.delete_all
    expect {
      @room.private = true
      @room.invitee_ids = [Factory(:user).id]
      @room.save
    }.to change(Permission, :count).by(1)
  end
  
  it "remove permission" do
    @room.private = true
    @room.invitee_ids = []
    @room.save
    @room.permissions.count.should == 0
  end

  it "public room delete all permissiosn" do
    @room.private = false
    @room.invitee_ids = [Factory(:user).id]
    @room.save
    @room.permissions.count.should == 0
  end
  
  it "cant create private room if plan is limited" do
    account = Factory(:account)
    account.plan = Plan.free
    account.save
    room = Factory.build(:room, :private => true, :account => account)
    room.should_not be_valid 
  end

  it "can create private room if plan permists" do
    account = Factory(:account)
    account.plan = Plan.find_by_name("Startup")
    account.save
    room = Factory.build(:room, :private => true, :account => account)
    room.should be_valid 
  end
end
