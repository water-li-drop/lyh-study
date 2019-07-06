const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;


var request = require('request');
var server = new http.Server();

server.on('request', function(req, res) {
    if (req.url == '/test') {
        request('http://search.zongheng.com/s?keyword=%E9%9B%AA%E4%B8%AD%E6%82%8D%E5%88%80%E8%A1%8C', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the baidu homepage.
            }
        })
    }

});
server.listen(3300);
console.log('http://127.0.0.1:3300');