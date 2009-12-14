var FormatHelper = {
  timestamp2date: function(timestamp){
    if (timestamp) return new Date(timestamp * 1000);
    return null;
  },
  
  getUrlDate: function(timestamp){
    var d = FormatHelper.timestamp2date(timestamp);
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/')
  },
  
  getMonth: function(timestamp){
    var months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    return months[FormatHelper.timestamp2date(timestamp).getMonth()];
  },
  
  getDate: function(timestamp){
    return FormatHelper.timestamp2date(timestamp).getDate();
  },

  toHumanTime: function(timestamp) {
    var date = FormatHelper.timestamp2date(timestamp);
    var minutes = date.getMinutes() - date.getMinutes() % 5;
    
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      + (minutes < 10 ? '0' + minutes : minutes)
  },
  
  formatDate: function(timestamp) {
    var d = new Date(timestamp * 1000);
    d = new Date();
    return dateFormat(d, "mediumDate") + " " + dateFormat(d, "shortTime");
  }
}

function truncate(str, size) {
  size = size || 50;
  return str.substring(0, size) + (str.length > size ? "..." : "");
}