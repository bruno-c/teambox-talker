Talker.ReceivedSound = function() {
  var plugin = this;
  
  plugin.command = 'togglesound';
  plugin.usage = '/togglesound';
  
  plugin.onCommand = function(talkerEvent) {
    if (talkerEvent.command == plugin.command) {
      $.cookie('ReceivedSound', $.cookie('ReceivedSound') == 'false' ? 'true' : 'false');
      alert($.cookie('ReceivedSound') == 'true' ? "Audio alerts are now enabled." : "Audio alerts are now disabled.");
      $('#msgbox').val('');
      return false;
    }
  }
  
  plugin.onLoaded = function() {
    if ($.cookie('ReceivedSound') != 'true') {
      $.cookie('ReceivedSound', 'false');
    }
    
    $(document.body).append($('<audio/>').attr('src', '/sounds/borealis/message_received.wav')); // preloads for faster play on first message.
      
    plugin.onMessageReceived = function(talkerEvent) {
      if (talkerEvent.user.id != Talker.currentUser.id && $.cookie('ReceivedSound') == 'true') {
        $(document.body).append(
          $('<audio/>').attr('src', '/sounds/borealis/message_received.wav').attr('autoplay', 'true').bind('ended', function(){ $(this).remove() })
        );
      }
    }
  }
}