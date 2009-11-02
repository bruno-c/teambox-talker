Talker.MsgCommand = function() {
  var self = this;
  
  self.onCommand = function(event) {
    if (event.command == "msg") {
      Talker.client.send({content: event.args.slice(1).join(" "), to: event.args[0]});
      $("#msgbox").val('');
    }
  }
}
/*
/me loves lolcats. => Gary loves lolcats.
/invite "John Doe" john@doe.com
/invite john@doe.com
/msg John do you love lolcats?
*/