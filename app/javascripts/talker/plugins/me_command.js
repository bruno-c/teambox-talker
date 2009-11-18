Talker.MeCommand = function() {
  var self = this;
  
  self.command = 'me';
  self.usage = '/me loves pizza';
  
  self.onCommand = function(event) {
    if (event.command == "me") {
      Talker.sendAction(event.args.join(" "));
      $('#msgbox').val('');
      Talker.trigger("MessageSent", event);
      return false;
    }
  }
  
  self.onMessageReceived = function(event) {
    if (event.action) {
      Talker.insertNotice(event, event.user.name + ' ' + event.content);
      return false;
    }
  }
}
