require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/rooms/new.html.haml" do
  include RoomsHelper
  
  before(:each) do
    assigns[:room] = stub_model(Room,
      :new_record? => true
    )
  end

  it "renders new room form" do
    render
    
    response.should have_tag("form[action=?][method=post]", rooms_path) do
    end
  end
end


