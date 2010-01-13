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
      update(event.user);
      userElement(event.user).css('opacity', 0.5).addClass('idle');
    };

    self.onBack = function(event) {
      update(event.user);
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
      updateUserElement($('<li/>'), user).attr("id", "user_" + user.id). // ID never changes
                                          attr('user_id', user.id).
                                          appendTo(element);
    }
  };
  
  function update(user) {
    var e = userElement(user);
    if (e.length > 0) {
      updateUserElement(e, user);
    }
  }
  
  function updateUserElement(userElement, user) {
    var oldName = userElement.attr('user_name');
    if (user.name != oldName) {
      userElement.attr('user_name', user.name).
                  attr('title', user.name).
                  html(
                    $("<img/>").attr("alt", h(user.name)).
                                attr("src", avatarUrl(user))
                  ).
                  append("\n" + truncate(h(user.name), 8));
    }
    return userElement;
  };
}

