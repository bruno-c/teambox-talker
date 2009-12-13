Talker.YoutubeFormatter = function() {
  var self = this;
  
  self.onMessageReceived = function(event){
    var youtube_expression = /^(?:http\S+youtube\.com\/watch\?v=)([\w-]+)(?:\S*)$/;
    var youtube_match  = event.content.match(youtube_expression);
    
    if (youtube_match){
      var color = (event.user.id == Talker.currentUser.id ? '&color1=0xD8CCBC&color2=0xFAEEDE' : '&color1=0xBBCCC6&color2=0xDDEFF8');
      Talker.insertMessage(event,
        '<object width="425" height="355" style="z-index: 1;">'
        + '<param name="movie" value="http://www.youtube.com/v/' + youtube_match[1] + '&egm=1&rel=0&fs=1' + color + '"></param>'
        + '<param name="allowFullScreen" value="true"></param>'
        + '<param name="wmode" value="transparent">'
        + '<embed src="http://www.youtube.com/v/' + youtube_match[1] + '&egm=1&rel=0&fs=1' + color + '"'
        + ' type="application/x-shockwave-flash"'
        + '  width="425" height="355" '
        + '  allowfullscreen="true" wmode="transparent"></embed>'
        + '</object>'
      );
      return false;
    }
  }
};