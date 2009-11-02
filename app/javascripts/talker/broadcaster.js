Talker.Broadcaster = {
  callbacks: ["Load", "Join", "Leave", "MessageReceived", "Users", "Back", "Idle", "Connected"],
  plugins: [],
  
  // Notify all subscribers about an event
  broadcast: function(eventName, eventData) {
    _(this.plugins).each(function(plugin){
      var fn = plugin["on" + eventName];
      if (fn) fn(eventData);
    });
  },
};

// Define all callbacks as a function on<EventName>
_(Talker.Publisher.callbacks).each(function(callback){
  Talker.Publisher["on" + callback] = function(data) {
    Talker.Publisher.broadcast(callback, data);
  };
});

Talker.plugins = Talker.Broadcaster.plugins;