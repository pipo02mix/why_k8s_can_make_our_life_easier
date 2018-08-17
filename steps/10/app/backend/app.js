const http = require('http')
const port = 80

const requestHandler = (request, response) => {
  console.log(request.url)
  response.writeHeader(200, {"Content-Type": "application/json"}); 
  response.end(JSON.stringify({
      grettings: "Hi ISTIO WORKSHOP"
  }))
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
