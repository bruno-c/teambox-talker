# Cookbook Name:: codegram
# Recipe:: rails

package 'libcurl4-openssl-dev'
package 'libxslt1-dev'
package 'libpq-dev'
package 'libgraphicsmagick1-dev'
package 'libmagick++-dev'

gem_package "bundler"
gem_package "passenger"

bash "bundle all gems" do
  user "vagrant"
  code <<-EOH
    cd /vagrant
    bundle install --path /home/vagrant/.bundler
  EOH
end
 
template "/vagrant/config/database.yml" do
  source "database.yml.erb"
  mode 0755
end

 bash "reset password" do
   user "postgres"
   code <<-EOH
     psql --command "ALTER USER postgres PASSWORD 'vagrant'"
   EOH
 end

 %w{development production test}.each do |environment|
   bash "create/update #{environment} database and migrate" do
     user "vagrant"
     code <<-EOH
       cd /vagrant
       RAILS_ENV=#{environment} rake db:create
       RAILS_ENV=#{environment} rake db:migrate
     EOH
   end
 end

bash "Copying ssh keys" do

  code <<-EOH
    cd /home/vagrant/.ssh
    ln -s /vagrant/config/ssh_keys/id_rsa
    ln -s /vagrant/config/ssh_keys/id_rsa.pub
    cd ..
    chmod 0600 .ssh/id_rsa
    chmod 0600 .ssh/id_rsa.pub
  EOH

  only_if "test -e /vagrant/config/ssh_keys/id_rsa"
  only_if "test -e /vagrant/config/ssh_keys/id_rsa.pub"
  not_if "test -e /home/vagrant/.ssh/id_rsa"
  not_if "test -e /home/vagrant/.ssh/id_rsa.pub"

end

# bash "starting guard" do
#   code <<-EOH
#     cd /vagrant
#     bundle exec guard
#   EOH
#   only_if "test -e /vagrant/Guardfile"
# end

bash "starting passenger standalone" do
  code <<-EOH
    cd /vagrant
    passenger start -d --user vagrant
    wget -O - http://localhost:3000 > /dev/null
    passenger start -d -e production -p 3001 --user vagrant
    wget -O - http://localhost:3001 > /dev/null
  EOH
end
