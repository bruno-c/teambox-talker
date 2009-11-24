// Sweep pending events.
Talker.Pending = function() {
  var self = this;
  
  self.onMessageInsertion =
  self.onNoticeInsertion = function(talkerEvent) {
    if (talkerEvent.id == "pending") {
      var line = Talker.getLastRow().find("p:last")
      
      line.addClass("pending").
           attr("id", "");
      
      // If it's a paste, we show a "loading" gif.
      if (Talker.isPaste(talkerEvent)) {
        line.html($("<img/>").attr("src", "/images/loader.gif"));
      }
    }
  };
  
  // Remove first pending message if we receive a message from the current user.
  self.onMessageReceived = function(talkerEvent) {
    if (talkerEvent.id == "pending") return;
    
    var pending = $("#log .pending:first");
    
    if (pending[0] && talkerEvent.user.id == Talker.currentUser.id) {
      if (Talker.isPaste(talkerEvent)) {
        // Pending pastes are shown as a loading gif.
        pending.remove();
      } else {
        pending.removeClass("pending").
                attr("id", "event_" + talkerEvent.id);
        return false;
      }
    }
  }
}