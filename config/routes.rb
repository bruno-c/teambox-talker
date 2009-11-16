ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  
  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  map.register '/register', :controller => 'accounts', :action => 'create'
  map.signup '/signup', :controller => 'accounts', :action => 'new'
  map.welcome '/welcome', :controller => 'accounts', :action => 'welcome'
  
  map.connect "/ouch", :controller => "rooms", :action => "ouch"
  map.public_room "/r/:token", :controller => "rooms", :action => "show"
  
  map.resources :users
  map.resources :invites, :member => { :resend => :post }
  map.resource :account
  map.resource :session
  map.resource :settings
  map.resources :rooms, :has_many => [:messages, :attachments]
  map.resources :pastes
  map.resources :feeds
  map.resources :guests
  map.resource :admin, :controller => "admin"
  map.resources :plugins, :has_one => :installation
  
  map.connect "/avatar/:id.jpg", :controller => "avatars", :action => "show"
  map.connect "/close_connection", :controller => "attachments", :action => "close_connection"
  
  map.reset_password "/passwords/reset/:token", :controller => "passwords", :action => "show", :token => nil, :conditions => { :method => :get }
  map.resource :password
  
  map.logs "/logs", :controller => "logs", :action => "index"
  map.search "/search", :controller => "logs", :action => "search"
  
  map.room_logs "/rooms/:room_id/logs", :controller => "logs", :action => "index"
  map.room_log "/rooms/:room_id/logs/:year/:month/:day", :controller => "logs", :action => "show"
  map.today_log "/rooms/:room_id/logs/today", :controller => "logs", :action => "today"
  map.search_room "/rooms/:room_id/search", :controller => "logs", :action => "search"
end
