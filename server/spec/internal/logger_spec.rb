require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Logger do
  before do
    @logger = Talker::Logger::Server.new :database => "talker_test", :user => "root"
    @logger.start
    
    @exchange = MQ.fanout("talker.test")
    Talker::Queues.logger.bind(@exchange)
  end
  
  after do
    @logger.stop
  end
  
  it "should connect to database" do
    @logger.db.select "SELECT 1 AS ONE;" do |results|
      results[0]["ONE"].should == "1"
      done
    end
  end
  
  it "should insert new message" do
    message = encode(:type => "message", :user => {:id => 1}, :final => true, :id => "123",
                     :time => 5, :content => "ohaie")
  
    @logger.rooms[1].should_receive(:insert_message).with(1, 1, "123", "ohaie", 5, anything, anything)
    @exchange.publish message, :exchange => "talker.channel.1"
    done
  end
  
  it "should insert new notice" do
    message = encode(:type => "join", :user => {:id => 1},
                     :time => 5, :content => "ohaie")
  
    @logger.rooms[1].should_receive(:insert_notice).with(1, 1, "join", 5, anything, anything)
    @exchange.publish message, :exchange => "talker.channel.1"
    done
  end
end