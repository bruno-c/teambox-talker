Talker.HelloCommand = function(msgbox) {
  var self = this;
  
  self.msgbox = msgbox;
  
  self.onCommand = function(event) {
    if (event.command == "hello") {
      alert('Hello world!');
      self.msgbox.val('');
      return false;
    }
  }
}
