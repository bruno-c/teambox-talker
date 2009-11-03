Talker.UserList = function(element) {
  var self = this;
  
  function add(user) {
    if ($("#user_" + user.id).length < 1) {
      console.info("Adding user");
      console.info(user);
      console.info(element[0]);
      $('<li/>')
        .attr("id", "user_" + user.id)
        .attr('user_id', user.id)
        .attr('user_name', user.name)
        .html('<img alt="' + user.name + '" src="' + avatarUrl(user) + '" /> ' + user.name)
        .appendTo(element);
    }
  };
  
  self.onJoin = 
  self.onMessageReceived = function(event) {
    add(event.user);
  };
}

