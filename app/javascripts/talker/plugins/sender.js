Talker.Sender = function(msgbox) {
  var self = this;
  
  self.onMessageSend = function(event) {
    if (!event.content) return;
    
    if (!Talker.isPaste(event) && event.content.indexOf("/") == 0) {
      try {
        var args = shellwords(event.content.substr(1));
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
    
    Talker.sendMessage(event.content);
    
    // Clear message box only if message sent was from it
    if (msgbox.val() === event.content)
      msgbox.val('');
    
    Talker.trigger("MessageSent", event);
  }
}
