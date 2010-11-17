require File.dirname(__FILE__) + "/../test_helper"

describe "Room", ActiveSupport::TestCase do
  before do
    @room = rooms(:main)
  end
  
  it "creation" do
    create_room!
  end
  
  it "admin has access to all rooms" do
    Room.with_permission(users(:quentin)).count.should == Room.count
  end
  
  it "user has not access to all rooms" do
    assert_not_equal Room.count, Room.with_permission(users(:aaron)).count
  end
  
  it "send message" do
    @room.expects(:publish).with do |event|
      event[:type].should == 'message'
      event[:content].should == "ohaie\nthere"
      event[:time].should.not == nil
      event[:id].should.not == nil
      event[:user].should == User.talker
      true
    end
    @room.send_message("ohaie\nthere")
  end

  it "send messages" do
    @room.expects(:publish).with do |*events|
      events[0][:content].should == 'ohaie'
      events[1][:content].should == 'there'
      events.all? do |event|
        event[:type].should == 'message'
        event[:time].should.not == nil
        event[:id].should.not == nil
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
    assert_difference "Permission.count", 1 do
      @room.private = true
      @room.invitee_ids = [users(:aaron).id]
      @room.save
    end
  end
  
  it "remove permission" do
    @room.private = true
    @room.invitee_ids = []
    @room.save
    @room.permissions.count.should == 0
  end

  it "public room delete all permissiosn" do
    @room.private = false
    @room.invitee_ids = [users(:aaron).id]
    @room.save
    @room.permissions.count.should == 0
  end
  
  it "cant create private room if plan is limited" do
    accounts(:master).plan = Plan.free
    accounts(:master).save
    create_room(:private => true, :account => accounts(:master)).errors.on(:base).should.not == nil
  end

  it "can create private room if plan permists" do
    accounts(:master).plan = Plan.find_by_name("Startup")
    accounts(:master).save
    create_room(:private => true, :account => accounts(:master)).errors.on(:base).should == nil
  end
end
