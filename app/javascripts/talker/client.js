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
    
    switch(line.type){
      case 'message':
        callbacks.onMessageReceived(line);
        break;
      case 'join':
        callbacks.onJoin(line);
        break;
      case 'users':
        callbacks.onUsers(line);
        break;
      case 'leave':
        callbacks.onLeave(line);
        break;
      case 'error':
        callbacks.onError(line);
        break;
      case 'back':
        callbacks.onBack(line);
        break;
      case 'idle':
        callbacks.onIdle(line);
        break;
      case 'connected':
        callbacks.onConnected(line);
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
          token: options.token,
          last_event_id: options.lastEventId
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
