var http = require('http');
var url = require('url')
var fs = require('fs');

var server = http.createServer(function(req, res){
  var urlParts = url.parse(req.url);
  var path = __dirname + '/' + urlParts.pathname;
  var stream = fs.createReadStream(path);
  stream.pipe(res);

  fs.readFile('server.html', 'utf-8', function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  })

});

server.listen(1234);
console.log('server listening..');
