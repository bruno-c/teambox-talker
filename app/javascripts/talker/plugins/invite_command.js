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
}
