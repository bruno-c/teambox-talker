// this formatter is always called when others aren't called first.
Talker.DefaultFormatter = function() {
  var self = this;
  
  self.onMessageReceived = function(event) {
    var url_expression = /(https?:\/\/|www\.)[^\s<]*/gi;
    var protocol_expression  = /^(http|https|ftp|ftps|ssh|irc|mms|file|about|mailto|xmpp):\/\//;
    
    var content = event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    if (content.match(url_expression)){
      Talker.insertMessage(event, content.replace(url_expression, function(locator){
        return '<a href="' 
          +  (!locator.match(protocol_expression) ? 'http://' : '') + locator
          + '" target="_blank">' 
          +   locator 
          + "</a>";
      }));
    } else if (event.content.match(/\n/gim)){
      Talker.insertMessage(event, '<div><pre>' + content + '</pre></div>');
    } else {
      Talker.insertMessage(event, content);
    }
  }
  
  self.onResize = function(event) {
    var maxWidth = Talker.getMaxContentWidth();
    
    $('#log pre').css('width', maxWidth - 22 + 'px');// pastes and messages sent with multilines
    $('#log blockquote').css('width', maxWidth + 'px');// long sentences with no line breaks
  }
};