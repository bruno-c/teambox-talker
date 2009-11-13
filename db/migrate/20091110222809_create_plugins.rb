class CreatePlugins < ActiveRecord::Migration
  def self.up
    create_table :plugins do |t|
      t.string :name
      t.string :description
      t.text :source
      t.integer :author_id
      t.integer :account_id
      t.boolean :shared, :default => false

      t.timestamps
    end
    
    create_table :plugin_installations do |t|
      t.integer :account_id
      t.integer :plugin_id
      
      t.timestamps
    end
    
    
    p = Plugin.new
    p.name = 'Hello Command'
    p.description = "Sample plugin to greet the world and cure world hunger."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.command = 'hello';
plugin.usage = '/hello';

plugin.onCommand = function(event) {
  if (event.command == "hello") {
    alert('Hello world!');
    $('#msgbox').val('');
    return false;
  }
}
eos
    p.save
    
    
    p = Plugin.new
    p.name = 'Dock Badge'
    p.description = "Dock icon warns you of what new messages you had while you were away.  Only works with Fluid and Prism."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.count = 0;

plugin.onLoaded = function() {
  plugin.onBlur = function() {
    plugin.onMessageReceived = function(event) {
      plugin.count = plugin.count + 1;
      window.dockBadge(plugin.count);
    }
  }

  plugin.onFocus = function() {
    plugin.count = 0;
    window.dockBadge('');
    plugin.onMessageReceived = function(event) { }
  }
}
eos
    p.save
    
    p = Plugin.new
    p.name = 'New Message Notifications'
    p.description = "Provides Growl notifications of new messages when Talker is behind other windows.  Only works with Fluid and Prism."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.onLoaded = function() {
  plugin.onBlur = function() {
    plugin.onMessageReceived = function(event) {
      Talker.notify(event);
    }
  }

  plugin.onFocus = function() {
    plugin.onMessageReceived = function(event) { }
  }
}
eos
    p.save

    p = Plugin.new
    p.name = 'Leave & Join Notifications'
    p.description = "Provides Growl notifications of users leaving the room when Talker is behind other windows.  Only works with Fluid and Prism."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.onLoaded = function() {
  plugin.onBlur = function() {
    plugin.onLeave = function(event) {
      event.content = "has left the room.";
      Talker.notify(event);
    }
    plugin.onJoin = function(event) {
      event.content = "has entered the room.";
      Talker.notify(event);
    }
  }

  plugin.onFocus = function() {
    plugin.onLeave = function() {  }
    plugin.onJoin = function() {  }
  }
}
eos
    p.save

    p.save
    p = Plugin.new
    p.name = 'Title Message Count'
    p.description = "Updates the title with message count when Talker is behind other windows."
    p.author_id = User.talker.id
    p.shared = true
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

    p = Plugin.new
    p.name = 'Twitter Statuses'
    p.description = "Converts twitter links to preview of twitter status."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.onMessageInsertion = function(event){
  var last_insertion = Talker.getLastRow();
  var twitter_status_expression = /https*:\\/\\/twitter.com\\/\\w+\\/status\\/(\\d+)/i;
  var last_anchor = last_insertion.find('a');
  var last_href = last_anchor.attr('href') || '';

  if (last_href.match(twitter_status_expression)){
    var id = last_href.match(twitter_status_expression)[1];
    var url = 'http://twitter.com/statuses/show/' + id + '.json?callback=?';

    $.getJSON(url, function(data){
      last_insertion.find('a').html($('<q/>').css({
        clear: 'both',
        float: 'left'
      }).append(
        $('<img/>').attr({src: data.user.profile_image_url, height: 48, width: 48})
        .css('margin', '4px')
      ).append('"' + data.text + '"'));
    });
  }
}
eos
     p.save

      p = Plugin.new
      p.name = 'Leave & Join'
      p.description = "Shows who leaves and joins the room in the log."
      p.author_id = User.talker.id
      p.shared = true
      p.source = <<-eos
plugin.onLeave = function(event) {
  Talker.insertLine(event, h(event.user.name) + ' has left the room');
}
plugin.onJoin = function(event) {
  Talker.insertLine(event, h(event.user.name) + ' has entered the room');
}
eos
      p.save
      
      p = Plugin.new
      p.name = 'Emoticons Formatter'
      p.description = "Shows common emoticons."
      p.author_id = User.talker.id
      p.shared = true
      p.source = <<-eos
plugin.Emoticon = function(matchers, path, meaning){
  var self = this;
  
  self.strings = matchers ;
  self.path = path;
  self.meaning = meaning;

  self.replacementString = function(string){
    return '<img src="' 
        + self.path 
        + '" class="emoticons" height="16" width="16" alt="' 
        + string
        + '" title="' 
        + self.meaning + '"  />';
  }
  
  this.findAndReplace = function(domElement){
    _.each(self.strings, function(string){
      $(domElement).findAndReplace(string, self.replacementString(string));
    });
  }
}
plugin.emoticons = [];
plugin.emoticons.push(new plugin.Emoticon(['>:-)', '>:)'],            "/images/icons/smiley-evil.png",    "evil"));
plugin.emoticons.push(new plugin.Emoticon([':-))', ':))'],            "/images/icons/smiley-lol.png",     "laughing"));
plugin.emoticons.push(new plugin.Emoticon([':-)',  ':)'],             "/images/icons/smiley.png",         "smiling"));
plugin.emoticons.push(new plugin.Emoticon([':-D'],                    "/images/icons/smiley-grin.png",    "grin"));
plugin.emoticons.push(new plugin.Emoticon(['X(', 'X-('],              "/images/icons/smiley-mad.png",     "angry"));
plugin.emoticons.push(new plugin.Emoticon([':(', ':-('],              "/images/icons/smiley-sad.png",     "sad"));
plugin.emoticons.push(new plugin.Emoticon([';(', ';-('],              "/images/icons/smiley-cry.png",     "cry"));
plugin.emoticons.push(new plugin.Emoticon(['B)', 'B-)', '8)', '8-)'], "/images/icons/smiley-cool.png",    "cool"));
plugin.emoticons.push(new plugin.Emoticon([':S', ':-S'],              "/images/icons/smiley-confuse.png", "confused"));
plugin.emoticons.push(new plugin.Emoticon([':O', ':-O'],              "/images/icons/smiley-eek.png",     "shocked"));
plugin.emoticons.push(new plugin.Emoticon([':P', ':-P'],              "/images/icons/smiley-razz.png",    "razz"));

plugin.onMessageInsertion = function(event){
  _.each(plugin.emoticons, function(emoticon){
    var element = Talker.getLastRow().find('p:last').get(0);
    emoticon.findAndReplace(element);
  });
}
eos
    p.save
    
    Plugin.reset_column_information
    PluginInstallation.reset_column_information
    Account.reset_column_information
    
    Account.all.each do |account|
      account.create_default_plugin_installations
    end
  end

  def self.down
    drop_table :plugins
    drop_table :plugin_installations
  end
end
