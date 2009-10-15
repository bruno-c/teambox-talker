class Paste < ActiveRecord::Base
  PREVIEW_LINES = 15 # Same as in Talker::Paster (server/lib/talker/paster.rb)
  
  belongs_to :user
  
  validates_presence_of :content
  validates_presence_of :user
  
  before_create { |p| p.permalink = ActiveSupport::SecureRandom.hex(10) }
  
  attr_accessible :content, :syntax
  
  def to_param
    permalink
  end
  
  def more_lines
    @more_lines ||= begin
      lines = content.count("\n")
      if lines < PREVIEW_LINES
        0
      else
        lines - PREVIEW_LINES
      end
    end
  end
end
