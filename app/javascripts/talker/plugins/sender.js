Talker.Sender = function(msgbox) {
  var self = this;
  
  self.msgbox = msgbox;
  
  self.onMessageSend = function(event) {
    if (self.msgbox.val().indexOf("/") == 0) {
      var args = shellwords(self.msgbox.val().substr(1));
      Talker.trigger("Command", {type: "command", command: args[0], args: args.slice(1)});
      self.msgbox.val('');
      return false;
    }
    
    Talker.client.send({content: self.msgbox.val(), type: 'message'});
    self.msgbox.val('');
    
    Talker.trigger("MessageSent", event);
  }
}
