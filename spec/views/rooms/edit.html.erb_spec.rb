require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/rooms/edit.html.erb" do
  include RoomsHelper
  
  before(:each) do
    assigns[:room] = @room = stub_model(Room,
      :new_record? => false
    )
  end

  it "renders the edit room form" do
    render
    
    response.should have_tag("form[action=#{room_path(@room)}][method=post]") do
    end
  end
end


