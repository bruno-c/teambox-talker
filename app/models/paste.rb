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
  
  def lines
    @lines ||= content.count("\n")
  end
  
  def more_lines
    @more_lines ||= begin
      if lines < PREVIEW_LINES
        0
      else
        lines - PREVIEW_LINES
      end
    end
  end
  
  def to_json(*a)
    { :id => permalink, :syntax => syntax,
      :lines => lines, :preview_lines => PREVIEW_LINES }.to_json(*a)
  end
  
  def self.truncate(content)
    lines = content.to_s.split("\n")
    
    if lines.size > PREVIEW_LINES
      lines.first(PREVIEW_LINES).join("\n") + "\n..."
    else
      content.to_s
    end
  end
end
