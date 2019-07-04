const http = require('http');
const fs = require('fs');
const URL = require('url').URL;
const gbk = require('gbk');
const JSDOM = require("jsdom").JSDOM;
// 请求链接
var urlObj = {
    // 主页
    "index": 'http://book.zongheng.com/store.html'
};

var server = new http.Server();

server.on('request', function(req, res) {
    // 读取静态文件 
    if (req.url == '/' || req.url.match(/.js/) || req.url.match(/.css/) || req.url.match(/.css/) || req.url.match(/.jpg/)) {
        var urlTemp = '';
        if (req.url == '/') {
            urlTemp = './views/index.html';
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
        getData(urlObj['index'], function(data) {
            // 获取页面dom
            var dom = new JSDOM(data);
            var documentTemp = dom.window.document;


            // <div class="bookbox fl">
            //         <div class="bookimg">
            //             <a href="http://book.zongheng.com/book/847660.html" target="_blank">
            //                 <img src="http://static.zongheng.com/upload/cover/6c/b3/6cb3fd566bc7213a03f6e88e4d221c09.jpeg" alt="异能生物特攻队">
            //             </a>
            //         </div>
            //         <div class="bookinfo">
            //             <div class="bookname">
            //                 <a href="http://book.zongheng.com/book/847660.html" target="_blank">异能生物特攻队</a>
            //             </div>
            //             <div class="bookilnk">
            //                 <a href="http://home.zongheng.com/show/userInfo/50798269.html" target="_blank">子小飞</a>|
            //                 <a href="http://www.zongheng.com/category/15.html" target="_blank">科幻游戏</a>|
            //                 <span>

            //                 	连载中

            //             	</span>|
            //                 <span>
            //                 更新时间&nbsp;&nbsp;07-04 11:55
            //                 </span>
            //             </div>
            //             <div class="bookintro">程石，名副其实，是个诚实的好人，没有特别大的理想，家里住着别墅，可是祖传的写字楼租不出去了，被迫出去找工作。 一套500多平方的写字楼，租了1000元，却住进了一个异能生物，被迫与本宇宙的神签&ldquo;卖身契&rdquo;，然后获得了一辆精神不怎么正常的车，这就是故事的开端。 母亲灵魂IP的期待，越来越多的异能生物，一份不能辞职的工作，一个牛叉叉的公司前台，一个义工，一个穿越宇宙的房东&hellip;&hellip;
            //             </div>
            //             <div class="bookupdate">
            //                 <a href="http://book.zongheng.com/chapter/847660/57083876.html" class="fl">最新章节：第十八章：躺在蛋里做体检</a>
            //                 <span class="rank_d_b_time"></span>
            //             </div>
            //         </div>
            //     </div>
            var bookNameArr = documentTemp.querySelectorAll('.bookname a');
            var a = bookNameArr.map(function(value) {
                return value.innerHTML;
            });
            res.write(dataTemp);
            res.end();
        })

    }
});
server.listen(9000);
console.log('http://127.0.0.1:9000');










// var url = 'http://book.zongheng.com/store.html';

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