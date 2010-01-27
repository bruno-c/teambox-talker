// Hide loading message once we're connected.
Talker.Loading = function() {
  var plugin = this;
  
  plugin.onConnected = function(event) {
    $("#curtain, #loading").fadeOut("normal", function() { $(this).remove() });
  };
};