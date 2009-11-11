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
    
    Plugin.create(
      :name => 'Talker.HelloCommand',
      :description => "Sample plugin to greet the world and cure world hunger.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)
    Plugin.create(
      :name => 'Talker.DockBadge',
      :description => "Dock icon warns you of what new messages you had while you were away.  Only works with Fluid and Prism.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)
    Plugin.create(
      :name => 'Talker.NewMessageNotifications',
      :description => "Provides Growl notifications of new messages when Talker is behind other windows.  Only works with Fluid and Prism.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)

    Plugin.create(
      :name => 'Talker.UserLeaveNotifications',
      :description => "Provides Growl notifications of users leaving the room when Talker is behind other windows.  Only works with Fluid and Prism.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)

    Plugin.create(
      :name => 'Talker.UserJoinNotifications',
      :description => "Provides Growl notifications of users joining the room when Talker is behind other windows.  Only works with Fluid and Prism.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)
    Plugin.create(
      :name => 'Talker.TitleMessageCount',
      :description => "Updates the title with message count when Talker is behind other windows.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)

     Plugin.create(
      :name => 'Talker.TwitterStatuses',
      :description => "Converts twitter links to preview of twitter status.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
                clear: 'both',
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
)
   
     Plugin.create(
      :name => 'Talker.UserLeave',
      :description => "Shows who leaves the room in the log.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)

     Plugin.create(
      :name => 'Talker.UserJoin',
      :description => "Shows who leaves the room in the log.",
      :author_id => User.talker.id,
      :shared => true,
      :source => <<-eos
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
)
    
  end

  def self.down
    drop_table :plugins
    drop_table :plugin_installations
  end
end
