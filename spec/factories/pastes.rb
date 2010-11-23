Factory.define :paste do |f|
  f.room {|room| room.association(:room) }
  f.content { Faker::Lorem.paragraphs }
end
