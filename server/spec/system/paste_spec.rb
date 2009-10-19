require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Pastes" do
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
    $paster_response = nil
  end
  
  it "should be received w/ paste id" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        client.send_message("hi\nthere")
      end

      client.on_message do |user, message, attributes|
        attributes["paste"].should == {"id" => "THIS_IS_MOCKED", "lines" => 2, "preview_lines" => 2}
        client.close
      end
      
      client.on_close { done }
    end
  end
  
  it "should not paste partial messages" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        client.send_message("hi\nthere", :partial => true)
        client.send_message("bogus")
      end

      client.on_message do |user, message, attributes|
        attributes["paste"].should be_nil
        client.close
      end
      
      client.on_close { done }
    end
  end
  
  it "should be truncated" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        client.send_message(CODE)
      end

      client.on_message do |user, message, attributes|
        attributes["paste"].should_not be_nil
        attributes["content"][-3,3].should == "..."
        client.close
      end
      
      client.on_close { done }
    end
  end

  it "should be forced w/ {'paste': true}" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        client.send_message("hi", :paste => true)
      end

      client.on_message do |user, message, attributes|
        attributes["paste"].should_not be_nil
        client.close
      end
      
      client.on_close { done }
    end
  end
  
  it "should not be truncated on service failure" do
    $paster_response = :fail
    
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        client.send_message(CODE)
      end

      client.on_message do |user, message, attributes|
        attributes["paste"].should be_nil
        attributes["content"].should == CODE
        client.close
      end
    
      client.on_close { done }
    end
  end
end
