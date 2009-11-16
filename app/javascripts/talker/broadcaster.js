Talker.Broadcaster = {
  plugins: [],
  
  // Notify all subscribers about an event
  broadcast: function(eventName, eventData) {
    for (var i = 0; i < this.plugins.length; i++){
      var fn = this.plugins[i]["on" + eventName];
      if (fn && fn(eventData) === false){
        return false;
      }
    };
    return true;
  },
  
  broadcastEvent: function(event) {
    var eventName = (event.type == 'message' 
                  ? 'MessageReceived' 
                  :  event.type.charAt(0).toUpperCase() + event.type.substr(1, event.type.length));
    Talker.Broadcaster.broadcast(eventName, event);
  }
};

Talker.plugins = Talker.Broadcaster.plugins;
Talker.trigger = Talker.Broadcaster.broadcast;