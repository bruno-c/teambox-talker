Talker.MsgCommand = function() {
  var self = this;
  
  self.onCommand = function(event) {
    if (event.command == "msg") {
      var userName = event.args[0];
      var user = _.detect(Talker.users, function(user) { return user.name == userName });
      
      if (user == null) throw new CommandError("Unknown user: " + userName);
      
      Talker.client.send({content: event.args.slice(1).join(" "), to: user.id});
      
      Talker.trigger("MessageSent", event);
    }
  }
}
