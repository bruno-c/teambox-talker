Factory.define :attachment do |f|
  f.room {|room| room.association(:room) }
  f.user {|user| user.association(:user) }
  f.upload_file_name "lolcat.jpg"
  f.upload_content_type "image/jpeg"
  f.upload_file_size "1024"
end
