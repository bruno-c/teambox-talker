require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Paster do
  before do
    @paster = Talker::Paster.new("abc123")
    
    @code = <<-EOS
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
  end
  
  after do
    done
  end
  
  it "should detect pastable code" do
    Talker::Paster.pastable?(@code).should be_true
    Talker::Paster.pastable?("oh\naie").should be_true
    Talker::Paster.pastable?("ohaie").should be_false
    Talker::Paster.pastable?("").should be_false
  end
  
  it "should truncate to 15 lines" do
    @paster.truncate(@code).should == <<-EOS.chomp
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

  it "should not truncate if less than 15 lines" do
    @paster.truncate("oh\naie").should == "oh\naie"
  end
end
