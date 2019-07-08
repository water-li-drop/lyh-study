var express = require('express');
var app = express();

app.get('http://www.lagou.com/lbs/getAllCitySearchLabels.json', function(req, res) {
    console.log(req);
    console.log(res);
})
var server = app.listen(3300, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(host + '-' + port);

    console.log("应用实例，访问地址为 http://127.0.0.1", host, port)
})

//express_demo.js 文件
// var express = require('express');
// var app = express();

// app.get('/', function (req, res) {
//    res.send('Hello World');
// })

// var server = app.listen(8081, function () {

//   var host = server.address().address
//   var port = server.address().port

//   console.log("应用实例，访问地址为 http://%s:%s", host, port)

// })