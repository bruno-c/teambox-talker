Talker.HighlightMe = function(){
  var plugin = this;
  
  plugin.onMessageInsertion = function(event) {
    var me = new RegExp("\\b" + Talker.currentUser.name + "\\b", 'gi');
    
    var blocks = $("blockquote").each(function(){
      if ($(this).html().replace(/<\/?[^>]+>/gi, ' ').match(me)) {
        $(this).css({
          '-moz-box-shadow': '0 0 10px yellow',
          '-webkit-box-shadow': '0 0 10px yellow'
        });
      }
    });
  }
}