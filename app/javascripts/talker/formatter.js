var FormatHelper = {
  text2html: function(content, noScroll){
    var image_expression     = /(^https?:\/\/[^\s]+\.(?:gif|png|jpeg|jpg)$)/gi;
    var youtube_expression   = /^(?:http\S+youtube\.com\/watch\?v=)([\w-]+)(?:\S*)$/;
    var vimeo_expression     = /^(?:http\S+vimeo\.com\/)(\d+)/;
    var url_expression       = /(https?:\/\/|www\.)[^\s<]*/gi
    var protocol_expression  = /^(http|https|ftp|ftps|ssh|irc|mms|file|about|mailto|xmpp):\/\//;
    var multiline_expression = /\n/gim;

    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  
  timestamp2date: function(timestamp){
    if (timestamp) return new Date(timestamp * 1000);
    return null;
  },
  
  getUrlDate: function(timestamp){
    var d = FormatHelper.timestamp2date(timestamp);
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/');
  },
  
  getMonth: function(timestamp){
    var months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    return months[FormatHelper.timestamp2date(timestamp).getMonth()];
  },
  
  getDate: function(timestamp){
    return FormatHelper.timestamp2date(timestamp).getDate();
  },
  
  toHumanDate: function(timestamp) {
    var date = FormatHelper.timestamp2date(timestamp);
    var months = 'January February March April May June July August September October November December'.split(' ');
    var minutes = date.getMinutes() - date.getMinutes() % 5;
    
    return months[date.getMonth()] + '&nbsp;' 
      + date.getDate() + ',&nbsp;'
      + date.getFullYear();
  },
  
  toHumanTime: function(timestamp) {
    var date = FormatHelper.timestamp2date(timestamp);
    var minutes = date.getMinutes() - date.getMinutes() % 5;
    
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      + (minutes < 10 ? '0' + minutes : minutes)
  }
}

Number.prototype.toOrdinal = function(){
  var n = this % 100, s = 'th st nd rd th'.split(' ');
  return this + (n < 21 ? (n < 4 ? s[n] : s[0]): (n % 10 > 4 ? s[0] : s[n % 10]));
}
