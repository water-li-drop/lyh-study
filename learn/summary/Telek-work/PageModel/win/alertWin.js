var alertWin = (function() {
    if (!($("#blackDiv").length)) {

        $("body").append(
            '<div id="blackDiv" style="display: none"></div>' +
            '<div id="winSuccess" style="display: none">' +
            '<div class="tishi">提示</div>' +
            '<hr>' +
            '<div id="contentSuccess"><img class="imgStyle" src="success.png" /><span id="contentS">成功！！！</span></div>' +
            '<div id="sureSuccess" style="margin-left: 125px;">确定</div>' +
            // '<div id="cancleSuccess">取消</div>' +
            '</div>' +
            '<div id="winWarning" style="display: none">' +
            '<div class="tishi">提示</div>' +
            '<hr>' +
            '<div id="contentWarning"><img class="imgStyle" src="warning.png" /><span id="contentW">警告！！！</span></div>' +
            '<div id="sureWarning">确定</div>' +
            '<div id="cancleWarning">取消</div>' +
            '</div>' +
            '<div id="winError" style="display: none">' +
            '<div class="tishi">提示</div>' +
            '<hr>' +
            '<div id="contentError"><img class="imgStyle" src="error.png" /><span id="contentE">错误！！！</span></div>' +
            '<div id="sureError">确定</div>' +
            '<div id="cancleError">取消</div>' +
            '</div>'
        );

    }




    //	成功框
    var successWin = function(msg, callback) {
            $("#contentS").html(msg ? msg : "成功");
            $("#blackDiv").css("display", "block");
            $("#winSuccess").css("display", "block");

            $("#sureSuccess").click(function() {
                $("#blackDiv").css("display", "none");
                $("#winSuccess").css("display", "none");
                callback();
            })
        }
        //	警告框
    var warningWin = function(msg, callback1, callback2) {

            $("#contentW").html(msg ? msg : "警告");
            $("#blackDiv").css("display", "block");
            $("#winWarning").css("display", "block");
            $("#sureWarning").click(function() {
                $("#blackDiv").css("display", "none");
                $("#winWarning").css("display", "none");
                callback1();
            })
            $("#cancleWarning").click(function() {
                $("#blackDiv").css("display", "none");
                $("#winWarning").css("display", "none");
                callback2();
            })
        }
        //	错误框
    var errorWin = function(msg, callback1, callback2) {
        $("#contentE").html(msg ? msg : "错误");
        $("#blackDiv").css("display", "block");
        $("#winError").css("display", "block");
        $("#sureError").click(function() {
            $("#blackDiv").css("display", "none");
            $("#winError").css("display", "none");
            callback1();
        })
        $("#cancleError").click(function() {
            $("#blackDiv").css("display", "none");
            $("#winError").css("display", "none");
            callback2();
        })
    }
    return {
        successWin: successWin,
        warningWin: warningWin,
        errorWin: errorWin
    }
})();

// document.getElementById('sureError').onclick = function() {
//     document.getElementById('winError').style.display = 'none';
//     document.getElementById('blackDiv').style.display = 'none';
// }
// document.getElementById('cancleError').onclick = function() {
//     document.getElementById('winError').style.display = 'none';
//     document.getElementById('blackDiv').style.display = 'none';
// }