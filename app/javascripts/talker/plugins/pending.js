// Sweep pending events.
Talker.Pending = function() {
  var self = this;
  
  self.onMessageReceived = function(talkerEvent) {
    // Tag pending events for being replaced with real event
    // from server.
    if (talkerEvent.id == "pending") {
      var line = Talker.getLastRow().find("p:last")
      
      line.addClass("pending").
           attr("id", "");
      
      // If it's a paste, we show a "loading" gif.
      if (Talker.isPaste(talkerEvent)) {
        line.html($("<img/>").attr("src", "/images/loader.gif"));
        return false;
      }
      
      return;
    }
    
    var pending = $("#log .pending:first");
    
    // We received the "real" version of a message tagged as pending.
    // Update first pending message if we receive a message from the current user.
    if (pending[0] && talkerEvent.user.id == Talker.currentUser.id) {
      if (Talker.isPaste(talkerEvent)) {
        // Pending pastes are shown as a loading gif. So just remove, will be replaced later
        // in the chain.
        pending.remove();
      } else {
        pending.removeClass("pending").
                attr("id", "event_" + talkerEvent.id);
        return false;
      }
    }
  }
}