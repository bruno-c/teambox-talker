Talker.InviteCommand = function(options) {
  var self = this;
  
  self.command = 'invite';
  self.usage = '/invite john.doe@email.com';
  
  self.onCommand = function(event) {
    if (event.command == "invite") {
      var userEmails = event.args.join(",");
      
      $.post(options.invites_url, {invitees: userEmails, room_id: Talker.getRoom().id}, null, 'script');
      
      $('#msgbox').val('');
      return false;
    }
  }
}
