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
      // console.info(JSON.encode(data, replay));
      // console.error("*** Unable to handle data type: (" + data.type + ") with data.  Format may not be appropriate.");
    }
  },
  
  connected: function(data, replay) {
    $('#msgbox').focus();
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
