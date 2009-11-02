Talker.Broadcaster = {
  callbacks: ["Load", "Join", "Leave", "MessageReceived", "Users", "Back", "Idle", "Connected"],
  plugins: [],
  
  // Notify all subscribers about an event
  broadcast: function(eventName, eventData) {
    _.each(this.plugins, function(plugin){
      var fn = plugin["on" + eventName];
      if (fn) fn(eventData);
    });
  }
};

// Define all callbacks as a function on<EventName>
_.each(Talker.Broadcaster.callbacks, function(callback){
  Talker.Broadcaster["on" + callback] = function(data) {
    Talker.Broadcaster.broadcast(callback, data);
  };
});

Talker.plugins = Talker.Broadcaster.plugins;