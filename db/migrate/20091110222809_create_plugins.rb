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
      Talker.HelloCommand = function() {
        var self = this;
        
        self.onCommand = function(event) {
          if (event.command == "hello") {
            alert('Hello world!');
            $('#msgbox').val('');
            return false;
          }
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
      Talker.DockBadge = function() {
        var self = this;

        self.count = 0;

        self.onLoaded = function() {
          self.onBlur = function() {
            self.onMessageReceived = function(event) {
              self.count = self.count + 1;
              window.dockBadge(self.count);
            }
          }

          self.onFocus = function() {
            self.count = 0;
            window.dockBadge('');
            self.onMessageReceived = function(event) { }
          }
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
      Talker.NewMessageNotifications = function() {
        var self = this;

        self.onLoaded = function() {
          self.onBlur = function() {
            self.onMessageReceived = function(event) {
              Talker.notify(event);
            }
          }

          self.onFocus = function() {
            self.onMessageReceived = function(event) { }
          }
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
      Talker.UserLeaveNotifications = function() {
        var self = this;

        self.onLoaded = function() {
          self.onBlur = function() {
            self.onLeave = function(event) {
              event.content = "has left the room.";
              Talker.notify(event);
            }
          }

          self.onFocus = function() {
            self.onLeave = function() {  }
          }
        }
      };
eos
        p.save

    p = Plugin.new
    p.name = 'Talker.UserJoinNotifications'
    p.description = "Provides Growl notifications of users joining the room when Talker is behind other windows.  Only works with Fluid and Prism."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
      Talker.UserJoinNotifications = function() {
        var self = this;

        self.onLoaded = function() {
          self.onBlur = function() {
            self.onJoin = function(event) {
              event.content = "has entered the room.";
              Talker.notify(event);
            }
          }

          self.onFocus = function() {
            self.onJoin = function() {  }
          }
        }
      };
eos
        p.save
    p = Plugin.new
    p.name = 'Talker.TitleMessageCount'
    p.description = "Updates the title with message count when Talker is behind other windows."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
      Talker.TitleMessageCount = function() {
        var self = this;

        self.count = 0;
        self.originalTitle = document.title;

        self.onLoaded = function() {
          self.onBlur = function() {
            self.onMessageReceived = function(event) {
              self.count = self.count + 1;
              document.title = self.originalTitle + " (" + self.count + ")";;
            }
          }

          self.onFocus = function() {
            self.count = 0;
            document.title = self.originalTitle;
            self.onMessageReceived = function(event) { }
          }
        }
      };
eos
        p.save

    p = Plugin.new
    p.name = 'Talker.TwitterStatuses'
    p.description = "Converts twitter links to preview of twitter status."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
      Talker.TwitterStatuses = function() {
        var self = this;

        self.onAfterMessageReceived = function(event){
          var last_insertion = Talker.Logger.lastRow();
          var twitter_status_expression = /https*:\\/\\/twitter.com\\/\\w+\\/status\\/(\\d+)/i;
          var last_anchor = last_insertion.find('a');
          var last_href = last_anchor.attr('href') || '';

          if (last_href.match(twitter_status_expression)){
            var id = last_href.match(twitter_status_expression)[1];
            var url = 'http://twitter.com/statuses/show/' + id + '.json?callback=?';

            $.getJSON(url, function(data){
              last_insertion.find('a').html($('<q/>').css({
                clear: 'both'
                float: 'left'
              }).append(
                $('<img/>').attr({src: data.user.profile_image_url, height: 48, width: 48})
                .css('margin', '4px')
              ).append('"' + data.text + '"'));
            });
          }
        }
      };
eos
     p.save
   
     p = Plugin.new
     p.name = 'Talker.UserLeave'
     p.description = "Shows who leaves the room in the log."
     p.author_id = User.talker.id
     p.shared = true
     p.source = <<-eos
      Talker.UserLeave = function() {
        var self = this;

        self.onLeave = function(event) {
          var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
            .append($('<td/>').addClass('author'))
            .append($('<td/>').addClass('message')
              .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has left the room')));

          element.appendTo('#log');
        }
      }
eos
        p.save

      p = Plugin.new
      p.name = 'Talker.UserJoin'
      p.description = "Shows who leaves the room in the log."
      p.author_id = User.talker.id
      p.shared = true
      p.source = <<-eos
      Talker.UserJoin = function() {
        var self = this;

        self.onJoin = function(event) {
          var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
            .append($('<td/>').addClass('author'))
            .append($('<td/>').addClass('message')
              .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has entered the room')));

          element.appendTo('#log');
        }
      } 
eos
      p.save
      
      p = Plugin.new
      p.name = 'Talker.EmoticonsFormatter'
      p.description = "Shows common emoticons."
      p.author_id = User.talker.id
      p.shared = true
      p.source = <<-eos
      Talker.EmoticonsFormatter = function() {
        var self = this;

        self.onAfterMessageReceived = function(event){
          _.each(Talker.emoticons, function(emoticon){
            var element = Talker.Logger.lastRow().find('p:last').get(0);
            emoticon.findAndReplace(element);
          });
        }
      };

      Talker.Emoticon = function(matchers, path, meaning){
        var self = this;

        self.strings = matchers ;
        self.path = path;
        self.meaning = meaning;

        self.findAndReplace = function(domElement){
          _.each(self.strings, function(string){
           $(domElement).findAndReplace(string, self.replacementString(string));
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

      if (!Talker.emoticons){
        Talker.emoticons = [];
      }

      Talker.emoticons.push(new Talker.Emoticon(['>:-)', '>:)'],            "/images/icons/smiley-evil.png",    "evil"));
      Talker.emoticons.push(new Talker.Emoticon([':-))', ':))'],            "/images/icons/smiley-lol.png",     "laughing"));
      Talker.emoticons.push(new Talker.Emoticon([':-)',  ':)'],             "/images/icons/smiley.png",         "smiling"));
      Talker.emoticons.push(new Talker.Emoticon([':-D'],                    "/images/icons/smiley-grin.png",    "grin"));
      Talker.emoticons.push(new Talker.Emoticon(['X(', 'X-('],              "/images/icons/smiley-mad.png",     "angry"));
      Talker.emoticons.push(new Talker.Emoticon([':(', ':-('],              "/images/icons/smiley-sad.png",     "sad"));
      Talker.emoticons.push(new Talker.Emoticon([';(', ';-('],              "/images/icons/smiley-cry.png",     "cry"));
      Talker.emoticons.push(new Talker.Emoticon(['B)', 'B-)', '8)', '8-)'], "/images/icons/smiley-cool.png",    "cool"));
      Talker.emoticons.push(new Talker.Emoticon([':S', ':-S'],              "/images/icons/smiley-confuse.png", "confused"));
      Talker.emoticons.push(new Talker.Emoticon([':O', ':-O'],              "/images/icons/smiley-eek.png",     "shocked"));
      Talker.emoticons.push(new Talker.Emoticon([':P', ':-P'],              "/images/icons/smiley-razz.png",    "razz"));
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
