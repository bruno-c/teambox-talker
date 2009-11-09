Talker.Sender = function(msgbox) {
  var self = this;
  
  self.msgbox = msgbox;
  
  self.onMessageSend = function(event) {
    if (self.msgbox.val().indexOf("/") == 0) {
      try {
        var args = shellwords(self.msgbox.val().substr(1));
        Talker.trigger("Command", {type: "command", command: args[0], args: args.slice(1)});
      } catch (e) {
        if (e.name == "ParseError" || e.name == "CommandError") {
          alert(e.message);
        } else {
          throw e;
        }
      }
      return;
    }
    
    Talker.client.send({content: self.msgbox.val(), type: 'message'});
    self.msgbox.val('');
    
    Talker.trigger("MessageSent", event);
  }
}
