require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Channel::Paster do
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
  
  after do
    done
  end
  
  it "should detect pastable code" do
    Talker::Channel::Paster.pastable?(CODE).should be_true
    Talker::Channel::Paster.pastable?("oh\naie").should be_true
    Talker::Channel::Paster.pastable?("ohaie").should be_false
    Talker::Channel::Paster.pastable?("").should be_false
  end
  
  it "should truncate to 15 lines" do
    Talker::Channel::Paster.truncate(CODE) do |content, paste|
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
    Talker::Channel::Paster.truncate("oh\naie") do |content, paste|
      content.should == "oh\naie"
      paste["lines"].should == 2
      paste["preview_lines"].should == 2
    end
  end
end
