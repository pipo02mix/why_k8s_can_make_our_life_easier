const app = require('express')(),
  http = require('http').Server(app),
  fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
    
