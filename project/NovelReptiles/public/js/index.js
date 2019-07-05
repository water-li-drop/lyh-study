layui.define('form', function(exports) {
    var form = layui.form;
    var $ = layui.$;

    // 默认加载数据
    $.ajax({
            url: 'http://127.0.0.1:3300/getIndexData',
            success: function(data) {
                morenload(data, muluFunc);
            }
        })
        // 查询数据加载
    $('#searchBtn').click(function() {
        console.log($('#searchWD').val());
        $.ajax({
            url: 'http://127.0.0.1:3300/getSearchData',
            success: function(data) {
                console.log(data);
                var bookData = JSON.parse(data);
                console.log(bookData);
                // var bookdomStr = '';

                // $('.data-section').html(bookdomStr);
            }

        })
    });
    // 默认记载函数
    var morenload = function(data, callback) {
            var bookData = JSON.parse(data);
            var bookdomStr = '';
            bookData.forEach(function(obj) {
                bookdomStr = bookdomStr + '<div class="bookbox clearfix" data-href="' + obj.bookbox_bookimg_a_href + '">';
                bookdomStr = bookdomStr + '<div class="bookimg f-left">';
                bookdomStr = bookdomStr + '<a  target="_blank">';
                bookdomStr = bookdomStr + '<img src="' + obj.bookbox_bookimg_a_img_src + '" alt="' + obj.bookbox_bookinfo_bookname_a_innerHTML + '">';
                bookdomStr = bookdomStr + '</a>';
                bookdomStr = bookdomStr + '</div>';

                bookdomStr = bookdomStr + '<div class="bookinfo f-left">';
                bookdomStr = bookdomStr + '<div class="bookname">';
                // bookdomStr = bookdomStr + '<a href="' + obj.bookbox_bookinfo_bookname_a_href + '" target="_blank">' + obj.bookbox_bookinfo_bookname_a_innerHTML + '</a>';
                bookdomStr = bookdomStr + '<a>' + obj.bookbox_bookinfo_bookname_a_innerHTML + '</a>';
                bookdomStr = bookdomStr + '</div>';

                bookdomStr = bookdomStr + '<div class="bookilnk">';
                // bookdomStr = bookdomStr + '<a href="' + obj.bookbox_bookinfo_bookilnk_a0_href + '" target="_blank">' + obj.bookbox_bookinfo_bookilnk_a0_innerHTML + '</a>|';
                bookdomStr = bookdomStr + '<a >' + obj.bookbox_bookinfo_bookilnk_a0_innerHTML + '</a>|';
                // bookdomStr = bookdomStr + '<a href="' + obj.bookbox_bookinfo_bookilnk_a1_href + '" target="_blank">' + obj.bookbox_bookinfo_bookilnk_a1_innerHTML + '</a>|';
                bookdomStr = bookdomStr + '<a  >' + obj.bookbox_bookinfo_bookilnk_a1_innerHTML + '</a>|';
                bookdomStr = bookdomStr + '<span>' + obj.bookbox_bookinfo_bookilnk_span0_innerHTML + '</span>|';
                bookdomStr = bookdomStr + '<span>' + obj.bookbox_bookinfo_bookilnk_span1_innerHTML + '</span>';
                bookdomStr = bookdomStr + '</div>';
                bookdomStr = bookdomStr + '<div class="bookintro">' + obj.bookbox_bookinfo_bookintro_innerHTML + '</div>';
                bookdomStr = bookdomStr + '</div>';
                bookdomStr = bookdomStr + '</div>';
            });
            $('.data-section').html(bookdomStr);
            callback();
        }
        // 查看目录函数
    var muluFunc = function() {
        $(".bookbox").click(function(event) {
            var href = event.currentTarget.dataset.href;
            $.ajax({
                url: 'http://127.0.0.1:3300/getmuList?booknum =' + href.split('/').pop(),
                success: function(data) {
                    muluFunc2(data, readBook);
                }
            })
        });
    }
    var muluFunc2 = function(data, callback) {
            var muluData = JSON.parse(data);
            var temp = '';
            temp = temp + '<div class="book-meta">';
            temp = temp + '<h1>' + muluData.book_meta_h1 + '</h1></div>';

            temp = temp + '<div class="volume-list">';
            temp = temp + '<div><div class="volume vip-color">';
            temp = temp + '<div class="arrow-top arrow-box"><b class="top"><i class="arrow1"></i><i class="arrow2"></i></b></div>';
            temp = temp + '<em class="v-line"></em>正文<em class="count">' + muluData.volume_list_count + '</em></div>';

            temp = temp + '<ul class="chapter-list clearfix">';

            muluData.chapter_list.forEach(function(obj) {
                temp = temp + '<li class="col-4" data-href="' + obj.href + '"><a>' + obj.text + '</a></li>';
            });

            temp = temp + '</ul></div></div>';

            $('.data-section').html(temp);
            callback();
        }
        // 阅读函数
    var readBook = function() {
        $(".chapter-list li").click(function() {
            var href = event.currentTarget.dataset.href;
            var hrefTemp = href.split('/');
            hrefTemp2 = hrefTemp[hrefTemp.length - 2] + '/' + hrefTemp[hrefTemp.length - 1];
            console.log(hrefTemp2);
            $.ajax({
                url: 'http://127.0.0.1:3300/getData?bookdata =' + hrefTemp2,
                success: function(data) {
                    console.log(data);
                    var readData = JSON.parse(data);
                    var temp = '';
                    temp = temp + '<div class="reader_box" style="-moz-user-select:none;-webkit-user-select:none;" unselectable="on" onselectstart="return false;">';
                    temp = temp + '<div class="title"><div class="iconbox"><em class=""></em></div>';
                    temp = temp + '<div class="title_txtbox">' + readData.reader_box_title_txtbox + '</div></div>';
                    temp = temp + ' <div class="bookinfo">作者：<a>' + readData.reader_box_bookinfo_a + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;字数：<span>' + readData.reader_box_bookinfo_span0 + '</span>&nbsp;&nbsp;|&nbsp;&nbsp;更新时间：<span>' + readData.reader_box_bookinfo_span1 + '</span></div>';
                    temp = temp + '<div class="reader_line"></div>';
                    temp = temp + '<div class="content" itemprop="acticleBody">' + readData.content;
                    temp = temp + '</div></div>';

                    $('.data-section').html(temp);
                }

            })
        });
    }

    exports('index', {});
});