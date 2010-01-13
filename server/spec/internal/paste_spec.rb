require File.dirname(__FILE__) + "/../spec_helper"

EM.describe Talker::Server::Paste do
  CODE = <<-EOS
class Awesome
  def name
    'Bob "Brown" The Great'
  end

  def age
    1_000_000
  end

  def dance!
    10.times do
      roll
      slice
      clap
    end
  end
end
EOS
  
  before do
    @channel = Talker::Server::Channel.new("room.1")
  end
  
  after do
    done
  end
  
  it "should detect pastable code" do
    Talker::Server::Paste.new(CODE, @channel).should be_pastable
    Talker::Server::Paste.new("oh\naie", @channel).should be_pastable
    Talker::Server::Paste.new("ohaie", @channel).should_not be_pastable
    Talker::Server::Paste.new("", @channel).should_not be_pastable
    Talker::Server::Paste.new("oh\naie", Talker::Server::Channel.new("paste.1")).should_not be_pastable
  end
  
  it "should truncate to 15 lines" do
    Talker::Server::Paste.truncate(CODE, @channel) do |content, paste|
      paste["lines"].should == 17
      paste["preview_lines"].should == 15
      content.should == <<-EOS.chomp
class Awesome
  def name
    'Bob "Brown" The Great'
  end

  def age
    1_000_000
  end

  def dance!
    10.times do
      roll
      slice
      clap
    end
...
EOS
    end
  end

  it "should not truncate if less than 15 lines" do
    Talker::Server::Paste.truncate("oh\naie", @channel) do |content, paste|
      content.should == "oh\naie"
      paste["lines"].should == 2
      paste["preview_lines"].should == 2
    end
  end
end
