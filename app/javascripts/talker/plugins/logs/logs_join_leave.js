Talker.LogsJoinLeave = function(){
  var plugin = this;
  
  plugin.onLeave = function(event) {
    Talker.insertLine(event, h(event.user.name) + ' has left the room');
  }
  plugin.onJoin = function(event) {
    Talker.insertLine(event, h(event.user.name) + ' has entered the room');
  }  
}
