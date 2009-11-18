Talker.RoomUpdater = function(url) {
  var self = this;

  self.onMessageReceived = function(event) {
    if (event.update) {
      $.getScript(url);
    }
  };
};