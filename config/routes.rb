ActionController::Routing::Routes.draw do |map|
  map.logout '/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/login', :controller => 'sessions', :action => 'new'
  map.register '/register', :controller => 'accounts', :action => 'create'
  map.signup '/signup', :controller => 'accounts', :action => 'new'

  map.resources :users
  map.resources :invites, :member => { :resend => :post }
  map.resource :account
  map.resource :session
  map.resource :settings
  map.resources :rooms, :has_many => :messages
  
  map.root :controller => "home"
end
