// updates user lists on the sidebar
Talker.UserList = function(element) {
  var self = this;
  
  self.onLoaded = function(){
    self.onJoin = function(event) {
      add(event.user);
    };
    
    self.onMessageReceived = function(event) {
      update(event.user);
    };

    self.onLeave = function(event) {
      remove(event.user);
    }
    
    self.onIdle = function(event) {
      userElement(event.user).css('opacity', 0.5).addClass('idle');
    };

    self.onBack = function(event) {
      userElement(event.user).css('opacity', 1.0).removeClass('idle');
    };

    self.onUsers = function(event) { // this only ever occurs from talker directly so no worries about logs impeding.
      $(event.users).each(function(){
        add(this);
      });
    }
  }
  
  function userElement(user) {
    return $("#user_" + user.id)
  }
  
  // private
  function remove(user) {
    userElement(user).animate({opacity: 0.0}, 400, function(){ $(this).remove() });
  }
  
  function add(user) {
    if (userElement(user).length < 1) {
      updateUserElement($('<li/>'), user).appendTo(element);
    }
  };
  
  function update(user) {
    var e = userElement(user);
    if (e.length > 0) {
      updateUserElement(e, user);
    }
  }
  
  function updateUserElement(userElement, user) {
    userElement
      .attr("id", "user_" + user.id)
      .attr('user_id', user.id)
      .attr('user_name', user.name)
      .html('<img alt="' + user.name + '" src="' + avatarUrl(user) + '" /> ' + user.name);
    return userElement;
  };
}

