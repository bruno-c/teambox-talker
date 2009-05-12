function Connection(room, user, options) {
  var emptyFn = function(){};
  var socket = jsSocket({
    port: 1234,
    debug: true,
    keepalive: function() {
      this.send({ type: 'ping', room: room })
    },
    onData: function(m) {
      (options.onReceive || emptyFn)(JSONstring.toObject(m))
    },
    onOpen: function() {
      this.send({ type: 'open', room: room });
      (options.onOpen || emptyFn)();
    },
    onClose: function() {
      (options.onClose || emptyFn)();
    }
  });
  
  return {
    // Public property
    send: function(message) {
      socket.send({
        type: "message",
        message: message.content,
        data: message.data,
        room: room,
        user: user
      });
    }
  };
}

function DrawingBoard(canvas, color) {
  var context = canvas[0].getContext('2d');
  var started = false;
  var drawing = [];
  var drawCallback = function(d) {};
  
  canvas.mousedown(function(e) {
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(e.clientX, e.clientY);
    drawing.push({x: e.clientX, y: e.clientY, color: color});
    started = true;
  });

  canvas.mousemove(function(e) {
    if (started) {
      context.lineTo(e.clientX, e.clientY);
      drawing.push({x: e.clientX, y: e.clientY});
      context.stroke();
    }
  });
  
  canvas.mouseup(function(e) {
    drawCallback(drawing);
    started = false;
    drawing = [];
  });
  
  return {
    draw: function(drawing) {
      header = drawing[0];
      context.beginPath();
      context.strokeStyle = header.color;
      context.moveTo(header.x, header.y);
      for (var i=1; i < drawing.length; i++) {
        context.lineTo(drawing[i].x, drawing[i].y);
      };
      context.stroke();
    },
    
    ondraw: function(fn) {
      drawCallback = fn;
    }
  };
}
