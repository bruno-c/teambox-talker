class Attachment < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  has_attached_file :upload, :storage => :s3,
                             :s3_credentials => "#{RAILS_ROOT}/config/s3.yml",
                             :s3_permissions => "authenticated-read",
                             :s3_protocol => "https",
                             :path => "attachments/:id/:style/:filename"
  
  validates_attachment_size :upload, :less_than => 10.megabyte
  validates_attachment_presence :upload
  
  def ext
    File.extname(upload.original_filename).gsub(/^\.+/, "") if upload.original_filename
  end
  
  def url(style = upload.default_style)
    AWS::S3::S3Object.url_for(upload.path(style), upload.bucket_name, :use_ssl => true)
  end
end
