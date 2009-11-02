function focusMsgBox() {
  var msgbox = document.getElementById('msgbox'); // old school
  if (msgbox){
    var position = msgbox.value.length;
    setCaretTo(msgbox, position);
    document.getElementById('msgbox').focus();
  }
};

$(function() {
  $('#msgbox')
    .keydown(function(e){
      if (e.which == 13){ // enter
        if (this.value == '') {
          return false;
        } else { // we actually have a message
          Talker.trigger("MessageSend", {type:"message", content:$("#msgbox").val()})
          return false;
        }
      } else if (e.which == 27 || e.which == 8 && this.value.length == 1){// esc or backspace on last character
        $('#msgbox').val('');
      }
    })
    .focus(function(e){
      e.stopPropagation();
    })
  
  $(window).keydown(function(e){
    switch (e.which){
      case 224: // Cmd in FF
      case 91:  // Cmd in Safari
      case 67:  // Cmd+c Ctrl+c
      case 17:  // Ctrl
        break;
      case 13:  // enter
        focusMsgBox();
        e.preventDefault();
        break;
      default:
        focusMsgBox();
        break;
    }
  });
  $('input.search, #edit_room form input, #edit_room form textarea').keydown(function(e){
    e.stopPropagation()
  });
});
