// this formatter is always called when others aren't called first.
Talker.DefaultFormatter = function() {
  var self = this;
  
  self.onFormatMessage = function(event){
    console.info("Inside DefaultFormatter.onFormatMessage");
    if (event.content.match(/\n/gim)){
      event.complete('<div><pre>' + event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre></div>');
    } else {
      event.complete(event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    }
  }
};