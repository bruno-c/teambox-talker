function Chat() {
  function scrollToBottom() {
    window.scrollTo(0, document.body.clientHeight);
  };
  
  $(document).ready(function() {
    scrollToBottom();

    $("#msgbox").
      keydown(function(event) {
        if (event.which == 13) {
          $("#msgForm").trigger("submit")[0].reset();
          return false;
        }
      }).
      focus();
    
    $("#msgForm").submitWithAjax(function() {
      $("#msgForm")[0].reset();
      $("#msgForm")[0].focus();
    });
  });
  
  return {
    log: function(id, html) {
      var events = $("#log").find(".event");
      for (var i = events.length - 1; i >= 0; i--) {
        var message = events[i];
        var messageId = parseInt(message.id.match(/message_(\d+)/)[1]);
        // message already there
        if (messageId == id) return;
        // message is older, insert before
        if (messageId < id) {
          $(message).after(html);
          scrollToBottom();
          return;
        };
      };
      // should never get here, but just in case...
      $("#log").append(html);
      scrollToBottom();
    },
    
    join: function(userId, html) {
      if ($("#user_" + userId).length > 0) $("#users").append(html);
    },

    leave: function(userId, html) {
      $("#user_" + userId).remove();
    },
  }
}
