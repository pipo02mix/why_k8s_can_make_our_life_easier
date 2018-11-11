const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  console.log('request -> ' + request.url);

  if (request.url == '/') {
    response.writeHeader(200, {"Content-Type": "text/html"}); 
    response.end('<div style="width:500px;height:500px;margin:0 auto;position:absolute;left:50%;top:50%;margin-left:-250px;margin-top:-250px;font-size: 45px;background-color:gray;">Flat HTML from frontendv2</div>')
  } else if (request.url == '/weather') {
    get_data_from_weather(function (body) {
      var body_parsed = JSON.parse(body);
      response.writeHeader(200, {"Content-Type": "text/html"}); 
      response.end('<div style="width:500px;height:500px;margin:0 auto;position:absolute;left:50%;top:50%;margin-left:-250px;margin-top:-250px;font-size: 45px;background-color:gray;">Temperature: ' + Math.round((body_parsed.main.temp - 273) * 100) / 100 + ' C&deg;<br>Description: ' + body_parsed.weather[0].description + '</div>')
    });
  } else {
    get_data_from_backend(request, function (body) {
      var body_parsed = JSON.parse(body);
      response.writeHeader(200, {"Content-Type": "text/html"}); 
      response.end('<div style="width:500px;height:500px;margin:0 auto;position:absolute;left:50%;top:50%;margin-left:-250px;margin-top:-250px;font-size: 45px;background-color:gray;">' + body_parsed.grettings + '</div>')
    });
  }
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
  method: 'GET',
  headers: {
    'x-request-id': '',
    'x-b3-traceid': '',
    'x-b3-spanid': '',
    'x-b3-parentspanid': '',
    'x-b3-sampled': '',
    'x-b3-flags': '',
    'x-ot-span-context': ''
  }
};

function get_data_from_backend(request, cb) {

  console.log('coming http headers: ', request.headers);

  for (var header in backend_options.headers) {
    if (backend_options.headers.hasOwnProperty(header)) {
      backend_options.headers[header] = request.headers[header] || '';
    }
  }

  console.log('passing http headers: ', backend_options.headers);

  http.request(backend_options, function(response) {
    console.log('response -> ' + response.statusCode);
    
    if (response.statusCode != "200") {
      cb('{"grettings":"Backend response error"}');
    } else {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        cb(chunk);
      });
    }
  }).end();
}

var weather_options = {
  host: 'api.openweathermap.org',
  port: 80,
  path: '/data/2.5/weather?q=Mannheim,DE&appid=6c241b137238301ba4cbfb7a177c19df',
  method: 'GET'
};

function get_data_from_weather(cb) {
  http.request(weather_options, function(response) {
    if (response.statusCode != "200") {
      cb('{"main":{"temp":"-"},"weather":{"description":"error upstream"}}');
    } else {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('chunk: ', chunk);
        cb(chunk);
      });
    }
  }).end();
}

