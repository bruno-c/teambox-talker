Factory.define :user do |f|
  f.sequence(:name) {|n| "User#{n}"}
  f.sequence(:email) {|n| "email#{n}@talkerapp.com"}
end
