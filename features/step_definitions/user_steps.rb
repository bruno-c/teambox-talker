Given /^I am logged in in the account "([^"]*)"$/ do |subdomain|
  user = create_model('user', :password => 'secret123', :password_confirmation => 'secret123')
  user.activate!
  account = create_model('account', :subdomain => subdomain, :users => [user])
  Given "I am within the subdomain \"#{account.subdomain}\""
  And "I fill in \"email\" with \"#{user.email}\""
  And "I fill in \"password\" with \"secret123\""
  And "I press \"Log in\""
  Then "I should see \"Logout\""
end

Given /^I have the following accounts:$/ do |table|
  table.hashes.each do |data|
    user = find_model('the user')
    account = Account.new(data)
    account.users << user
    account.save!
  end
end
