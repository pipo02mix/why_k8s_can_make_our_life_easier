const app = require('express')(),
  http = require('http').Server(app),
  fs = require('fs'),
  ini = require('ini');

app.get('/', function(req, res){
  let config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));
  
  res.send(`<h1>${config.title}</h1>`);
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
    
