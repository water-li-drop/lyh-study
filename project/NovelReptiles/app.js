const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;
const request = require('request');
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
        } else if (req.url == '/favicon.ico') {
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
    } else if (req.url.match(/\/getSearchData\?wd/)) {
        var wd = req.url.split('=')[1];
        console.log(urlObj['search'] + wd);
        request(urlObj['search'] + wd, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var dom = new JSDOM(body);
                var documentTemp = dom.window.document;
                var bookData = [];
                var bookbox = documentTemp.querySelectorAll('.search-result-list');
                bookbox.forEach(function(val) {
                    var objTemp = {};
                    objTemp.bookbox_bookimg_a_href = val.querySelector('.se-result-book').querySelector('a').href;
                    objTemp.bookbox_bookimg_a_img_src = val.querySelector('.se-result-book').querySelector('a').querySelector('img').src;

                    objTemp.bookbox_bookinfo_bookname_a_innerHTML = val.querySelector('.se-result-infos').querySelector('.tit').querySelector('a').innerHTML;;

                    objTemp.bookbox_bookinfo_bookilnk_a0_innerHTML = val.querySelector('.se-result-infos').querySelector('.bookinfo').querySelectorAll('a')[0].innerHTML;
                    objTemp.bookbox_bookinfo_bookilnk_a1_innerHTML = val.querySelector('.se-result-infos').querySelector('.bookinfo').querySelectorAll('a')[1].innerHTML;
                    objTemp.bookbox_bookinfo_bookilnk_span0_innerHTML = val.querySelector('.se-result-infos').querySelector('.bookinfo').querySelectorAll('span')[0].innerHTML;
                    objTemp.bookbox_bookinfo_bookilnk_span1_innerHTML = val.querySelector('.se-result-infos').querySelector('.bookinfo').querySelectorAll('span')[1].innerHTML;

                    objTemp.bookbox_bookinfo_bookintro_innerHTML = val.querySelector('.se-result-infos').querySelector('p').innerHTML;
                    bookData.push(objTemp);
                });
            }
            res.write(JSON.stringify(bookData));
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
        getData('http://search.zongheng.com/s?keyword=%E9%9B%AA%E4%B8%AD%E6%82%8D%E5%88%80%E8%A1%8C', function(data) {
            // var dom = new JSDOM(data);
            // var documentTemp = dom.window.document;
            // console.log('---' + documentTemp.querySelector('#queryword').innerHTML + '---');
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
    // var headers = {
    //     "Connection": 'keep-alive',
    //     "Upgrade-Insecure-Requests": 1,
    //     "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    //     "Host": 'search.zongheng.com',
    //     "Cookie": ['ZHID=ECB0FB6AE9BB4D084FAE5E2449F32B2D', 'zh_visitTime=1562338576314', 'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2216bc2a2c7d8d-05671f26036333-e343166-1049088-16bc2a2c7d9b9f%22%2C%22%24device_id%22%3A%2216bc2a2c7d8d-05671f26036333-e343166-1049088-16bc2a2c7d9b9f%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; v_user=%7Chttp%3A%2F%2Fsearch.zongheng.com%2Fs%3Fkeyword%3D%25E9%259B%25AA%25E4%25B8%25AD%25E6%2582%258D%25E5%2588%2580%25E8%25A1%258C%7C35413524']
    // };
    var options = {
        hostname: myURL.hostname,
        path: myURL.pathname,
        // headers: headers
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