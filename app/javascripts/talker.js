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
}

Talker.error = function(error, msg){
  if (console.error){
    console.info(error);
    console.error(msg + " caused a problem");
  }
}