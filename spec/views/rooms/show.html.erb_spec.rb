require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/rooms/show.html.erb" do
  include RoomsHelper
  before(:each) do
    assigns[:room] = @room = stub_model(Room)
  end

  it "renders attributes in <p>" do
    render
  end
end

