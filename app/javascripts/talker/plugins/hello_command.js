Talker.HelloCommand = function() {
  var self = this;
  
  self.onCommand = function(event) {
    if (event.command == "hello") {
      alert('Hello world!');
    }
  }
}
