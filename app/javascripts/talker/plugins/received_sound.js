Talker.ReceivedSound = function() {
  var self = this;
  
  self.command = 'togglesound';
  self.usage = '/togglesound';
  
  self.onCommand = function(talkerEvent) {
    if (talkerEvent.command == self.command) {
      $.cookie('ReceivedSound', ($.cookie('ReceivedSound') == 'false' ? 'true' : 'false'), {
        expires: (function(){ var d = new Date(); d.setTime(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000); return d })() // 10 years from now
      });
      // No longer used since there's a button to nofity the user
      //alert($.cookie('ReceivedSound') == 'true' ? "Audio alerts are now enabled." : "Audio alerts are now disabled.");
      Talker.getMessageBox().val('');

      $('#toggle_sound').attr('class', $.cookie('ReceivedSound') == 'true' ? 'active' : 'inactive');

      return false;
    }
  }
  
  self.onLoaded = function() {
    if ($.cookie('ReceivedSound') != 'false') {
      $.cookie('ReceivedSound', 'true', {
        expires: (function(){ var d = new Date(); d.setTime(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000); return d })() // 10 years from now
      });
    }
    
    self.loaded = true;
    
    $(document.body).append($('<audio/>').attr('src', '/sounds/borealis/message_received.wav')); // preloads for faster play on first message.
    var toggleButton = $("<span id='toggle_sound'><span class='sound_img'/></span>");
    $('#message_form').prepend(toggleButton);
    toggleButton.attr('class', $.cookie('ReceivedSound') == 'true' ? 'active' : 'inactive');
    toggleButton.click(function(){
      Talker.trigger("Command", {type: "command", command: 'togglesound'});
    });
  }
  
  self.onBlur = function() {
    self.onMessageReceived = function(talkerEvent) {
      if (self.loaded && talkerEvent.user.id != Talker.currentUser.id && $.cookie('ReceivedSound') == 'true') {
        $(document.body).append(
          $('<audio/>').attr('src', '/sounds/borealis/message_received.wav').attr('autoplay', 'true').bind('ended', function(){ $(this).remove() })
        );
      }
    }
  }
  
  self.onFocus = function() {
    self.onMessageReceived = function(){};
  }
}
