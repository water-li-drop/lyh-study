var http = require('http');
var server = new http.Server();

server.on('request', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Node.js</h2>');
    res.end('<h1>Node.js</h2>');
});
server.listen(3300);
console.log('http://127.0.0.1:3300');



// server.on('request', function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<h1>Node.js</h1>');
//     res.end('<p>Hello World</p>');
//     });
//     server.listen(3000);
//     console.log("HTTP server is listening at port 3000.");