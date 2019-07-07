layui.define('form', function(exports) {
    var $ = layui.$;
    $('#searchBtn').click(function() {
        console.log($('#searchValue').val());
        $.ajax({
            url: 'http://127.0.0.1:3300/search?wd=' + $('#searchValue').val(),
            success: function(data) {
                console.log(data);
            }
        })

    });
    exports('index2', {});
});