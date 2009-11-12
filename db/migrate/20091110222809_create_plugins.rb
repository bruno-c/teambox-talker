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
    p.name = 'Talker.HelloCommand'
    p.description = "Sample plugin to greet the world and cure world hunger."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
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
    p.name = 'Talker.DockBadge'
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
    p.name = 'Talker.NewMessageNotifications'
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
    p.name = 'Talker.UserLeaveNotifications'
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
  }

  plugin.onFocus = function() {
    plugin.onLeave = function() {  }
  }
}
eos
    p.save

    p = Plugin.new
    p.name = 'Talker.UserJoinNotifications'
    p.description = "Provides Growl notifications of users joining the room when Talker is behind other windows.  Only works with Fluid and Prism."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.onLoaded = function() {
  plugin.onBlur = function() {
    plugin.onJoin = function(event) {
      event.content = "has entered the room.";
      Talker.notify(event);
    }
  }

  plugin.onFocus = function() {
    plugin.onJoin = function() {  }
  }
}
eos
    p.save
    p = Plugin.new
    p.name = 'Talker.TitleMessageCount'
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
    p.name = 'Talker.TwitterStatuses'
    p.description = "Converts twitter links to preview of twitter status."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.onAfterMessageReceived = function(event){
  var last_insertion = Talker.Logger.lastRow();
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
     p.name = 'Talker.UserLeave'
     p.description = "Shows who leaves the room in the log."
     p.author_id = User.talker.id
     p.shared = true
     p.source = <<-eos
plugin.onLeave = function(event) {
  var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
    .append($('<td/>').addClass('author'))
    .append($('<td/>').addClass('message')
      .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has left the room')));

  element.appendTo('#log');
}
eos
      p.save

      p = Plugin.new
      p.name = 'Talker.UserJoin'
      p.description = "Shows who leaves the room in the log."
      p.author_id = User.talker.id
      p.shared = true
      p.source = <<-eos
plugin.onJoin = function(event) {
  var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
    .append($('<td/>').addClass('author'))
    .append($('<td/>').addClass('message')
      .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has entered the room')));

  element.appendTo('#log');
}
eos
      p.save
      
      p = Plugin.new
      p.name = 'Talker.EmoticonsFormatter'
      p.description = "Shows common emoticons."
      p.author_id = User.talker.id
      p.shared = true
      p.source = <<-eos
plugin.Emoticon = function(matchers, path, meaning){
  var self = this;

  self.strings = matchers ;
  self.path = path;
  self.meaning = meaning;

  self.findAndReplace = function(domElement){
    _.each(self.strings, function(string){
     $(domElement).findAndReplace(string, plugin.replacementString(string));
    });
  }

  self.replacementString = function(string){
    return '<img src="' 
        + self.path 
        + '" class="emoticons" height="16" width="16" alt="' 
        + string
        + '" title="' 
        + self.meaning + '"  />';
  }

  return self;
}

plugin.onAfterMessageReceived = function(event){
  _.each(Talker.emoticons, function(emoticon){
    var element = Talker.Logger.lastRow().find('p:last').get(0);
    emoticon.findAndReplace(element);
  });
}

plugin.emoticons = [];
plugin.emoticons.push(new Talker.Emoticon(['>:-)', '>:)'],            "/images/icons/smiley-evil.png",    "evil"));
plugin.emoticons.push(new Talker.Emoticon([':-))', ':))'],            "/images/icons/smiley-lol.png",     "laughing"));
plugin.emoticons.push(new Talker.Emoticon([':-)',  ':)'],             "/images/icons/smiley.png",         "smiling"));
plugin.emoticons.push(new Talker.Emoticon([':-D'],                    "/images/icons/smiley-grin.png",    "grin"));
plugin.emoticons.push(new Talker.Emoticon(['X(', 'X-('],              "/images/icons/smiley-mad.png",     "angry"));
plugin.emoticons.push(new Talker.Emoticon([':(', ':-('],              "/images/icons/smiley-sad.png",     "sad"));
plugin.emoticons.push(new Talker.Emoticon([';(', ';-('],              "/images/icons/smiley-cry.png",     "cry"));
plugin.emoticons.push(new Talker.Emoticon(['B)', 'B-)', '8)', '8-)'], "/images/icons/smiley-cool.png",    "cool"));
plugin.emoticons.push(new Talker.Emoticon([':S', ':-S'],              "/images/icons/smiley-confuse.png", "confused"));
plugin.emoticons.push(new Talker.Emoticon([':O', ':-O'],              "/images/icons/smiley-eek.png",     "shocked"));
plugin.emoticons.push(new Talker.Emoticon([':P', ':-P'],              "/images/icons/smiley-razz.png",    "razz"));

eos
    p.save
      
    Account.all.each do |account|
      account.create_default_plugin_installations
    end
  end

  def self.down
    drop_table :plugins
    drop_table :plugin_installations
  end
end
