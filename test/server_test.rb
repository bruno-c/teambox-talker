require File.dirname(__FILE__) + "/test_helper"
require "server"

describe Server do
  before do
    reset_db
    @user = User.create :name => "ma"
    @user2 = User.create :name => "pa"
    @room = Room.create :name => "Test"
    
    Server.logger = Logger.new(nil)
    Server.connections.clear
    @server = Server.new("123")
    @server.post_init
  end
  
  def message(data)
    data.to_json + "\0"
  end
  
  should "send message" do
    @server.expects(:send_data).with(
      message(
        "user" => 'ma',
        "content" => 'ohaie',
        "data" => nil
      )
    )
    
    @server.receive_data(
      message(
        "type" => "message",
        "room" => @room.id,
        "user" => @user.id,
        "message" => "ohaie"
      )
    )
    
    @room.reload.messages.size.should == 1
  end
  
  should "send message to each user in room" do
    Server.any_instance.expects(:send_data).times(2)
    
    @server.dup.receive_data(message("type" => "ping", "user" => @user2.id, "room" => @room.id))
    @server.receive_data(
      message(
        "type" => "message",
        "room" => @room.id,
        "user" => @user.id,
        "message" => "ohaie"
      )
    )
    
    Server.connections[@room.id].size.should == 2
  end
end