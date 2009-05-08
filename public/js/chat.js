function Connection(room, user, onReceive) {
  // Private property
  var socket = jsSocket({
    port: 1234,
    debug: true,
    keepalive: function() {
      this.send({ type: 'ping', room: room })
    },
    onData: function(m) {
      onReceive(JSONstring.toObject(m))
    },
    onOpen: function() {
      this.send({ type: 'open', room: room })
    },
    onClose: function() {
      this.send({ type: 'close', room: room })
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

function DrawingBoard(canvas, color) {
  var context = canvas[0].getContext('2d');
  var started = false;
  var drawing = {};
  var drawCallback = function(d) {};
  
  canvas.mousedown(function(e) {
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(e.clientX, e.clientY);
    started = true;
    drawing.x1 = e.clientX;
    drawing.y1 = e.clientY;
    drawing.color = color;
  });

  canvas.mousemove(function(e) {
    if (started) {
      context.lineTo(e.clientX, e.clientY);
      drawing.x2 = e.clientX;
      drawing.y2 = e.clientY;
      context.stroke();
    }
  });
  
  canvas.mouseup(function(e) {
    drawCallback(drawing);
    started = false;
    drawing = {};
  });
  
  return {
    draw: function(x1, y1, x2, y2, color) {
      context.beginPath();
      context.strokeStyle = color;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    },
    
    ondraw: function(fn) {
      drawCallback = fn;
    }
  };
}
