const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;

// var url = 'https://www.qidian.com/all';
var url = 'http://book.zongheng.com/store.html';
// var url = 'https://item.taobao.com/item.htm?ft=t&id=575483010661&ali_trackid=2:mm_26632614_0_0:1562173804_131_1608789429&spm=a21bo.7925890.192091.3';
// var url = 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png';

getData(url, function(data) {
    // console.log(data);
    // var html = gbk.toString(data);

    var dom = new JSDOM(data);
    // console.log(dom.window.document);
    console.log(dom.window.document.querySelectorAll('.bookintro').innerHTML);
    // fs.writeFile('test.html', data, (err) => {
    //     if (err) throw err;
    //     console.log('文件已被保存');
    // });
});

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
        // console.log(res);
        if (res.statusCode == '200') {
            var dataTemp = '';
            var dataTempBuffer = [];
            res.on('data', (buffer) => {
                // console.log(buffer);
                dataTempBuffer.push(buffer);
                dataTemp = "" + buffer;
                // console.log(buffer);
                console.log(dataTemp);

                // fs.writeFile('test.html', chunk, (err) => {
                //     if (err) throw err;
                //     console.log('文件已被保存');
                // });
            });
            res.on('end', () => {
                console.log('响应中已无数据');
                // var dataTempP = Buffer.concat(dataTempBuffer);
                // fs.writeFile('test.jpg', dataTempP, (err) => {
                //     if (err) throw err;
                // });

                // fs.writeFile('test.html', dataTemp, (err) => {
                //     if (err) throw err;
                //     console.log('文件已被保存');
                // });
                callback && callback(dataTemp);
            });
        } else {
            console.log(res.statusCode);
            getData(res.headers.location, callback);
        }
    });
    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
    });
    req.end();
}