// updates user lists on the sidebar
Talker.LogsUserList = function(element) {
  var self = this;
  
  self.onJoin = 
  self.onMessageReceived = function(event) {
    add(event.user);
  };
  
  function add(user) {
    if ($("#user_" + user.id).length < 1) {
     $('<li/>')
        .attr("id", "user_" + user.id)
        .attr('user_id', user.id)
        .attr('user_name', user.name)
        .html('<img alt="' + user.name + '" src="' + avatarUrl(user) + '" /> ' + user.name)
        .appendTo(element);
    }
  };
}

