Factory.define :user do |f|
  f.sequence(:name) {|n| "User#{n}"}
  f.sequence(:email) {|n| "email#{n}@talkerapp.com"}
  f.password "secret123"
  f.password_confirmation "secret123"
  f.state 'active'
end

Factory.define :talker_user, :class => User do |f|
  f.name "Talker"
  f.email "bot@talkerapp.com"
  f.staff true
  f.time_zone "Atlantic Time (Canada)"

  f.after_create do |user| 
    Factory(:plugin, :name => Plugin::DEFAULTS.first, :author => user)
  end
end

Factory.define :admin_user, :class => User do |f|
  f.sequence(:name) {|n| "Admin#{n}"}
  f.sequence(:email) {|n| "admin#{n}@talkerapp.com"}
  f.staff true
end
