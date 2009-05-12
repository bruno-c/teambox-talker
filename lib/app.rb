require "compass"
require "haml"
require "sass"

set :public, APP_ROOT + '/public'
set :views, APP_ROOT + '/views'

helpers do
  def current_user
    @current_user ||= session[:user] && User[:id => session[:user]]
  end
  
  def logged_in?
    !current_user.nil?
  end
  
  def login_required
    redirect "/login" unless logged_in?
  end
end

get "/login" do
  haml :login
end

post "/login" do
  if user = User.authenticate(params[:username], params[:password])
    session[:user] = user.id
    redirect "/"
  else
    @notice = "Bad login"
    haml :login
  end
end

get "/" do
  login_required
  
  @rooms = Room.all
  haml :home
end

get "/rooms/:id" do
  login_required
  
  @room = Room[:id => params[:id]] || raise(Sinatra::NotFound)
  @user = current_user
  case @room.medium
  when "text"
    haml :text_room
  when "draw"
    haml :draw_room
  else
    raise Sinatra::NotFound
  end
end

get "/styles/:name.css" do
  begin
    content_type "text/css", :charset => "utf-8"
    sass :"styles/#{params[:name]}",
         :load_paths => [APP_ROOT + "/styles"] + Compass::Frameworks::ALL.map {|f| f.stylesheets_directory }
  rescue Errno::ENOENT
    raise Sinatra::NotFound
  end
end
