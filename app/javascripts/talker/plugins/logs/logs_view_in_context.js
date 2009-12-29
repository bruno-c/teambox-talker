Talker.LogsViewInContext = function(){
  var self = this;
  
  self.onMessageInsertion = function(event){
    console.info(event);
    var last_row = Talker.getLastRow();
    var last_div = $(last_row).find('div:last');
    
    var room = event.room.id;
    var id = event.id;
    
    last_div.prepend(
      $("<a/>").addClass('log')
        .attr("href", "/rooms/" + room + "/logs/" + FormatHelper.getUrlDate(event.time) + "#event_" + id)
        .text("View in context")
    );
  }
}