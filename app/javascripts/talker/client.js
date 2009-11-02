// Talker client
// Based on STOMP client shipped with Orbited.
Talker.Client = function(options) {
  var log = getTalkerLogger("TalkerClient");
  var self = this;
  var protocol = null;
  var buffer = "";
  var remainingBodyLength = null;
  self.options = options;

  // LineProtocol implementation.
  function onLineReceived(line) {
    try {
      var line = eval('(' + line + ')');
    } catch (SyntaxError) {
      return;
    }
    
    console.debug(line);
    
    // ugly shit but this will be refactored.
    switch(line.type){
      case 'message':
        options.callbacks.onMessageReceived(line);
        break;
      case 'join':
        options.callbacks.onJoin(line);
        break;
      case 'users':
        options.callbacks.onUsers(line);
        break;
      case 'leave':
        options.callbacks.onLeave(line);
        break;
      case 'error':
        options.callbacks.onError(line);
        break;
      case 'back':
        options.callbacks.onBack(line);
        break;
      case 'idle':
        options.callbacks.onIdle(line);
        break;
      case 'connected':
        options.callbacks.onConnected(line);
        break;
      default:
        console.warn("Unknown message type(client error): " + line.type);
    } 
  }
  
  function onRawDataReceived(data) {
    // console.info("TalkerClient::received raw: " + data);
  }
  
  self.resetPing = function() {
    if (self.pingInterval) clearInterval(self.pingInterval);
    self.pingInterval = setInterval(function(){
      self.ping();
    }, 5000);
  };
  
  self.ping = function(){
    if (self.reconnect){
      location.reload();
    }else{
      protocol.send(JSON.encode({type: 'ping'}));
    }
  };
  
  // Methods
  self.sendData = function(message) {
    // console.info(message);
    protocol.send(JSON.encode(message));
    self.resetPing();
  };

  self.connect = function() {
    protocol = new LineProtocol(new TCPSocket());
    protocol.onopen = function() {
      self.sendData({
        type: "connect", 
        room: self.options.room, 
        user: self.options.user, 
        token: self.options.token,
        sid: self.options.sid,
        include_partial: true
      });
    }
    // XXX even though we are connecting to onclose, this never gets fired
    //     after we shutdown orbited.
    protocol.onclose = function() {
      self.reconnect = true;
      options.callbacks.onClose();
    }
    // TODO what should we do when there is a protocol error?
    protocol.onerror = function(error) { console.error(error); }
    protocol.onlinereceived = onLineReceived;
    protocol.onrawdatareceived = onRawDataReceived;
    protocol.open(self.options.host, self.options.port, false);
    return self;
  };

  self.close = function() {
    self.sendData({type: "close"});
  };
  self.reset = function() {
    protocol.reset();
  }
  self.send = function(message) {
    message.type = "message";
    self.sendData(message);
  };
}
