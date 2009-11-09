Talker.SystemNotification = function() {
  var self = this;
  
  
  
  self.onNotification = function(event) {
    if (window.notifications.notifications_support()) {
      if (event.type != 'message'){
        var presence_messages = {'join': 'has joined the room', 'leave': 'has left the room'};
        event.content = presence_messages[event.type];
      } 
      
      window.notifications.notify({
        title: Talker.room.name,
        description: h(event.user.name) + ": " + event.content
      });
    }
  }
};