require File.dirname(__FILE__) + "/../test_helper"

class EventTest < ActiveSupport::TestCase
  def test_create_message
    m = create_event(:type => "message")
    m.reload
  end

  def test_create_join
    create_event(:type => "join")
  end
end
