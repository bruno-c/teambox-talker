Talker.UserFlux = function() {
  var self = this;
  
  self.onJoin = function(event) {
    var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has entered the room')));
    
    element.appendTo('#log');
  }
    
  self.onLeave = function(event) {
    var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has left the room')));
    
    element.appendTo('#log');
  }
}

