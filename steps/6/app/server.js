const app = require('express')(),
  http = require('http').Server(app);

app.get('/', function(req, res){
  res.send(`<h1> It looks like it is working </h1>`);
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
    
