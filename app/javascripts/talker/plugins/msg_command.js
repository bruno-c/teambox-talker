Talker.MsgCommand = function() {
  var self = this;
  
  self.command = 'msg';
  self.usage = '/msg @username This is your message';
  
  self.onCommand = function(event) {
    if (event.command == "msg") {
      var userName = event.args[0].replace('@', '').toLowerCase();
      var user = _.detect(Talker.users, function(user) { return user.name.toLowerCase() == userName });
      
      if (user == null) throw new CommandError("Unknown user: " + userName);
      
      var content = event.args.slice(1).join(" ");
      
      Talker.client.send({content: content, to: user.id});
      $('#msgbox').val('');
      Talker.trigger("MessageSent", event);

      Talker.insertMessage({
        content: 'to ' + user.name  + '&nbsp;&nbsp;<img src="' + avatarUrl(user) + '" height="16" width="16" alt="' + user.name + '" class="avatar private" />&nbsp;' + content,
        private: true,
        time: parseInt(new Date().getTime() / 1000),
        type: "message",
        user: Talker.currentUser
      });
      
      
      return false;
    }
  }
}
