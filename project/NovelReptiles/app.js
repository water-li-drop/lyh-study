const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;

var server = new http.Server();

server.on('request', function(req, res) {
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write('<h1>Node.js</h2>');
    // res.end('<h1>Node.js</h2>');
    // console.log(req);
    if (req.url == '/') {
        fs.readFile('C:\LYH\study\vscode_workspace\lyh-study\project\NovelReptiles\views\index.html', (err, data) => {
            // console.log(err);
            console.log('=======');
            console.log(data);
            res.write(data);
            res.end();
        });
        // https://blog.csdn.net/k358971707/article/details/78775141
    }

});
server.listen(3300);
console.log('http://127.0.0.1:3300');










// var url = 'https://www.qidian.com/all';
var url = 'http://book.zongheng.com/store.html';
// var url = 'https://item.taobao.com/item.htm?ft=t&id=575483010661&ali_trackid=2:mm_26632614_0_0:1562173804_131_1608789429&spm=a21bo.7925890.192091.3';
// var url = 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png';

// getData(url, function(data) {
//     // 将抓取的数据写入文件
//     // fs.appendFile('test.html', data, (err) => {
//     //     if (err) throw err;
//     //     console.log('文件已被保存');
//     // });
//     // 编码格式转换
//     // var html = gbk.toString(data);
//     // 获取页面dom
//     var dom = new JSDOM(data);
//     var documentTemp = dom.window.document;
//     var bookNameArr = documentTemp.querySelectorAll('.bookname a');
//     var a = bookNameArr.map(function(value) {
//         return value.innerHTML;
//     });
//     console.log(a);
//     // var buffer = Buffer.from(data);
// });

function getData(url, callback) {
    // url解析
    var myURL = new URL(url);
    // 获取http
    var http = '';
    if (myURL.protocol == 'http:') {
        http = require('http');
    } else if (myURL.protocol == 'https:') {
        http = require('https');
    } else {
        return 'url-error';
    }
    // 组装request参数
    var options = {
        hostname: myURL.hostname,
        path: myURL.pathname
    };
    var req = http.request(options, res => {
        var dataTemp = '';
        if (res.statusCode == '200') {
            res.on('data', (buffer) => {
                dataTemp = dataTemp + buffer;
            });
            res.on('end', () => {
                console.log('响应中已无数据');
                callback && callback(dataTemp);
            });
        } else {
            console.log(res.statusCode);
            getData(res.headers.location, callback);
        }
    });
    req.on('error', (e) => {
        console.error("请求遇到问题:" + e.message);
    });
    req.end();
}