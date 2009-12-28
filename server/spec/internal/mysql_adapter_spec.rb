require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Server::MysqlAdapter do
  before do
    execute_sql_file "delete_all"
    execute_sql_file "insert_all"
    @adapter = Talker::Server::MysqlAdapter.new :database => "talker_test",
                                        :user => "root",
                                        :connections => 1
  end
  
  it "should authenticate valid token" do
    @adapter.authenticate(1, "valid") do |user, room_id|
      user.id.should == 1
      room_id.should == 1
      user.name.should == "user 1"
      user.info["email"].should == "user1@example.com"
      done
    end
  end

  it "should authenticate room by name" do
    @adapter.authenticate("Main", "valid") do |user, room_id|
      user.id.should == 1
      room_id.should == 1
      user.name.should == "user 1"
      user.info["email"].should == "user1@example.com"
      done
    end
  end

  it "should not authenticate invalid token" do
    @adapter.authenticate(1, "invalid") do |user, room_id|
      user.should be_nil
      room_id.should be_nil
      done
    end
  end

  it "should not authenticate invalid room" do
    @adapter.authenticate(999999, "valid") do |user, room_id|
      user.should be_nil
      room_id.should be_nil
      done
    end
  end
  
  it "should not authenticate without permission" do
    @adapter.authenticate(3, "restricted") do |user, room_id|
      user.should be_nil
      room_id.should be_nil
      done
    end
  end
  
  it "should authenticate with permission" do
    @adapter.authenticate(2, "restricted") do |user, room_id|
      user.should_not be_nil
      room_id.should == 2
      done
    end
  end
  
  it "should prevent SQL injection" do
    @adapter.authenticate(1, "' OR 1=1 '") do |user, room_id|
      user.should be_nil
      room_id.should be_nil
      done
    end
  end
  
  it "should insert paste" do
    @adapter.insert_paste("abc123", "ohaie") do
      done
    end
  end
  
  it "should load events" do
    @adapter.load_events(1, '1') do |event|
      Yajl::Parser.parse(event)["id"].should == "2"
      done
    end
  end
end