ActionController::Routing::Routes.draw do |map|
  map.resources :rooms
  map.resource :session
  map.resource :account
  
  map.root :rooms
end
