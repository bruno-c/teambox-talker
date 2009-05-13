require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/rooms/index.html.erb" do
  include RoomsHelper
  
  before(:each) do
    assigns[:rooms] = [
      stub_model(Room),
      stub_model(Room)
    ]
  end

  it "renders a list of rooms" do
    render
  end
end

