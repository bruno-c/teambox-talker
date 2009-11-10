Talker.PasteFormatter = function() {
  var self = this;
  
  self.onMessageReceived = function(event) {
    if (event.paste){
      Talker.Logger.insertContent(event,
        "<a target='_blank' title='Paste #" + event.paste.id + "' href='" 
          + window.location.protocol + "//" + window.location.host + "/pastes/" + event.paste.id 
          + "'>View paste</a>"
          + ((event.paste.lines > event.paste.preview_lines) 
            ? " <span class='more_lines'>(" + (event.paste.lines - event.paste.preview_lines) + " more lines)</span>"
            : "")
          + '<div><pre style="width: ' + Talker.Logger.maximumContentWidth() + 'px;">'
          +  event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          + '</pre></div>'
      );
      return false;
    }
  }
  
  // resizer is in default formatter
};