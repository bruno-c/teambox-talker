// 1) Handles incoming events, messages, notices and errors in the browser log.
// 2) Updates list of users in the chat room..
Receiver = {
  // handles all incoming messages in a triage fashion eventually becoming an insertion in the log
  push: function(data, replay, linkToLogs) {
    if (data.type == null) return;
    
    if (typeof Receiver[data.type] == 'function'){
      Receiver[data.type](data, replay, linkToLogs);
      if (!replay) {
        ChatRoom.scroller.scrollToBottom();
        resizeLogElements();
        ChatRoom.notifier.push(data);
      }
    }else{
      console.info(JSON.encode(data, replay, index));
      console.error("*** Unable to handle data type: (" + data.type + ") with data.  Format may not be appropriate.");
    }
  },
  
  connected: function(data, replay) {
    $('#msgbox').focus();
  },
  
  users: function(data){
    $(data.users).each(function(){
      UserList.add(this);
    });
  },
  
  join: function(data, replay) {
    UserList.add(data.user, replay);
    
    var element = $('<tr/>').attr('author', data.user.name).addClass('received').addClass('notice').addClass('user_' + data.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', data.time).html(data.user.name + ' has entered the room')));
    
    element.appendTo('#log');
  },
  
  leave: function(data, replay) {
    UserList.remove(data.user, replay);
    
    var element = $('<tr/>').attr('author', data.user.name).addClass('received').addClass('notice').addClass('user_' + data.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', data.time).html(data.user.name + ' has left the room')));
    
    element.appendTo('#log');
  },
  
  close: function(data, replay){

  },
  
  back: function(data, replay) {
    $("#user_" + data.user.id).css('opacity', 1.0).removeClass('idle');
  },
  
  idle: function(data, replay) {
    $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
  }
}

UserList = {
  add: function(user, replay){
    if (replay) { return }
    
    if ($("#user_" + user.id).length < 1) {
      var presence = $('<li/>')
        .attr("id", "user_" + user.id)
        .attr('user_id', user.id)
        .attr('user_name', user.name)
        .html('<img alt="gary" src="/images/avatar_default.png" /> ' + user.name)
        .appendTo($('#people'));
        
      presence.animate({opacity: 1.0}, 400);
    }
  },
  
  remove: function(user, replay){
    if (replay){ return }
    
    $("#user_" + user.id).animate({opacity: 0.0}, 400, function(){ $(this).remove() });
  }
}