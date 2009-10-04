set :application, "talker"
set :repository,  "git@github.com:macournoyer/talker.git"

set :deploy_to, "/mnt/apps/#{application}"
set :deploy_via, :remote_cache

set :runner, "admin"
set :user, "admin"
# set :port, 30000 # ssh port

set :scm, :git

server = "ec2-174-129-187-160.compute-1.amazonaws.com"
role :app, server
role :web, server
role :db,  server, :primary => true