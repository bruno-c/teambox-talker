Talker.Logger = function() {
  var self = this;
  
  self.onMessageReceived = function(data) {
    Receiver.push(data);
  }
}

Talker.plugins.push(new Talker.Logger());

function resizeLogElements(){
  var maxWidth = $('#chat_log').width() - $('#log tr td:first').width() - 41;
  
  $('div pre').css('width', maxWidth);
  
  $('#log img').each(function(){
    $(this).css({width: 'auto'});
    
    if ($(this).width() > maxWidth){
      $(this).css({width: maxWidth + 'px'});
    }
    $(this).css('visibility', 'visible');
  });
}

$(window).ready(resizeLogElements).resize(resizeLogElements);

