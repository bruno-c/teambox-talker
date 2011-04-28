Given /^I am logged in in the account "([^"]*)"$/ do |subdomain|
  user = create_model('user', :email => 'foo@bar.com')
  user.activate!
  account = create_model('account', :subdomain => subdomain, :users => [user])
  Given "I am within the account \"#{account.subdomain}\""
  And "I fill in \"email\" with \"#{user.email}\""
  And "I fill in \"password\" with \"secret123\""
  And "I press \"Log in\""
  Then "I should see \"Logout\""
end

Given /^#{capture_model} has the following accounts:$/ do |user, table|
  table.hashes.each do |data|
    user = find_model(user, :email => 'foo@bar.com')
    account = Account.new(data)
    account.users << user
    account.save!
  end
end

Given /^an active user exists$/ do
    create_model('user', :email => 'foo@bar.com').activate! 
end
