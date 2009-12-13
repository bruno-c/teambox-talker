function focusMsgBox() {
  var msgbox = $('#msgbox')[0];
  if (msgbox){
    $('#msgbox').setCaretPosition(-1);
    msgbox.focus();
    return true;
  }
  return false;
};

$(function() {
  $('#send').click(function(e) {
    if ($('#msgbox').val().length){
      Talker.trigger("MessageSend", {type:"message", content: $("#msgbox").val()});
    }
    e.preventDefault();
  });
  $('#msgbox')
    .keydown(function(e){
      switch (e.which){
        case 33:
        case 34:
          break;
        case 13: // enter
          if (e.shiftKey) return; // line break
          if (this.value == '') return false; // ignore empty messages
          
          // we actually have a message
          Talker.trigger("MessageSend", {type:"message", content: $("#msgbox").val()});
          return false;
          break;
          
        case 27: // esc
          $('#msgbox').focus().val('');
          $(document).trigger('close.facebox');
          break;
      }
    });
  
  $(window).keydown(function(e){
    switch (e.which){
      case 224: // Cmd in FF
      case 91:  // Cmd in Safari
      case 67:  // Cmd+c Ctrl+c
      case 17:  // Ctrl
      case 33:  // PageUp 
      case 34:  // PageDown
        break;
      case 13:  // enter
        if (focusMsgBox()){
          e.preventDefault();
        }
        break;
      default:
        focusMsgBox();
        break;
    }
  });
  
  $('#msgbox, input.search, #edit_room form input, #edit_room form textarea').keydown(function(e){
    if (e.which == 33 || e.which == 34){
      return;
    } else {
      e.stopPropagation();
    }
  });
  
  $(window).resize(function(){ Talker.trigger('Resize') });
  
  Talker.trigger('Resize');
});
