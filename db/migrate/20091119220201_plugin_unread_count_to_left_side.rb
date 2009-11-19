class PluginUnreadCountToLeftSide < ActiveRecord::Migration
  def self.up
    p = Plugin.find_by_name('Title Message Count')
    p.source = <<-EOS
plugin.count = 0;
plugin.originalTitle = document.title;

plugin.onLoaded = function() {
  plugin.onBlur = function() {
    plugin.onMessageReceived = function(event) {
      plugin.count = plugin.count + 1;
      document.title = "(" + plugin.count + ") " + plugin.originalTitle;
    }
  }

  plugin.onFocus = function() {
    plugin.count = 0;
    document.title = plugin.originalTitle;
    plugin.onMessageReceived = function(event) { }
  }
}
EOS
    p.save
  end

  def self.down
    p = Plugin.find_by_name('Title Message Count')
    p.source = <<-eos
plugin.count = 0;
plugin.originalTitle = document.title;

plugin.onLoaded = function() {
  plugin.onBlur = function() {
    plugin.onMessageReceived = function(event) {
      plugin.count = plugin.count + 1;
      document.title = plugin.originalTitle + " (" + plugin.count + ")";;
    }
  }

  plugin.onFocus = function() {
    plugin.count = 0;
    document.title = plugin.originalTitle;
    plugin.onMessageReceived = function(event) { }
  }
}
eos
    p.save
  end
end
