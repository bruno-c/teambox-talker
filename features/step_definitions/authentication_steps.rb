Given /^#{capture_model} is active$/ do |user|
  find_model(user).activate!
end
