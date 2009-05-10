require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.pattern = 'test/**/*_test.rb'
  t.verbose = false
end
task :test => "db:clone_to_test"
task :default => :test

task :environment do
  require "config/boot"
end

task :console do
  sh "irb -r config/boot"
end

namespace :server do
  task :web do
    sh "shotgun config.ru -sthin -O"
  end
  task :chat do
    sh "ruby lib/server.rb"
  end
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
  task :clone_to_test do
    cp "db/#{ENV['RACK_ENV'] || 'development'}.db", "db/test.db", :verbose => false
  end
end
