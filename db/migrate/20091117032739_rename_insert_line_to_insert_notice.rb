class RenameInsertLineToInsertNotice < ActiveRecord::Migration
  def self.up
    p = Plugin.find_by_name('Leave & Join')
    p.source = <<-eos
plugin.onLeave = function(event) {
Talker.insertNotice(event, h(event.user.name) + ' has left the room');
}
plugin.onJoin = function(event) {
Talker.insertNotice(event, h(event.user.name) + ' has entered the room');
}
eos
    p.save
  end

  def self.down
    p = Plugin.find_by_name('Leave & Join')
    p.source <<-eos
plugin.onLeave = function(event) {
  Talker.insertLine(event, h(event.user.name) + ' has left the room');
}
plugin.onJoin = function(event) {
  Talker.insertLine(event, h(event.user.name) + ' has entered the room');
} 
eos
    p.save
  end
end
