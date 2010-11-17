Factory.define :join_event, :class => Event do |f|
  f.room { |room| room.association(:room) }
  f.type "join"
  f.payload_object { {"time" => 1258314754,"type" => "message","content" => "ohaie","user" => {"name" => "ma","id" => 1,"email" => "macournoyer@gmail.com"}} }
  f.content { Faker::Lorem.words(1) }
  f.sequence(:uuid) { |n| n }
end

Factory.define :message_event, :class => Event do |f|
  f.room { |room| room.association(:room) }
  f.type "message"
  f.payload_object { {"time" => 1258314754,"type" => "message","content" => "ohaie","user" => {"name" => "ma","id" => 1,"email" => "macournoyer@gmail.com"}} }
  f.content { Faker::Lorem.words(1) }
  f.sequence(:uuid) { |n| n * 20 }
end
