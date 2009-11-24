load 'deploy' if respond_to?(:namespace) # cap2 differentiator
Dir['lib/recipes/*.rb'].each { |r| load(r) }
load 'config/deploy'

task "db:backup" do
  print `ec2-create-snapshot #{volume_id}`
end