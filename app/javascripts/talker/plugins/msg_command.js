Talker.MsgCommand = function() {
  var self = this;
  
  self.onCommand = function(event) {
    if (event.command == "msg") {
      _.detect(Talker.users, function(user) {
        
      });
      Talker.client.send({content: event.args.slice(1).join(" "), to: event.args[0]});
      $("#msgbox").val('');
    }
  }
}
