namespace :db do
  desc "Run a full database backup"
  task :backup, :roles => :data do
    sudo "mysql_s3_backup -c=/etc/mysql_s3_backup/config.yml full"
  end
end