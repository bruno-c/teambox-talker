desc "Update db/plans.yml from the plans on Spreedly"
task :update_plans => :environment do
  all_plans = {}
  
  SPREEDLY_CONFIG.each_pair do |env, config|
    plans = all_plans[env] = []
    
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
