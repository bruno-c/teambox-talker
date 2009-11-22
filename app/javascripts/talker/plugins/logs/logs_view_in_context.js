Talker.LogsViewInContext = function(){
  var self = this;
  
  self.onMessageInsertion = function(event){
    var last_row = Talker.getLastRow();
    var last_p = $(last_row).find('p:last');
    
    var room = event.room.id;
    var id = event.id;
    
    last_p.prepend(
      $("<a/>").addClass('log')
        .attr("href", "/rooms/" + room + "/logs/" + FormatHelper.getUrlDate(time) + "#event_" + id)
        .text("View in context")
    );
  }
}