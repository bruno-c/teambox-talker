class Paste < ActiveRecord::Base
  PREVIEW_LINES = 15 # Same as in Talker::Paster (server/lib/talker/paster.rb)
  
  has_many :connections, :as => :channel, :dependent => :destroy
  
  validates_presence_of :content
  
  before_create { |p| p.id = ActiveSupport::SecureRandom.hex(10) }
  
  attr_accessible :content, :syntax
  
  def lines
    @lines ||= content.count("\n")
  end
  
  def truncated
    Paste.truncate(content)
  end
  
  def to_json(*a)
    { :id => id, :lines => lines, :preview_lines => PREVIEW_LINES }.to_json(*a)
  end
  
  def self.truncate(content)
    lines = content.to_s.split("\n")
    
    if lines.size > PREVIEW_LINES
      lines.first(PREVIEW_LINES).join("\n") + "\n..."
    else
      content.to_s
    end
  end
  
  def self.filter(content)
    if content.include?("\n")
      yield paste = Paste.create(:content => content)
      paste.truncated
    else
      content
    end
  end
end
