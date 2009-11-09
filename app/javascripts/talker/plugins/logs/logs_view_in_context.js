Talker.LogsViewInContext = function(){
  var self = this;
  
  self.onAfterMessageReceived = function(event){
    var last_row = Talker.Logger.lastRow();
    var last_p = $(last_row).find('p:last');
    
    var room = last_p.attr('room');
    var time = last_p.attr('time');
    
    last_p.prepend(
      $("<a/>").addClass('log')
        .attr("href", "/rooms/" + room + "/logs/" + FormatHelper.getUrlDate(time) + "#event_" + time)
        .text("View in context")
    );
  }
}