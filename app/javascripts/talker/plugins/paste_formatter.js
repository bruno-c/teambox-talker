Talker.PasteFormatter = function() {
  var self = this;
  
  self.onFormatMessage = function(event){
    if (event.paste){
      event.complete(
        "<a target='_blank' title='Paste #" + event.paste.id + "' href='" 
          + window.location.protocol + "//" + window.location.host + "/pastes/" + event.paste.id 
          + "'>View paste</a>"
          + ((event.paste.lines > event.paste.preview_lines) 
            ? " <span class='more_lines'>(" + (event.paste.lines - event.paste.preview_lines) + " more lines)</span>"
            : "")
          + '<pre style="width: ' + getMaximumContentWidth() + 'px;">'
          +  event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          + '</pre>'
      );
      return false;
    }
  }
};