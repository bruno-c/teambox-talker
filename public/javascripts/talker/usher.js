// 1) Handles incoming events, messages, notices and errors in the browser log.
// 2) Updates list of users in the chat room..
Usher = {
  // handles all incoming messages in a triage fashion eventually becoming an insertion in the log
  push: function(data){
    try{
      return Usher[data.type](data);
    } catch(e){
      console.info(data);
      throw "Unable to handle data" + data.toString()
    }
  },
  
  connected: function(data){
    if ($("#user_" + data.user.id).length < 1) {
      $('<li/>').attr("id", "user_" + data.user.id).
                 html(data.user.name).
                 appendTo($('#people')).
                 highlight();
    }
  },
  
  join: function(data){
    
  },
  
  back: function(data){
    $("#user_" + data.user.id).css('opacity', 1.0).removeClass('idle');
  },
  
  idle: function(data){
    $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
  },
  
  // for now inserts rows for each user, independently of what happened last
  // eventually it should check the previous messages and insert into proper <p>
  // it should also be smart enough to handle notices and private messages.
  message: function(data){
    var id = data.type;
    
    if (data.partial){
      return;
    }
    id += ("_" + data.id);
    
    this.element = $('<tr/>')
      .append($('<td/>').addClass('author').html((data.user ? data.user.name : 'system')))
      .append($('<td/>').addClass('content').attr('id', id).html(data.content ? data.content : data.toString()))

    this.element.insertBefore('#message');
  }
}