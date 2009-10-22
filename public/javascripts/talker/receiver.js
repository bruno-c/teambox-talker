// 1) Handles incoming events, messages, notices and errors in the browser log.
// 2) Updates list of users in the chat room..
Receiver = {
  // handles all incoming messages in a triage fashion eventually becoming an insertion in the log
  push: function(data) {
    try{
      return Receiver[data.type](data);
    } catch(e){
      console.info(JSON.encode(data));
      console.error("*** Unable to handle data type: (" + data.type + ") with data.  Format may not be appropriate.");
    }
  },
  
  connected: function(data) {
    if ($("#user_" + data.user.id).length < 1) {
      $('<li/>').attr("id", "user_" + data.user.id)
        .html('<img alt="gary" src="/images/avatar_default.png" />' + data.user.name)
        .css('opacity', 0.0)
        .appendTo($('#people'))
        .animate({opacity: 1.0}, 800);
    }
  },
  
  join: function(data) {
    Receiver.connected(data);
  },
  
  leave: function(data) {
    $("#user_" + data.user.id).animate({opacity: 0.0}, 800, function(){ $(this).remove() });
  },
  
  close: function(data){
    console.info("Received close event from server.")
  },
  
  back: function(data) {
    $("#user_" + data.user.id).css('opacity', 1.0).removeClass('idle');
  },
  
  idle: function(data) {
    $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
  },
  
  // for now inserts rows for each user, independently of what happened last
  // eventually it should check the previous messages and insert into proper <p>
  // it should also be smart enough to handle notices and private messages.
  message: function(data) {
    var id = data.type;
    
    if (data.partial){
      console.info("partial: " + data.content);
      return;
    }
    id += ("_" + data.id);
    
    this.element = $('<tr/>')
      .append($('<td/>').addClass('author').html((data.user ? data.user.name : 'system')))
      .append($('<td/>').addClass('content').attr('id', id).html(data.content ? data.content : data.toString()))

    this.element.insertBefore('#message');
  }
}