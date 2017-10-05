const app = require('express')(),
  http = require('http').Server(app),
  fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io.js', function(req, res){
  res.sendFile(__dirname + '/socket.io.js');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
    
