module UserHelper
  def avatar_url(user, size=16)
    hash = Digest::MD5.hexdigest(user.email.to_s)
    "/avatar/#{hash}.jpg?s=#{size}"
  end
end
