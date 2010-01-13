require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Server::MysqlAdapter do
  before do
    execute_sql_file "delete_all"
    execute_sql_file "insert_all"
    @adapter = Talker::Server::MysqlAdapter.new :database => "talker_test",
                                                :user => "root",
                                                :connections => 1
  end
  
  it "should authenticate user with valid token" do
    @adapter.authenticate("valid") do |user|
      user.id.should == 1
      user.name.should == "user 1"
      user.info["email"].should == "user1@example.com"
      done
    end
  end

  it "should not authenticate invalid token" do
    @adapter.authenticate("invalid") do |user|
      user.should be_nil
      done
    end
  end

  it "should authorize room by id" do
    @adapter.authorize_room(users(1), "1") do |room_id|
      room_id.should == 1
      done
    end
  end

  it "should authorize room by name" do
    @adapter.authorize_room(users(1), "Main") do |room_id|
      room_id.should == 1
      done
    end
  end

  it "should not authorize invalid room" do
    @adapter.authorize_room(users(1), 999999) do |room_id|
      room_id.should be_nil
      done
    end
  end
  
  it "should not authorize without permission" do
    @adapter.authorize_room(users(3), "Private") do |room_id|
      room_id.should be_nil
      done
    end
  end
  
  it "should authorize with permission" do
    @adapter.authorize_room(users(4), "Private") do |room_id|
      room_id.should == 2
      done
    end
  end
  
  it "should prevent SQL injection in authentication" do
    @adapter.authenticate("' OR 1=1 '") do |user|
      user.should be_nil
      done
    end
  end
  
  it "should insert paste" do
    @adapter.insert_paste(1, "abc123", "ohaie", "|1+2") do
      done
    end
  end
  
  it "should update paste" do
    @adapter.update_paste("abc123", "ohaie", "|1+2") do
      done
    end
  end
  
  it "should find paste" do
    @adapter.load_paste("1") do |content, attributions|
      content.should == "hi"
      attributions.should_not be_empty
      done
    end
  end
  
  it "should load room events" do
    @adapter.load_room_events(1, '1') do |event|
      Yajl::Parser.parse(event)["id"].should == "2"
      done
    end
  end
end