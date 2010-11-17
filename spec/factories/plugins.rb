Factory.define :plugin do |f|
  f.name { Faker::Name.name }
  f.description { Faker::Lorem.sentence }
  f.source "MyPlugin = function(){}"
  f.author {|user| user.association(:user) }
  f.account {|account| account.association(:account) }
  f.shared true
end
