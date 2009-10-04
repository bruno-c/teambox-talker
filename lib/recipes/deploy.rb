namespace :deploy do
  def god(command)
    sudo "god #{command} thin-talker"
  end
  
  [:monitor, :start, :stop, :restart].each do |command|
    desc "Send #{command} command to Thin processes."
    task command, :roles => :app do
      god command
    end
  end
end
