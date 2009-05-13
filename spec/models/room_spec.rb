require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Room do
  before(:each) do
    @valid_attributes = {
      :name => "Awesome",
      :medium => "text"
    }
  end

  it "should create a new instance given valid attributes" do
    Room.create!(@valid_attributes)
  end
end
