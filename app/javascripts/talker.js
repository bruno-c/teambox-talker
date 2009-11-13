Talker = {};

//= require "talker/orbited"
//= require "talker/client"

Talker.notify = function(event) {
  if (window.notifications && window.notifications.notifications_support()) {
    window.notifications.notify({
      title: Talker.room.name,
      description: h(event.user.name) + ": " + event.content
    });
  }
};

Talker.send = function(message) {
  return Talker.trigger("MessageSend", {type:"message", message});
};