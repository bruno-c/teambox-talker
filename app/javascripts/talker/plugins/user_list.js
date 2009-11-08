Talker.UserList = function(element) {
  var self = this;
  
  self.onIdle = function(event) {
    $("#user_" + event.user.id).css('opacity', 0.5).addClass('idle');
  };
  
  self.onBack = function(event) {
    $("#user_" + event.user.id).css('opacity', 1.0).removeClass('idle');
  };
  
  self.onJoin = 
  self.onMessageReceived = function(event) {
    add(event.user);
  };
  
  self.onLeave = function(event) {
    remove(event.user);
  }
  
  self.onUsers = function(event) {
    $(event.users).each(function(){
      add(this);
    });
  }
  
  // private
  function remove(user) {
    $("#user_" + user.id).animate({opacity: 0.0}, 400, function(){ $(this).remove() });
  }
  
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

