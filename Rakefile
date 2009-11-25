# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'boot'))

require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'tasks/rails'

desc "Configure mysql database"
task "db:config" => :environment do
  ActiveRecord::Base.connection.execute "SET GLOBAL time_zone = '+0:00';"
end

task :jsmin => "sprockets:install_script" do
  path = "public/javascripts"
  sh "mv -f #{path}/talker.js #{path}/talker.original.js && " +
     "ruby lib/jsmin.rb < #{path}/talker.original.js > #{path}/talker.js"
end

namespace :feeds do
  desc "Run Feeds worker"
  task :work => :environment do
    Feed::Worker.new.start
  end
end