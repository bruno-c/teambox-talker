require File.dirname(__FILE__) + "/../test_helper"

class MessageTest < ActiveSupport::TestCase
  def test_creation
    create_message!
  end
end
