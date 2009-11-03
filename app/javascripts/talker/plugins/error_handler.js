Talker.ErrorHandler = function() {
  var self = this;
  
  self.onOpen =
  self.onConnected = function() {
    $("#error").hide().html("");
  }
  
  self.onClose = function() {
    $("#error").show().html(
      $("<p/>").html("Connection lost with the chat server, trying to reconnect ...")
    );
  }
  
  self.onError = function(event) {
    $("#error").show().html(
      $("<p/>").html(event.message)
    );
  }
}