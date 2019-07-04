layui.define('form', function(exports) {
    var form = layui.form;
    var $ = layui.$;

    // 加载数据
    $.ajax({
        url: 'http://127.0.0.1:9000/getIndexData',
        success: function(data) {
            console.log(data);
        }

    })
    exports('index', {});
});