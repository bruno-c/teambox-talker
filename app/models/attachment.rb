# encoding: utf-8
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
  
  named_scope :created_on, proc { |date| { :conditions => ["attachments.created_at BETWEEN ? AND ?",
                                                           date.beginning_of_day.utc, date.end_of_day.utc] } }
  
  validate :respect_storage_limit
  
  delegate :account, :to => :room
  
  def ext
    File.extname(upload.original_filename).gsub(/^\.+/, "") if upload.original_filename
  end
  
  def basename
    escape(File.basename(upload.original_filename, ".*")) if upload.original_filename
  end
  
  def url(style = upload.default_style)
    AWS::S3::S3Object.url_for(upload.path(style), upload.bucket_name, :use_ssl => room.account.features.ssl)
  end
  
  def to_param
    "#{id}-#{basename}"
  end
  
  private
    def respect_storage_limit
      if account.used_storage + upload_file_size > account.features.max_storage
        errors.add :base, "You've reached your storage limit. Upgrade your plan if you want to upload more files."
      end
    end
    
    def transliterate(str)
      # Based on permalink_fu by Rick Olsen
      # Escape str by transliterating to UTF-8 with Iconv
      s = Iconv.iconv('ascii//ignore//translit', 'utf-8', str).to_s
      # Downcase string
      s.downcase!
      # Remove apostrophes so isn't changes to isnt
      s.gsub!(/'/, '')
      # Replace any non-letter or non-number character with a space
      s.gsub!(/[^A-Za-z0-9]+/, ' ')
      # Remove spaces from beginning and end of string
      s.strip!
      # Replace groups of spaces with single hyphen
      s.gsub!(/\ +/, '-')

      return s
    end

    def escape(string)
      # Taken from PermalinkFu
      result = ActiveSupport::Inflector.transliterate(string).to_s
      result.gsub!(/[^\x00-\x7F]+/, '') # Remove anything non-ASCII entirely (e.g. diacritics).
      result.gsub!(/[^\w_ \-]+/i,   '') # Remove unwanted chars.
      result.gsub!(/[ \-]+/i,      '-') # No more than one of the separator in a row.
      result.gsub!(/^\-|\-$/i,      '') # Remove leading/trailing separator.
      result.downcase!
      result
    end
end
