Talker.InviteCommand = function(options) {
  var self = this;
  
  self.command = 'invite';
  self.usage = '/invite john.doe@email.com';
  
  self.onCommand = function(event) {
    if (event.command == "invite") {
      var user_emails = event.args.join(",");
      
      $.post(options.invites_url, {invitees: user_emails}, function(data) {
        eval(data);
      }, 'js');
      
      $('#msgbox').val('');
      return false;
    }
  }
  
  self.onMessageReceived = function(event) {
    if (event.content.substring(0,4) == '/me ') {
      Talker.insertLine(event, h(event.user.name) + ' ' + shellwords(event.content).slice(1).join(" "));
      return false;
    }
  }
}
