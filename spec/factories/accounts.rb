Factory.define :account do |f|
  f.sequence(:subdomain) {|n| "superawesome#{n}"}
  f.plan { Plan.free }
end
