Talker.users = [];

Talker.UserList = function() {
  var self = this;
  
  self.onJoin = function(event) {
    self.add(event.user);
  }

  self.onLeave = function(event) {
    self.remove(event.user);
  }
  
  self.onUsers = function(event) {
    $(event.users).each(function(){
      self.add(this);
    });
  }
  
  self.onIdle = function(event) {
    $("#user_" + event.user.id).css('opacity', 0.5).addClass('idle');
  };
  
  self.onBack = function(event) {
    $("#user_" + event.user.id).css('opacity', 1.0).removeClass('idle');
  };
  
  // private
  self.add = function(user) {
    if ($("#user_" + user.id).length < 1) {
      var presence = $('<li/>')
        .attr("id", "user_" + user.id)
        .attr('user_id', user.id)
        .attr('user_name', user.name)
        .html('<img alt="' + user.name + '" src="/images/avatar_default.png" /> ' + user.name)
        .appendTo($('#people'));
        
      presence.animate({opacity: 1.0}, 400);
    }
    Talker.users.push(user);
  };
  
  self.remove = function(user) {
    $("#user_" + user.id).animate({opacity: 0.0}, 400, function(){ $(this).remove() });
    Talker.users = _.reject(Talker.users, function(u) { return u.id == user.id });
  };
}

