// Add color to user lists on the sidebar
Talker.UserColors = function(element) {
  var self = this;
  
  self.onLoaded = function(){
    self.onMessageReceived = function(event) {
      updateUserColor(event.user, event.color);
    };
    
    self.onJoin = function(event) {
      updateUserColor(event.user, Talker.userColors[event.user.id]);
    }
    
    self.onUsers = function(event) {
      $(event.users).each(function(){
        updateUserColor(this, Talker.userColors[this.id]);
      });
    }
  }
  
  function updateUserColor(user, color) {
    var userElement = $("#user_" + user.id);
    userElement.css('backgroundColor', color);
    return userElement;
  };
}