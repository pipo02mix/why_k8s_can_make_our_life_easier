const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  get_data_from_backend(function (body) {
    var body_parsed = JSON.parse(body);
    response.writeHeader(200, {"Content-Type": "text/html"}); 
    response.end('<div style="width:500px;height:500px;margin:0 auto;position:absolute;left:50%;top:50%;margin-left:-250px;margin-top:-250px;font-size: 45px;">' + body_parsed.grettings + '</div>')
  });
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on port ${port}`)
})

process.on('SIGTERM', function() {
  console.log('\ncaught SIGTERM, stopping gracefully');
  process.exit(1);
});

var backend_options = {
  host: 'backend-app',
  port: 80,
  path: '/',
  method: 'GET'
};

function get_data_from_backend(cb) {
  http.request(backend_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      cb(chunk);
    });
  }).end();
}