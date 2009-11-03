// this formatter is always called when others aren't called first.
Talker.DefaultFormatter = function() {
  var self = this;
  
  self.onFormatMessage = function(event){
    if (event.content.match(/\n/gim)){
      $(event.target).html('<div><pre>' + event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre></div>');
    } else {
      $(event.target).html(event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    }
    event.complete();
  }
};