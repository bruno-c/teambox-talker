Talker.ErrorHandler = function(element) {
  var self = this;
  
  self.onOpen =
  self.onConnected = function() {
    element.hide().html("");
  }
  
  self.onClose = function() {
    element.show().html(
      $("<p/>").html("Connection lost with the chat server, trying to reconnect ...")
    );
  }
  
  self.onError = function(event) {
    alert(event.message);
    location.pathname = "/rooms";
  }
}