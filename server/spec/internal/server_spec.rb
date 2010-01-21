require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Server::Channels::Server do
  before do
    @server = Talker::Server::Channels::Server.new
  end
  
  it "should handle invalid authentication" do
    Talker::Server.storage.should_receive(:authenticate).and_yield(nil)
    @server.authenticate("room", 1, "token") do |channel, user|
      channel.should be_nil
      user.should be_nil
      done
    end
  end

  it "should handle valid authentication" do
    Talker::Server.storage.should_receive(:authenticate).and_yield(Talker::Server::User.new("id" => 1, "name" => "user", "email" => "user@example.com"))
    @server.authenticate("room", 1, "token") do |channel, user|
      channel.should_not be_nil
      channel.type.should == "room"
      channel.id.should == "1"
      user.should_not be_nil
      user.id.should == 1
      done
    end
  end
end