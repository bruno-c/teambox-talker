module UserHelper
  def avatar_url(user, size=16)
    hash = Digest::MD5.hexdigest(user.email.to_s)
    "/avatar/#{hash}.jpg?s=#{size}"
  end
  
  def avatars(users)
    users.map { |user| image_tag(avatar_url(user), :alt => h(user.name)) + " #{h user.name}" }.to_sentence
  end
  
  def access_description(user)
    if user.admin
      content_tag :em, "all rooms"
    else
      (
        [content_tag(:em, "all public rooms")] +
        user.permissions.map { |p| link_to h(p.room.name), edit_room_path(p.room) }
      ).to_sentence
    end
  end
end
