// cancels all actions on a pending message.
Talker.Pending = function() {
  var self = this;
  
  // after consideration... animating would only remove the feeling of responsiveness.
  self.onMessageReceived = function(talkerEvent) {
    var pending = $('#event_pending').get(0);
    
    if (pending) {
      $(pending).attr('id', 'event_' + talkerEvent.id).attr('time', talkerEvent.time);
      return false;
    }
  }
}