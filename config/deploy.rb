set :application, "talker"
set :repository,  "git@github.com:macournoyer/talker.git"

set :deploy_to, "/mnt/apps/#{application}"
set :deploy_via, :remote_cache

set :runner, "admin"
set :user, "admin"
# set :port, 30000 # ssh port

set :scm, :git

set :volume_id, "vol-df8876b6"

server = "ec2-174-129-29-3.compute-1.amazonaws.com"
role :app, server
role :web, server
role :db,  server, :primary => true

# TODO This gets automaticly included in default server list
# role :data, "ec2-174-129-164-217.compute-1.amazonaws.com"