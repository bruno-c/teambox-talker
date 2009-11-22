// Sweep pending events.
Talker.Pending = function() {
  var self = this;
  
  self.onMessageInsertion =
  self.onNoticeInsertion = function(talkerEvent) {
    if (talkerEvent.id == "pending") {
      Talker.getLastRow().find("p:last").addClass("pending").attr("id", "");
    }
  };
  
  // Remove first pending message if we receive a message from the current user.
  self.onMessageReceived = function(talkerEvent) {
    if (talkerEvent.id == "pending") return;
    
    var pending = $("#log .pending:first");
    
    if (pending[0] && talkerEvent.user.id == Talker.currentUser.id) {
      pending.attr("id", "event_" + talkerEvent.id).
              removeClass("pending");
      return false;
    }
  }
}