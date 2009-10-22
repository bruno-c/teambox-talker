// 1) positions new messages within a table in the correct order.
// 2) announces in the user list who is present and who isn't.
Usher = {
  
  // for now inserts rows for each user, independently of what happened last
  // eventually it should check the previous messages and insert into proper <p>
  // it should also be smart enough to handle notices and private messages.
  message: function(data){
    console.info(data);
    
    var id = data.type;
    
    if (data.type == 'message' && data.final == false){ return }
    switch(data.type){
      case 'message':
        id += ("_" + data.id);
        break;
      default:
        id += Math.uuid();
    }
    
    this.element = $('<tr/>').attr('id', id)
      .append('<td/>').addClass('author').html((data.user ? data.user.name : 'system'))
      .append('<td/>').addClass('content').html(data.content ? data.content : data.toString())
      .insertBefore($('#message'))
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
    // var msg_content = '';
    // switch(data.type){
    //   case 'join': 
    //   case 'leave':
    //     msg_content = data.type + 's';
    //     break
    //   default:
    //     msg_content = data.type;
    //     break;
    // }
    // 
    // var element = $("<tr/>").
    //   addClass("event").
    //   addClass("notice").
    //   append($("<td/>").addClass("author").html(data.user.name)).
    //   append($("<td/>").addClass("content").html(msg_content));
    // 
    // if (ChatRoom.typing()){
    //   element.appendTo("#log");
    // } else {
    //   element.insertBefore("#message");
    // }
    // 
    // ChatRoom.scrollToBottom();
  }
}