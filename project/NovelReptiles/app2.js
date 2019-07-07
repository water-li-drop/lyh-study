const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;

var kgURL = {
    search: 'https: //songsearch.kugou.com/song_search_v2?callback=jQuery112404309161646905839_1562485432324&page=1&pagesize=30&keyword=',
    play: 'https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=jQuery19109716894243024419_1562485642677'
}
var request = require('request');
var server = new http.Server();

server.on('request', function(req, res) {
    // 读取静态文件 
    if (req.url == '/' || req.url.match(/.js/) || req.url.match(/.css/) || req.url.match(/.css/) || req.url.match(/.jpg/)) {
        var urlTemp = '';
        if (req.url == '/') {
            urlTemp = './views/index2.html';
        } else if (req.url.match(/\?/)) {
            urlTemp = '.' + req.url.split('?')[0];
        } else if (req.url == '/favicon.ico') {
            res.end();
            return;
        } else {
            urlTemp = "." + req.url
        }
        fs.readFile(urlTemp, (err, data) => {
            res.write(data);
            res.end();
        });
    }
    // 查询
    else if (req.url.match(/\/search\?wd/)) {
        console.log(kgURL.search + req.url.split('=')[1]);
        reqFunc(kgURL.search + req.url.split('=')[1], res);
    }
    // 播放
    else if (req.url.match(/\/play\?&/)) {
        var arrTemp = req.url.split('&');
        var hash = arrTemp[1].split('=')[1];
        var album_id = arrTemp[2].split('=')[1];
        reqFunc(kgURL.search + "&hash=" + hash + "&album_id=" + album_id, res);
    }

});
var reqFunc = function(url, res) {

    request(url, function(error, response, body) {
        console.log(body);
        // if (!error && response.statusCode == 200) {
        //     res.write(JSON.stringify(body));
        //     res.end();
        // } else {
        //     console.log(response.statusCode);
        //     reqFunc(response.headers.location, res);
        // }
    })
}



server.listen(3300);
console.log('http://127.0.0.1:3300');