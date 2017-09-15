const http = require('http').createServer(),
  io = require('socket.io')(http);


io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8081, function(){
  console.log('listening on *:8081');
});
    
