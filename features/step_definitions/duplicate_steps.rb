Given /^a duplicate of the user exists with an account named: "([^"]*)"$/ do |account_name|
  user = model("the user")
  u = User.new(:email => user.email, :name => user.name)
  u.accounts << Factory(:account, :subdomain => account_name)
  u.save(false)
  u.activate!
end
