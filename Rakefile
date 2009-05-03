require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.pattern = 'test/**/*_test.rb'
  t.verbose = false
end
task :test => "db:setup_test"
task :default => :test

task :environment do
  require "config/boot"
end

task :console do
  sh "irb -r config/boot"
end

task :web_server do
  sh "shotgun config.ru -sthin -O"
end

task :chat_server do
  sh "ruby lib/server.rb"
end

namespace :db do
  task :migrate => :environment do
    require "sequel/extensions/migration"
    version = ENV["VERSION"]
    Sequel::Migrator.apply(DB, "db/migrate", version ? version.to_i : nil)
  end
  task :drop => :environment do
    rm DB.opts[:database]
  end
  task :setup_test do
    ENV["RACK_ENV"] = "test"
    Rake::Task["db:migrate"].invoke
  end
end
