var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var tempPage = fs.readFileSync('file:///C:/Users/noritake_msak/Documents/javascript/angularjs/binding.html', 'shift_jis');
var nextPage = fs.readFileSync('./next.html', 'utf-8');

var server = http.createServer(function(req, res){
  if(req.method == 'GET'){
    var urlParts = url.parse(req.url, true);
    console.log('---GET Request---');
    console.log('name is ' + urlParts.query.name);
    console.log('age is ' + urlParts.query.age);
  } else {
    var body = '';
    req.on('data', function(data){
      body += data;
    });
    req.on('end', function(){
      var params = qs.parse(body);
      console.log('---POST Request---');
      console.log('name is ' + params.name);
      console.log('age is ' + params.age);
    });
  }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(tempPage);
    res.end();
});

server.listen(1234, '192.168.33.10');
console.log('server listening..');
