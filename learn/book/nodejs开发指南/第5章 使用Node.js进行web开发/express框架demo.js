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