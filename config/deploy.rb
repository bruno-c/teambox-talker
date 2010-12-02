require 'capistrano/ext/multistage'
require 'bundler/capistrano'

set :stages, %w{staging production}
set :default_stage, :production

set :application, "talker"
set :repository, "git@github.com:teambox/talker.git"

set :deploy_to, "/mnt/apps/#{application}"
set :deploy_via, :remote_cache

set :runner, "admin"
set :user, "admin"
set :keep_releases, 4 
# set :port, 30000 # ssh port

set :scm, :git


# TODO This gets automaticly included in default server list
# role :data, "ec2-174-129-133-121.compute-1.amazonaws.com"
