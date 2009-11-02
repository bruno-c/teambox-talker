Talker.Sender = function(msgbox) {
  var self = this;
  
  self.msgbox = msgbox;
  
  function sendMessage() {
    Talker.client.send({content: self.msgbox.val(), type: 'message'});
    self.msgbox.val('');
  }
  
  self.onMessageSend = function(event) {
    var presences = [];
    var users = {};
    
    $('#people li').each(function(){
      presences.push($(this).attr('user_name'));
      users[$(this).attr('user_name')] = $(this).attr('user_id');
    })

    var reg_user_list = new RegExp("\/msg (" + presences.join('|') + ") (.+)")
    var match = reg_user_list.exec(self.msgbox.val());
    
    if (self.msgbox.val().indexOf('/msg') == 0 && match){
      Talker.client.send({content: match[2], to: users[match[1]]});
      $("#msgbox").val('');
    } else if (self.msgbox.val().indexOf('/msg') == 0) {
      var msgbox = self.msgbox.get(0);
      if (msgbox){
        setCaretTo(msgbox, 5);
        insertAtCaret(msgbox, "unrecognizable user name ");
        setCaretTo(msgbox, 5, 29);
      }
    } else if (self.msgbox.val().indexOf('/') == 0){
      var msgbox = self.msgbox.get(0);
      if (msgbox){
        setCaretTo(msgbox, 1);
        insertAtCaret(msgbox, "unrecognizable command ");
        setCaretTo(msgbox, 1, 23);
      }
    } else {
      sendMessage();
    }
    
    Talker.trigger("MessageSent", event);
  }
}

function insertAtCaret(obj, text) {
  if(document.selection) {
    obj.focus();
    var orig = obj.value.replace(/\r\n/g, "\n");
    var range = document.selection.createRange();

    if(range.parentElement() != obj) {
      return false;
    }

    range.text = text;
    
    var actual = tmp = obj.value.replace(/\r\n/g, "\n");

    for(var diff = 0; diff < orig.length; diff++) {
      if(orig.charAt(diff) != actual.charAt(diff)) break;
    }

    for(var index = 0, start = 0; 
      tmp.match(text) 
        && (tmp = tmp.replace(text, "")) 
        && index <= diff; 
      index = start + text.length
    ) {
      start = actual.indexOf(text, index);
    }
  } else if(obj.selectionStart) {
    var start = obj.selectionStart;
    var end   = obj.selectionEnd;

    obj.value = obj.value.substr(0, start) 
      + text 
      + obj.value.substr(end, obj.value.length);
  }
  
  if(start != null) {
    setCaretTo(obj, start + text.length);
  } else {
    obj.value += text;
  }
}

function setCaretTo(obj, start, end) {
  if(obj.createTextRange) {
    var range = obj.createTextRange();
    range.moveStart('character', start);
    range.moveEnd('character',   (end || start));
    range.select();
  } else if(obj.selectionStart) {
    obj.focus();
    obj.setSelectionRange(start, (end || start));
  }
}