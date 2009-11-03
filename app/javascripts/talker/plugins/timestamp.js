Talker.Timestamp = function(reverse) {
  var self = this;
  var interval = 5 * 60;
  var lastTime = null;

  // reverse = true if events are shown newest first, like in search results
  reverse = (reverse === true ? -1 : 1);
  
  self.onJoin = 
  self.onLeave = 
  self.onMessageReceived = function(event) {
    if (lastTime == null || (lastTime - event.time) * reverse < -interval) {
      addToLog(event.time, lastTime);
    }
    lastTime = event.time;
  }
  
  function addToLog(time, lastTime) {
    var element = $('<tr/>').addClass('timestamp');
    
    var date = FormatHelper.timestamp2date(time);
    var lastDate = FormatHelper.timestamp2date(lastTime);
    
    // Only show date if diff from last one
    if (lastDate == null || (date.getFullYear() != lastDate.getFullYear() ||
                             date.getMonth() != lastDate.getMonth() ||
                             date.getDate() != lastDate.getDate())
        ) {
      element
        .append($('<td/>').addClass('date')
          .append($('<div/>')
            .append($('<span/>').addClass('marker').html(
              '<b><!----></b><i><span class="date">' 
                + FormatHelper.getDate(time)
              + '</span><span class="month">'
                + FormatHelper.getMonth(time)
              + '</span></i>')
            )
          )
        );
    } else {
      element.append($('<td/>'));
    }
    
    element
      .append($('<td/>').addClass('time')
        .append($('<div/>')
          .append($('<span/>').addClass('marker').attr('time', time)
            .html('<b><!----></b><i>' + FormatHelper.toHumanTime(time) + '</i>')
          )
        )
      );
    
    element.appendTo('#log');
  }
}
