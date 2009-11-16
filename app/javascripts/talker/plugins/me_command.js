Talker.MeCommand = function() {
  var self = this;
  
  self.command = 'me';
  self.usage = '/me loves pizza';
  
  self.onCommand = function(event) {
    if (event.command == "me") {
      Talker.client.send({content: '/me ' + event.args.join(" ")});
      $('#msgbox').val('');
      Talker.trigger("MessageSent", event);
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
