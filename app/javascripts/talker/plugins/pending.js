// Sweep pending events.
Talker.Pending = function() {
  var self = this;
  
  // Remove first pending message if we receive a message from the current user.
  self.onMessageReceived = function(talkerEvent) {
    if (talkerEvent.id == "pending") return;
    
    var pending = Talker.getLastPending();
    
    if (pending[0] && talkerEvent.user.id == Talker.currentUser.id) {
      if (Talker.isPaste(talkerEvent)) {
        pending.remove(); // Pending pastes are shown as a loading gif.
      } else {
        pending.attr("id", "event_" + talkerEvent.id).removeAttr("pending");
        return false;
      }
    }
  }
}