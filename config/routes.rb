ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map)
  
  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  map.register '/register', :controller => 'accounts', :action => 'create'
  map.signup '/signup/:plan', :controller => 'accounts', :action => 'new'
  map.welcome '/welcome', :controller => 'accounts', :action => 'welcome'
  
  map.pricing '/pricing', :controller => "site", :action => "pricing"
  map.about '/about', :controller => "site", :action => "about"
  map.tour '/tour', :controller => "site", :action => "tour"
  map.privacy_policy "/privacy_policy", :controller => "site", :action => "privacy_policy"
  map.terms_and_conditions "/terms_and_conditions", :controller => "site", :action => "terms_and_conditions"
  map.service_policy "/service_policy", :controller => "site", :action => "service_policy"
  
  map.connect "/ouch", :controller => "rooms", :action => "ouch"
  
  map.public_room "/r/:token", :controller => "guests", :action => "new"
  
  map.resources :users, :member => { :suspend => :delete, :unsuspend => :post }
  map.resources :invites, :member => { :resend => :post }
  map.resource :account, :collection => { :plan_changed => :get, :subscribers_changed => :post }
  map.resource :session
  map.resource :settings
  map.resources :plans
  map.resources :rooms, :has_many => [:messages, :attachments], :member => { :refresh => :get } do |rooms|
    rooms.resource :guest, :member => { :enable => :post, :disable => :post }
  end
  map.resources :pastes
  map.resources :feeds
  map.resource :admin, :controller => "admin", :member => { :jobs => :get }
  map.resources :plugins, :has_one => :installation
  
  map.connect "/avatar/:id.jpg", :controller => "avatars", :action => "show"
  map.connect "/close_connection", :controller => "attachments", :action => "close_connection"
  
  map.reset_password "/passwords/reset/:token", :controller => "passwords", :action => "show", :token => nil, :conditions => { :method => :get }
  map.resource :password
  
  map.search "/search", :controller => "logs", :action => "search"
  
  map.room_logs "/rooms/:room_id/logs", :controller => "logs", :action => "index"
  map.room_month_logs "/rooms/:room_id/logs/:year/:month", :controller => "logs", :action => "index"
  map.room_log "/rooms/:room_id/logs/:year/:month/:day", :controller => "logs", :action => "show", :conditions => { :method => :get }
  map.connect "/rooms/:room_id/logs/:year/:month/:day", :controller => "logs", :action => "destroy", :conditions => { :method => :delete }
  map.search_room "/rooms/:room_id/search", :controller => "logs", :action => "search"
  
  map.root :controller => "site", :action => "home"
end
