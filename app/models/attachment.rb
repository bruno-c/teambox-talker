class Attachment < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  has_attached_file :data, :storage => :s3,
                           :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                           :s3_permissions => "authenticated-read",
                           :s3_protocol => "https"
  
  def ext
    File.extname(data.original_filename).gsub(/^\.+/, "") if data.original_filename
  end
  
  def url(style = data.default_style)
    AWS::S3::S3Object.url_for(data.path(style), data.bucket_name, :use_ssl => true)
  end
end
