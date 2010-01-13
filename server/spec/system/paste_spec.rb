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
  
  it "should be received w/ paste id" do
    connect do |client|
      client.on_connected do
        client.send_message("hi\nthere")
      end

      client.on_message do |user, message, attributes|
        attributes["paste"]["id"].should_not be_nil
        attributes["paste"]["lines"].should == 2
        attributes["paste"]["preview_lines"].should == 2
        client.close
      end
      
      client.on_close { done }
    end
  end
  
  it "should be truncated" do
    connect do |client|
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
    connect do |client|
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
  
  it "should not truncate long message" do
    connect do |client|
      client.on_connected do
        client.send_message("X" * (1024 * 100))
      end

      client.on_message do |user, message, attributes|
        attributes["paste"].should be_nil
        attributes["content"].size.should == (1024 * 100)
        client.close
      end
    
      client.on_close { done }
    end
  end
end
