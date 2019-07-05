const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;
// 请求链接
var urlObj = {
    // 主页
    "index": 'http://book.zongheng.com/store.html',
    "search": 'http://search.zongheng.com/s?keyword=',
    'muList': 'http://book.zongheng.com/showchapter/',
    'data': 'http://book.zongheng.com/chapter/',
};

var server = new http.Server();

server.on('request', function(req, res) {
    // console.log(req);
    // 读取静态文件 
    if (req.url == '/' || req.url.match(/.js/) || req.url.match(/.css/) || req.url.match(/.css/) || req.url.match(/.jpg/)) {
        var urlTemp = '';
        if (req.url == '/') {
            urlTemp = './views/Index.html';
        } else if (req.url.match(/\?/)) {
            urlTemp = '.' + req.url.split('?')[0];
        } else if (req.url == ' /favicon.ico') {
            return;
        } else {
            urlTemp = "." + req.url
        }
        fs.readFile(urlTemp, (err, data) => {
            res.write(data);
            res.end();
        });
    }
    // 首页ajax加载数据
    else if (req.url == '/getIndexData') {
        console.log(urlObj['index']);
        getData(urlObj['index'], function(data) {
            // 获取页面dom
            var dom = new JSDOM(data);
            var documentTemp = dom.window.document;
            var bookData = [];
            var bookbox = documentTemp.querySelectorAll('.bookbox');
            bookbox.forEach(function(val) {
                var objTemp = {};
                objTemp.bookbox_bookimg_a_href = val.querySelector('.bookimg').querySelector('a').href;
                objTemp.bookbox_bookimg_a_img_src = val.querySelector('.bookimg').querySelector('a').querySelector('img').src;

                objTemp.bookbox_bookinfo_bookname_a_href = val.querySelector('.bookinfo').querySelector('.bookname').querySelector('a').href;
                objTemp.bookbox_bookinfo_bookname_a_innerHTML = val.querySelector('.bookinfo').querySelector('.bookname').querySelector('a').innerHTML;;

                objTemp.bookbox_bookinfo_bookilnk_a0_href = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('a')[0].href;
                objTemp.bookbox_bookinfo_bookilnk_a0_innerHTML = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('a')[0].innerHTML;

                objTemp.bookbox_bookinfo_bookilnk_a1_href = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('a')[1].href;
                objTemp.bookbox_bookinfo_bookilnk_a1_innerHTML = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('a')[1].innerHTML;

                objTemp.bookbox_bookinfo_bookilnk_span0_innerHTML = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('span')[0].innerHTML;
                objTemp.bookbox_bookinfo_bookilnk_span1_innerHTML = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('span')[1].innerHTML;


                objTemp.bookbox_bookinfo_bookilnk_a1_href = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('a')[1].href;
                objTemp.bookbox_bookinfo_bookilnk_a1_innerHTML = val.querySelector('.bookinfo').querySelector('.bookilnk').querySelectorAll('a')[1].innerHTML;

                objTemp.bookbox_bookinfo_bookintro_innerHTML = val.querySelector('.bookinfo').querySelector('.bookintro').innerHTML;

                objTemp.bookbox_bookinfo_bookupdate_a_href = val.querySelector('.bookinfo').querySelector('.bookupdate').querySelector('a').href;
                objTemp.bookbox_bookinfo_bookupdate_a_innerHTML = val.querySelector('.bookinfo').querySelector('.bookupdate').querySelector('a').innerHTML;

                objTemp.bookbox_bookinfo_bookupdate_span_innerHTML = val.querySelector('.bookinfo').querySelector('.bookupdate').querySelector('span').innerHTML;

                bookData.push(objTemp);
            })
            res.write(JSON.stringify(bookData));
            res.end();
        });
        // 查询书籍
    } else if (req.url.match(/\/\?bookname/)) {
        var wd = req.url.split('=')[1];
        console.log(urlObj['search'] + wd);
        getData(urlObj['search'] + wd, function(data) {
            console.log(data);
            // 获取页面dom
            // var dom = new JSDOM(data);
            // var documentTemp = dom.window.document;
            // res.write(JSON.stringify(dataObj));
            res.end();
        });
        // 获取目录
    } else if (req.url.match(/\/getmuList\?booknum/)) {
        var wd = req.url.split('=')[1];
        console.log(urlObj['muList'] + wd);
        getData(urlObj['muList'] + wd, function(data) {
            // 获取页面dom
            var dom = new JSDOM(data);
            var documentTemp = dom.window.document;
            var dataObj = {};
            dataObj.book_meta_h1 = documentTemp.querySelector('.book-meta h1').innerHTML;

            dataObj.volume_list_count = documentTemp.querySelector('.volume-list .count').innerHTML;
            dataObj.volume_list_cite = documentTemp.querySelector('.volume-list cite').innerHTML;

            dataObj.chapter_list = [];
            var Temp = documentTemp.querySelectorAll('.chapter-list li');
            Temp.forEach(function(val) {
                var objTemp = {};
                objTemp.href = val.querySelector('a').href;
                objTemp.text = val.querySelector('a').innerHTML;
                dataObj.chapter_list.push(objTemp);
            });
            res.write(JSON.stringify(dataObj));
            res.end();
        });
        // 获取内容
    } else if (req.url.match(/\/getData\?bookdata/)) {
        var wd = req.url.split('=')[1];
        console.log(urlObj['data'] + wd);
        getData(urlObj['data'] + wd, function(data) {
            // 获取页面dom
            var dom = new JSDOM(data);
            var documentTemp = dom.window.document;
            var dataObj = {};
            dataObj.reader_box_title_txtbox = documentTemp.querySelector('.title_txtbox').innerHTML;
            dataObj.reader_box_bookinfo_a = documentTemp.querySelector('.bookinfo a').innerHTML;
            dataObj.reader_box_bookinfo_span0 = documentTemp.querySelectorAll('.bookinfo span')[0].innerHTML;
            dataObj.reader_box_bookinfo_span1 = documentTemp.querySelectorAll('.bookinfo span')[1].innerHTML;
            dataObj.content = documentTemp.querySelector('.reader_box .content').innerHTML;
            res.write(JSON.stringify(dataObj));
            res.end();
        });
        // 测试
    } else if (req.url == '/test') {
        getData('http://book.zongheng.com/showchapter/830163.html', function(data) {
            // console.log(data);
            fs.writeFile('test.html', data, function(err) {
                if (err) throw err;
                console.log('文件已被保存');
            })
        });
    }
});
server.listen(3300);
console.log('http://127.0.0.1:3300');


// common---数据抓取方法
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
        path: myURL.pathname,
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