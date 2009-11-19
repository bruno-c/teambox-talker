Talker.HighlightMe = function(){
  var plugin = this;
  
  plugin.onMessageInsertion = function(event) {
    var me = Talker.currentUser.name;
    var blocks = $("blockquote:contains('" + me + "')").add("blockquote:contains('" + me.toLowerCase() + "')");
  
    blocks.css({
      '-moz-box-shadow': '0 0 10px #FF0',
      '-webkit-box-shadow': '0 0 10px #FF0'
    });    
  }
}