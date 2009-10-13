var FormatHelper = {
  text2html: function(content){
    var image_expression     = /(^https?:\/\/[^\s]+\.(?:gif|png|jpeg|jpg)$)/gi;
    var youtube_expression   = /^(?:http\S+youtube\.com\/watch\?v=)([\w-]+)(?:\S*)$/;
    var vimeo_expression     = /^(?:http\S+vimeo\.com\/)(\d+)/;
    var url_expression       = /[^\s]+\.[^\s|\.]+/gim;
    var protocol_expression  = /^(http|https|ftp|ftps|ssh|irc|mms|file|about|mailto|xmpp):\/\//;
    var multiline_expression = /\n/gim;
    
    var content = content.replace('<', '&lt;').replace('>', '&gt;');
    
    if (content.match(multiline_expression)){
      // setup content message inside a div or something with overflow scroll/auto
      return  '<pre style="display: block; margin:' 
            + ' 1em; font-family: \'Lucida Console\', monospace; overflow: scroll; height: 85px; width: 50%; background: white">' 
            + content 
            + '</pre>';
      // add a link to a message display that would show the message in raw text
    } else if (content.match(image_expression)){
      return content.replace(image_expression, function(locator){
        return '<a href="' 
          + locator 
          + '" target="_blank"><img src="' 
          + locator 
          + '" onload="ChatRoom.resizeImage(this, true)" style="visibility: hidden;" />'
          + '</a>';
      });
    } else if (content.match(youtube_expression)){
      return content.replace(youtube_expression, function(locator){
        return locator.replace(youtube_expression, '<object width="425" height="355">'
          + '<param name="movie" value="http://www.youtube.com/v/$1?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=0&fs=1"></param>'
          + '<param name="allowFullScreen" value="true"></param>'
          + '<embed src="http://www.youtube.com/v/$1?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=1&fs=1"'
          + ' type="application/x-shockwave-flash"'
          + '  width="425" height="355" '
          + '  allowfullscreen="true"></embed>'
          + '</object>');
      });
    } else if (content.match(vimeo_expression)){
      return content.replace(vimeo_expression, function(locator){
        return locator.replace(vimeo_expression, '<object width="400" height="220">'
          + '<param name="allowfullscreen" value="true" />'
          + '<param name="allowscriptaccess" value="always" />'
          + '<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=$1'
          + '&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1" />'
          + '<embed src="http://vimeo.com/moogaloop.swf?clip_id=$1&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;'
          + 'show_portrait=0&amp;color=&amp;fullscreen=1" '
          + 'type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="400" height="220">'
          + '</embed></object>'
        );
      });
    } else if (content.match(url_expression)) {
      return content.replace(url_expression, function(locator){
        return '<a href="' 
          +  (!locator.match(protocol_expression) ? 'http://' : '') + locator
          + '" target="_blank">' 
          +   locator 
          + "</a>";
      });
    } else {
      return content;
    }
  }
}