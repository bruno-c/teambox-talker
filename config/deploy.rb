set :application, "talker"
set :repository,  "git@github.com:macournoyer/talker.git"
set :location,    "ec2-67-202-35-82.compute-1.amazonaws.com"

set :deploy_to, "/mnt/apps/#{application}"
set :deploy_via, :remote_cache

set :runner, "app"
set :user, "admin"
# set :port, 30000 # ssh port

set :scm, :git

role :app, location
role :web, location
role :db,  location, :primary => true