module AccountsHelper
  def will_downgrade_to(plan)
    plan.free? && !@account.recurring
  end
  
  def up_down_grade(plan)
    plan > @account.plan ? "Upgrade" : "Downgrade"
  end
end
