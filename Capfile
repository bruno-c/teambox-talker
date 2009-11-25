load 'deploy' if respond_to?(:namespace) # cap2 differentiator
Dir['lib/recipes/*.rb'].each { |r| load(r) }
load 'config/deploy'

namespace :db do
  desc "Create a EBS Snapshot"
  task :backup do
    print `ec2-create-snapshot #{volume_id}`
  end
end