Talker.YoutubeFormatter = function() {
  var self = this;
  
  self.onMessageReceived = function(event){
    var youtube_expression = /^(?:http\S+youtube\.com\/watch\?v=)([\w-]+)(?:\S*)$/;
    var youtube_match  = event.content.match(youtube_expression);
    
    if (youtube_match){
      Talker.insertMessage(event,
        '<object width="425" height="355" style="z-index: 1;">'
        + '<param name="movie" value="http://www.youtube.com/v/' + youtube_match[1] + '&fs=1"></param>'
        + '<param name="allowFullScreen" value="true"></param>'
        + '<param name="wmode" value="transparent">'
        + '<embed src="http://www.youtube.com/v/' + youtube_match[1] + '&fs=1"'
        + ' type="application/x-shockwave-flash"'
        + '  width="425" height="355" '
        + '  allowfullscreen="true" wmode="transparent"></embed>'
        + '</object>'
      );
      return false;
    }
  }
};