require File.dirname(__FILE__) + "/test_helper"
require "sinatra/test"
require "app"

describe "App" do
  extend Sinatra::Test
  
  before do
    reset_db
    @user = User.create :name => "ma"
  end
  
  def logged_in
    { :env => { :session => { :user => @user.id } } }
  end
  
  should "get home" do
    get "/", logged_in
    response.should.be.ok
  end

  should "get stylesheet" do
    get "/styles/screen.css"
    response.should.be.ok
  end

  should "404 unknown stylesheet" do
    get "/styles/poop.css"
    response.should.be.not_found
  end
  
  should "get room" do
    room = Room.create :name => "test"
    get "/rooms/#{room.id}", logged_in
    response.should.be.ok
  end

  should "404 unknown room" do
    get "/rooms/666", logged_in
    response.should.be.not_found
  end
end