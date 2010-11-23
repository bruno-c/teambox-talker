Factory.define :room do |f|
  f.sequence(:name){|n| "Room#{n}" }
  f.account { |account| account.association(:account) }
end
