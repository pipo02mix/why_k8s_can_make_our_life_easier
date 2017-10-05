const http = require('http').createServer(),
  io = require('socket.io')(http),
  MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://mongo.default:27017/k8s', function(err, db) {

  io.on('connection', function(socket){
    console.log('a user connected');
  
    socket.on('chat message', function (msg) {
      db.collection('messages').insertOne({ message: msg });
      io.emit('chat message', msg);
    });

    socket.on('history', function(msg){
      db.collection('messages').find({}).toArray(function(err, messages) {
        let coll = messages.map(function (m) { return m.message; });
        io.emit('history', coll);
      });
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
});

http.listen(8081, function(){
  console.log('listening on *:8081');
});
    
