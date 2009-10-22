// Handles incoming events, messages, notices and errors
Usher = {
  // for now inserts rows for each user, independently of what happened last
  // eventually it should check the previous messages and insert into proper <p>
  // it should also be smart enough to handle notices and private messages.
  message: function(data){
    var id = data.type;
    
    if (data.type == 'message' && data.partial){
      return; // ignore partial messages for now.  This will be useful for brainstorming mode.
    }
    
    switch(data.type){
      case 'message':
        id += ("_" + data.id);
        break;
      default:
        id += 'event' + Math.uuid();
    }
    
    this.element = $('<tr/>').attr('id', id)
      .append($('<td/>').addClass('author').html((data.user ? data.user.name : 'system')))
      .append($('<td/>').addClass('content').html(data.content ? data.content : data.toString()))

    this.element.insertBefore('#message');
    
    ChatRoom.align();
  },
  
  announce: function(data){
    if ($("#user_" + data.user.id).length < 1) {
      $('<li/>').attr("id", "user_" + data.user.id).
                 html(data.user.name).
                 appendTo($('#people')).
                 highlight();
    }
    
    if (data.type == 'idle'){
      $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
    } else if (data.type == 'back') {
      $("#user_" + data.user.id).css('opacity', 1.0).removeClass('idle');
    }
  },
  
  notice: function(data){
    Usher.message(data);
  }
}