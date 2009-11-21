Talker.Broadcaster = {
  callbacks: ["Load", "MessageReceived",
              "Join", "Leave", "Back", "Idle",
              "Users", "Open", "Connected",
              "Close", "Error"],
  plugins: [],
  
  // Notify all subscribers about an event
  broadcast: function(eventName, eventData) {
    var eventHandlerString = "on" + eventName;
    for (var i = 0, len = this.plugins.length; i < len; i++){
      var fn = this.plugins[i][eventHandlerString];
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

// Define all callbacks as a function on<EventName>
_.each(Talker.Broadcaster.callbacks, function(callback){
  Talker.Broadcaster["on" + callback] = function(data) {
    Talker.Broadcaster.broadcast(callback, data);
  };
});

Talker.plugins = Talker.Broadcaster.plugins;
Talker.trigger = Talker.Broadcaster.broadcast;