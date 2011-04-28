ActionController::Routing::Routes.draw do |map|
  SprocketsApplication.routes(map) 
  Jammit::Routes.draw(map)

  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  map.register '/register', :controller => 'accounts', :action => 'create'
  map.signup '/signup', :controller => 'accounts', :action => 'new'
  map.welcome '/welcome', :controller => 'accounts', :action => 'welcome'
  map.pricing '/pricing', :controller => "site", :action => "pricing"
  map.about '/about', :controller => "site", :action => "about"
  map.tour '/tour/:step', :controller => "site", :action => "tour", :step => nil
  map.privacy_policy "/privacy_policy", :controller => "site", :action => "privacy_policy"
  map.terms_and_conditions "/terms_and_conditions", :controller => "site", :action => "terms_and_conditions"
  map.service_policy "/service_policy", :controller => "site", :action => "service_policy"
  map.landing "/landing", :controller => "accounts", :action => "index"

  map.public_room "/r/:token", :controller => "guests", :action => "new"

  map.resource :user_merge, :only => [:new, :create]

  map.resources :accounts, :collection => { :plan_changed => :get, :subscribers_changed => :post }, :path => "" do |acc|
    acc.resources :rooms, :has_many => [:messages, :attachments], :member => { :refresh => :get } do |rooms|
      rooms.resource :guest, :member => { :enable => :post, :disable => :post }
    end
    acc.resources :plugins, :has_one => :installation
    acc.resources :feeds
    acc.room_logs "/rooms/:room_id/logs", :controller => "logs", :action => "index"
    acc.room_month_logs "/rooms/:room_id/logs/:year/:month", :controller => "logs", :action => "index"
    acc.room_log "/rooms/:room_id/logs/:year/:month/:day", :controller => "logs", :action => "show", :conditions => { :method => :get }
    acc.connect "/rooms/:room_id/logs/:year/:month/:day", :controller => "logs", :action => "destroy", :conditions => { :method => :delete }
    acc.search_room "/rooms/:room_id/search", :controller => "logs", :action => "search"
    acc.resources :users, :member => { :suspend => :delete, :unsuspend => :post }
    acc.resources :invites, :member => { :resend => :post }, :collection => { :set_password => :put }
    acc.search "/search", :controller => "logs", :action => "search"
    acc.resources :pastes
  end

  map.resource :session
  map.resource :settings
  map.resources :plans
  map.resource :admin, :controller => "admin", :member => { :jobs => :get, :accounts => :get }

  map.connect "/avatar/:id.jpg", :controller => "avatars", :action => "show"
  map.connect "/close_connection", :controller => "attachments", :action => "close_connection"

  map.reset_password "/passwords/reset/:token", :controller => "passwords", :action => "show", :token => nil, :conditions => { :method => :get }
  map.resource :password

  map.root :controller => "site", :action => "home"
end
