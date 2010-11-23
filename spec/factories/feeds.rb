Factory.define :feed do |f|
  f.account {|account| account.association(:account) }
  f.room {|room| room.association(:room) }
  f.url "http://feeds.feedburner.com/PaulDixExplainsNothing"
  f.run_at { 1.minute.ago }
end
