const http = require('http');
const URL = require('url').URL;

var url = 'https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash';

getData(url);

function getData(url) {
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
}