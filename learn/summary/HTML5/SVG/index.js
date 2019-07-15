(function() {


    var draw = SVG('svgTest').size('100%', '100%');

    var box = draw.viewbox(0, 0, 1366, 625);
    var zoom = box.zoom;

    var canshuOBJ = {
        kaiqi: {
            JX: [110, 273],
            WZ: {
                position: [170, 290],
                content: "开启"
            },
            ZX: [270, 310, 430, 310],
            JT: [430, 300, 440, 310, 430, 320],
            alertContent: "KQ"
        },
        bianzhi: {
            JX: [440, 273],
            WZ: {
                position: [500, 290],
                content: "编制"
            },
            ZX: [600, 310, 760, 310],
            JT: [760, 300, 770, 310, 760, 320],
            alertContent: "BZ"
        },
        shenhe: {
            JX: [770, 273],
            WZ: {
                position: [830, 290],
                content: "审核"
            },
            ZX: [930, 310, 1090, 310],
            JT: [1090, 300, 1100, 310, 1090, 320],
            alertContent: "SH"
        },
        zhixing: {
            JX: [1100, 273],
            WZ: {
                position: [1160, 290],
                content: "执行"
            },
            alertContent: "ZX"
        },
    }

    // 1.开启——>矩形--文字--直线--箭头
    var KQ_rect = doRect(canshuOBJ.kaiqi.JX);
    var KQ_text = doText(canshuOBJ.kaiqi.WZ);
    var KQ_LINE = doLine(canshuOBJ.kaiqi.ZX);
    var KQ_Arrow = doArrow(canshuOBJ.kaiqi.JT);

    // 2.编制——>矩形--文字--直线--箭头
    var BZ_rect = doRect(canshuOBJ.bianzhi.JX);
    var BZ_text = doText(canshuOBJ.bianzhi.WZ);
    var BZ_LINE = doLine(canshuOBJ.bianzhi.ZX);
    var BZ_Arrow = doArrow(canshuOBJ.bianzhi.JT);
    // // 3.审核——>矩形--文字--直线--箭头
    var SH_rect = doRect(canshuOBJ.shenhe.JX);
    var SH_text = doText(canshuOBJ.shenhe.WZ);
    var SH_LINE = doLine(canshuOBJ.shenhe.ZX);
    var SH_Arrow = doArrow(canshuOBJ.shenhe.JT);
    // // 4.执行——>矩形--文字
    var ZX_rect = doRect(canshuOBJ.zhixing.JX);
    var ZX_text = doText(canshuOBJ.zhixing.WZ);


    // 矩形func
    function doRect(position) {
        var rect = draw.rect(160, 80).style({ cursor: 'pointer' }).attr({ fill: 'green', x: position[0], y: position[1] }).radius(10);
        return rect;
    }
    // 文字func
    function doText(wenzi) {
        var text = draw.text(wenzi.content).font({
            family: 'Helvetica',
            size: 20
        }).style({ cursor: 'pointer' }).attr({ fill: '#fff', x: wenzi.position[0], y: wenzi.position[1] });
        return text;
    }
    // 直线func
    function doLine(position) {
        var line = draw.line(position[0], position[1], position[2], position[3]).stroke({ width: 1 });
        return line;
    }
    // 箭头func
    function doArrow(position) {
        var polygon = draw.polygon(position[0] + "," + position[1] + "," + position[2] + "," + position[3] + "," + position[4] + "," + position[5]).fill('green').stroke({ width: 0 });
        return polygon;
    }

    // 开启点击事件绑定
    KQ_rect.click(function() {
        alert(canshuOBJ.kaiqi.alertContent);
    });
    KQ_text.click(function() {
        alert(canshuOBJ.kaiqi.alertContent);
    });
    // 编制点击事件绑定
    BZ_rect.click(function() {
        alert(canshuOBJ.bianzhi.alertContent);
    });
    BZ_text.click(function() {
        alert(canshuOBJ.bianzhi.alertContent);
    });
    // 审核点击事件绑定
    SH_rect.click(function() {
        alert(canshuOBJ.shenhe.alertContent);
    });
    SH_text.click(function() {
        alert(canshuOBJ.shenhe.alertContent);
    });
    // 开启点击事件绑定
    ZX_rect.click(function() {
        alert(canshuOBJ.zhixing.alertContent);
    });
    ZX_text.click(function() {
        alert(canshuOBJ.zhixing.alertContent);
    });



}())