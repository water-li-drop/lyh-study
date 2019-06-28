// 导入 http 内置模块
const http = require('http')
    // 这个核心模块，能够帮我们解析 URL地址，从而拿到  pathname  query 
const urlModule = require('url')

// 创建一个 http 服务器
const server = http.createServer()
    // 监听 http 服务器的 request 请求
server.on('request', function(req, res) {

    // const url = req.url
    const { pathname: url, query } = urlModule.parse(req.url, true)

    if (url === '/getscript') {
        // 拼接一个合法的JS脚本，这里拼接的是一个方法的调用
        // var scriptStr = 'show()'

        var data = {
            name: 'xjj',
            age: 18,
            gender: '女孩子'
        }

        var scriptStr = `${query.callback}(${JSON.stringify(data)})`
            // res.end 发送给 客户端， 客户端去把 这个 字符串，当作JS代码去解析执行
        res.end(scriptStr)
    } else if (url === '/getAllList') {
        var dataList = [{
            id: 4,
            name: '本田',
            ctime: new Date()
        }, {
            id: 5,
            name: '大众',
            ctime: new Date()
        }, {
            id: 6,
            name: '宝马',
            ctime: new Date()
        }]
        res.end(JSON.stringify(dataList));
    } else {
        res.end('404')
    }
})

// 指定端口号并启动服务器监听
server.listen(3300, function() {
    console.log('server listen at http://127.0.0.1:3300')
})