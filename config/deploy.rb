set :application, "talker"
set :repository,  "git@github.com:macournoyer/talker.git"
set :location,    "talkerapp.com"

set :deploy_to, "/mnt/apps/#{application}"
set :deploy_via, :remote_cache

set :runner, "admin"
set :user, "admin"
# set :port, 30000 # ssh port

set :scm, :git

role :app, "talkerapp.com"
role :web, "talkerapp.com"
role :db,  "talkerapp.com", :primary => true