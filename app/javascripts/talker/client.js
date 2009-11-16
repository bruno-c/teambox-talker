// Talker client
// Based on STOMP client shipped with Orbited.
Talker.Client = function(options) {
  var self = this;
  var callbacks = options.callbacks;
  var protocol = null;
  var pingTimer = null;
  var pingInterval = 10000;
  var reconnectInterval = 2000;
  var reconnect = true;

  // LineProtocol implementation.
  function onLineReceived(line) {
    try {
      var line = eval('(' + line + ')');
    } catch (SyntaxError) {
      // Ignoring invalid JSON
      return;
    }
    
    console.debug(line);
    
    // ugly shit but this will be refactored.
    switch(line.type){
      case 'message':
        Talker.trigger('MessageReceived', line);
        break;
      case 'join':
      case 'users':
      case 'leave':
      case 'error':
      case 'back':
      case 'idle':
      case 'connected':
        Talker.trigger(line.type.charAt(0).toUpperCase() + line.type.substring(1, line.type.length), line)
        break;
      default:
        console.warn("Unknown message type (client error): " + line.type);
    } 
  }
  
  self.resetPing = function() {
    self.stopPing();
    pingTimer = setInterval(function(){ self.ping(); }, pingInterval);
  };
  
  self.stopPing = function() {
    if (pingTimer) clearInterval(pingTimer);
  };
  
  self.ping = function(){
    protocol.send(JSON.encode({type: 'ping'}));
  };
  
  self.sendData = function(message) {
    protocol.send(JSON.encode(message));
  };
  
  self.connect = function() {
    try {
      $("iframe[src*='xsdrBridge.html']").remove();
      protocol = new LineProtocol(new TCPSocket());
      
      protocol.onopen = function() {
        self.sendData({
          type: "connect", 
          room: options.room, 
          token: options.token
        });
        callbacks.onOpen();
        self.resetPing();
      }
    
      protocol.onclose = function() {
        self.stopPing();
        callbacks.onClose();
        self.reconnect();
      }
      
      protocol.onerror = function(error) {
        self.stopPing();
        callbacks.onError({message: error});
        self.reconnect();
      }
    
      protocol.onlinereceived = onLineReceived;
      protocol.open(options.host, options.port, false);
    } catch (e) {
      self.reconnect();
    }
    
    return self;
  };
  
  self.reconnect = function() {
    if (reconnect) {
      setTimeout(function() { self.connect() }, reconnectInterval);
    }
  };
  
  self.close = function(callback) {
    reconnect = false;
    if (callback) callbacks.onClose = callback;
    self.sendData({type: "close"});
  };
  
  self.reset = function() {
    callbacks.onClose = function() {};
    protocol.reset();
  };
  
  self.send = function(message) {
    message.type = "message";
    self.sendData(message);
  };
}
