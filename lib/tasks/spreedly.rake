namespace :plans do
  desc "Update db/plans.yml from the plans on Spreedly"
  task :update => :environment do
    all_plans = {}
    
    SPREEDLY_CONFIG.each_pair do |env, config|
      plans = all_plans[env] = []
      
      Spreedly.configure config["site"], config["token"]
      
      Spreedly::SubscriptionPlan.all.each do |plan|
        plans << Plan.new(plan) if plan.enabled
      end
    end
    
    File.open(Plan::DB_FILE, "w") do |file|
      file << "# This file is generated automatically.\n"
      file << "# Run `rake update_plans` to update this file\n"
      YAML.dump(all_plans, file)
    end
  end
end

namespace :subscriptions do
  task :delete => :environment do
    Spreedly::Subscriber.wipe!
  end
  
  desc "Create a Spreedly subscription for each account."
  task :recreate => :delete do
    Account.find_each do |account|
      puts "Creating for #{account.subdomain} ..."
      CreateSpreedlySubscription.new(account).perform
    end
    puts "Done!"
  end
end