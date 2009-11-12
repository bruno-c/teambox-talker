Talker.Logger = {
  lastRow: function(){
    return $('#log tr:last');
  }, 
  
  lastAuthor: function(){
    return Talker.Logger.lastRow().attr('author');
  },
  
  maximumContentWidth: function() {
    return $('#chat_log').width() - $('#log tr td:first').width() - 41;
  }
}
