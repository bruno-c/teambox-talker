Factory.define :account do |f|
  f.subdomain 'superawesome'
  f.plan { Plan.free }
end
