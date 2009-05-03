function Connection(room, user, onReceive) {
  // Private property
  var socket = jsSocket({
    port: 1234,
    debug: true,
    keepalive: function() {
      this.send({ type: 'ping', room_id: room })
    },
    onData: onReceive,
    onOpen: function() {
      this.send({ type: 'open', room_id: room })
    },
    onClose: function() {
      this.send({ type: 'close', room_id: room })
    }
  });
  
  return {
    // Public property
    send: function(message) {
      socket.send({
        type: "message",
        message: message,
        room: room,
        user: user
      });
    }
  };
}