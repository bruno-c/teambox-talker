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