var WebCollectConfig = WebCollectConfig || {
    "appid": "2400",
    "appkey": "cdefgCf2bA22F"
};
(function() {
    if (WebCollectConfig.loaded == true) {
        return
    }
    WebCollectConfig.loaded = true;
    var t;
    WebCollectConfig.servertime = 1421395624;
    WebCollectConfig.protocol = "http";
    WebCollectConfig.getServerFlag = false;
    WebCollectConfig.requestList = [];
    WebCollectConfig.jetTag = -1;
    WebCollectConfig.callback = function(callbckObj) {
        WebCollectConfig.getServerFlag = true;
        var serverTime = parseInt(callbckObj.now);
        WebCollectConfig.servertime = parseInt(serverTime);
        WebCollectConfig.jetTag = WebCollectConfig.servertime - parseInt((new Date).getTime() / 1e3) || 0;
        if (WebCollectConfig.getServerFlag) {
            clearTimeout(t);
            if (WebCollectConfig.requestList.length > 0) {
                for (var k = 0, len = WebCollectConfig.requestList.length; k < len; k++) {
                    var fireLastdata = WebCollectConfig.requestList.pop();
                    var encodefireLastdata = encodeURIComponent(stringify(fireLastdata[1]));
                    fireRequest(fireLastdata[0], encodefireLastdata, fireLastdata[2], fireLastdata[3], fireLastdata[4])
                }
            }
        }
    };

    function getServerTime() {
        var datas = "";
        var dyAjaxArgs = {
            _t: (new Date).getTime(),
            _r: Math.random(),
            callback: "WebCollectConfig.callback",
            appid: WebCollectConfig.appid
        };
        var sign = dealPara(dyAjaxArgs, datas);
        var requestLink = WebCollectConfig.protocol == "https" ? "https://webcollects.kugou.com" : "http://webcollect.kugou.com";
        var DynamicUrl = requestLink + "/v2/web/time.js?appid=" + dyAjaxArgs.appid + "&_t=" + dyAjaxArgs._t + "&_r=" + dyAjaxArgs._r + "&sign=" + sign + "&callback=" + dyAjaxArgs.callback;
        try {
            DynamicAjax(DynamicUrl)
        } catch (ex) {}
        clearTimeout(WebCollectConfig.callbackT);
        WebCollectConfig.callbackT = setTimeout(function() {
            if (WebCollectConfig.getServerFlag != true && WebCollectConfig.requestList.length > 0) {
                for (var k = 0, len = WebCollectConfig.requestList.length; k < len; k++) {
                    var fireLastdata = WebCollectConfig.requestList.pop();
                    fireLastdata[2] && fireLastdata[2]()
                }
                clearTimeout(WebCollectConfig.callbackT)
            }
        }, 2e3)
    }

    function DynamicAjax(getUrl) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = getUrl;
        document.getElementsByTagName("head")[0].appendChild(script)
    }

    function fireRequest(business, data, callback, option_server, extendArg) {
        var consArgs = {
                _t: getTimestamp(),
                business: business,
                appid: WebCollectConfig.appid
            },
            requestLink = "",
            web_collectLink = "http://webcollect.kugou.com",
            rt_webcollectLink = "http://rt.webcollect.kugou.com";
        if (WebCollectConfig.protocol == "https") {
            web_collectLink = "https://webcollects.kugou.com";
            rt_webcollectLink = "https://rtwebcollects.kugou.com"
        }
        if (typeof extendArg != "undefined" && typeof extendArg.directLink != "undefined" && extendArg.directLink != "") {
            requestLink = extendArg.directLink
        } else {
            requestLink = option_server ? rt_webcollectLink : web_collectLink
        }
        requestLink = requestLink + "/v2/web/post";
        if (typeof extendArg != "undefined" && typeof extendArg.type != "undefined" && extendArg.type.toUpperCase() == "GET") {
            var randomStr = "kugou" + (new Date).getTime() + Math.random().toString(36).substr(2);
            window[randomStr] = function(obj) {
                if (typeof callback === "function") {
                    callback(obj)
                }
                window[randomStr] = null
            };
            consArgs["data"] = data;
            consArgs["callback"] = randomStr;
            var sign = dealPara(consArgs, "");
            var url = requestLink + "?appid=" + consArgs.appid + "&business=" + consArgs.business + "&_t=" + consArgs._t + "&sign=" + sign + "&data=" + encodeURIComponent(data) + "&callback=" + randomStr;
            CrossDomainGet(url)
        } else if (typeof extendArg != "undefined" && typeof extendArg.type != "undefined" && extendArg.type.toUpperCase() == "POST") {
            var sign = dealPara(consArgs, data);
            var url = requestLink + "?appid=" + consArgs.appid + "&business=" + consArgs.business + "&_t=" + consArgs._t + "&sign=" + sign;
            CrossDomainPost(url, data, callback)
        } else {
            var sign = dealPara(consArgs, data);
            var url = requestLink + "?appid=" + consArgs.appid + "&business=" + consArgs.business + "&_t=" + consArgs._t + "&sign=" + sign;
            CrossDomainPost(url, data, callback)
        }
    }
    var Md5 = {
        hex_chr: "0123456789abcdef",
        rhex: function(num) {
            var str = "";
            for (var j = 0; j <= 3; j++) {
                str += this.hex_chr.charAt(num >> j * 8 + 4 & 15) + this.hex_chr.charAt(num >> j * 8 & 15)
            }
            return str
        },
        str2blks_MD5: function(str) {
            var nblk = (str.length + 8 >> 6) + 1;
            var blks = new Array(nblk * 16);
            for (var i = 0; i < nblk * 16; i++) {
                blks[i] = 0
            }
            for (var i = 0; i < str.length; i++) {
                blks[i >> 2] |= str.charCodeAt(i) << i % 4 * 8
            }
            blks[i >> 2] |= 128 << i % 4 * 8;
            blks[nblk * 16 - 2] = str.length * 8;
            return blks
        },
        add: function(x, y) {
            var lsw = (x & 65535) + (y & 65535);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 65535
        },
        rol: function(num, cnt) {
            return num << cnt | num >>> 32 - cnt
        },
        cmn: function(q, a, b, x, s, t) {
            return this.add(this.rol(this.add(this.add(a, q), this.add(x, t)), s), b)
        },
        ff: function(a, b, c, d, x, s, t) {
            return this.cmn(b & c | ~b & d, a, b, x, s, t)
        },
        gg: function(a, b, c, d, x, s, t) {
            return this.cmn(b & d | c & ~d, a, b, x, s, t)
        },
        hh: function(a, b, c, d, x, s, t) {
            return this.cmn(b ^ c ^ d, a, b, x, s, t)
        },
        ii: function(a, b, c, d, x, s, t) {
            return this.cmn(c ^ (b | ~d), a, b, x, s, t)
        },
        md5: function(str) {
            var x = this.str2blks_MD5(str);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.add(a, olda);
                b = this.add(b, oldb);
                c = this.add(c, oldc);
                d = this.add(d, oldd)
            }
            return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d)
        }
    };

    function stringify(value, whitelist) {
        var m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        var a, i, k, l, r = /["\\\x00-\x1f\x7f-\x9f]/g,
            v;
        switch (typeof value) {
            case "string":
                return r.test(value) ? '"' + value.replace(r, function(a) {
                    var c = m[a];
                    if (c) {
                        return c
                    }
                    c = a.charCodeAt();
                    return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
                }) + '"' : '"' + value + '"';
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                if (typeof value.toJSON === "function") {
                    return stringify(value.toJSON())
                }
                a = [];
                if (typeof value.length === "number" && !value.propertyIsEnumerable("length")) {
                    l = value.length;
                    for (i = 0; i < l; i += 1) {
                        a.push(stringify(value[i], whitelist) || "null")
                    }
                    return "[" + a.join(",") + "]"
                }
                if (whitelist) {
                    l = whitelist.length;
                    for (i = 0; i < l; i += 1) {
                        k = whitelist[i];
                        if (typeof k === "string") {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ":" + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (typeof k === "string") {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ":" + v)
                            }
                        }
                    }
                }
                return "{" + a.join(",") + "}"
        }
    }
    var unique = function() {
        var time = (new Date).getTime() + "-",
            i = 0;
        return function() {
            return time + i++
        }
    }();

    function CrossDomainGet(url) {
        var script = document.createElement("script"),
            DynamicId = Math.random().toString().split(".").pop();
        script.type = "text/javascript";
        script.src = url;
        script.id = DynamicId;
        document.body.appendChild(script);
        (function(script) {
            if (!0) {
                script.onload = function() {
                    setTimeout(function() {
                        document.body.removeChild(script);
                        ifm = null
                    }, 1e3)
                }
            } else {
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        setTimeout(function() {
                            document.body.removeChild(script);
                            ifm = null
                        }, 1e3)
                    }
                }
            }
            return false
        })(script)
    }

    function CrossDomainPost(url, content, callback) {
        var uStr = unique();
        var frm = document.createElement("form");
        frm.name = "postForm" + uStr;
        frm.id = "postForm" + uStr;
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "content";
        input.value = content;
        frm.appendChild(input);
        document.body.appendChild(frm);
        var ifm = null;
        try {
            ifm = document.createElement('<iframe name="postIframe' + uStr + '">')
        } catch (ex) {
            ifm = document.createElement("iframe")
        }
        try {
            ifm.name = "postIframe" + uStr;
            ifm.id = "postIframe" + uStr;
            ifm.width = "1";
            ifm.height = "1";
            ifm.style.display = "none";
            document.body.appendChild(ifm);
            frm.action = url;
            frm.target = ifm.name;
            frm.method = "post";
            frm.submit();
            callback && callback()
        } catch (ex) {
            callback && callback()
        }
        if (ifm.attachEvent) {
            (function(ifm) {
                ifm.attachEvent("onload", function() {
                    if (WebCollectConfig.clinetfrom == undefined || WebCollectConfig.clinetfrom == "1001") {
                        setTimeout(function() {
                            document.body.removeChild(ifm);
                            document.body.removeChild(frm);
                            ifm = null
                        }, 1e3)
                    }
                    callback && callback()
                })
            })(ifm)
        } else {
            (function(ifm) {
                ifm.onload = function() {
                    if (WebCollectConfig.clinetfrom == undefined || WebCollectConfig.clinetfrom == "1001") {
                        setTimeout(function() {
                            document.body.removeChild(ifm);
                            document.body.removeChild(frm);
                            ifm = null
                        }, 1e3)
                    }
                    callback && callback()
                }
            })(ifm)
        }
        return false
    }

    function getTimestamp() {
        var relTime = parseInt((new Date).getTime() / 1e3) + WebCollectConfig.jetTag;
        return relTime
    }

    function dealPara(para, data) {
        var str = "",
            iarr = [];
        for (var i in para) {
            iarr.push(i)
        }
        iarr.sort();
        for (var k = 0, len = iarr.length; k < len; k++) {
            str += iarr[k] + para[iarr[k]]
        }
        str += WebCollectConfig.appkey + data || "";
        return Md5.md5(str)
    }
    try {
        var scripts = document.getElementsByTagName("script");
        if (scripts && scripts.length > 0) {
            for (var k = 0, len = scripts.length; k < len; k++) {
                if (scripts[k]["src"].indexOf("collect.js") != -1) {
                    if (scripts[k]["src"].indexOf("https") != -1) {
                        WebCollectConfig.protocol = "https"
                    } else {
                        WebCollectConfig.protocol = "http"
                    }
                    break
                }
            }
        }
    } catch (ex) {}
    getServerTime();

    function isOwnEmpty(obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false
            }
        }
        return true
    }

    function init(business, datas, callback, option_server, extendArg) {
        try {
            var scripts = document.getElementsByTagName("script");
            if (scripts && scripts.length > 0) {
                for (var k = 0, len = scripts.length; k < len; k++) {
                    if (scripts[k]["src"].indexOf("collect.js") != -1) {
                        if (scripts[k]["src"].indexOf("https") != -1) {
                            WebCollectConfig.protocol = "https"
                        } else {
                            WebCollectConfig.protocol = "http"
                        }
                        break
                    }
                }
            }
        } catch (ex) {}
        try {
            if (apmCollectData && apmCollectData.length > 0) {
                for (var j = 0, len = apmCollectData.length; j < len; j++) {
                    var firedata = apmCollectData.pop();
                    var encodedata = firedata[1];
                    init(firedata[0], encodedata, firedata[2], firedata[3], firedata[4])
                }
            }
        } catch (ex) {}
        try {
            datas.toString();
            WebCollectConfig.clinetfrom = datas.plat_id
        } catch (ex) {}
        if (!isOwnEmpty(datas)) {
            var data = encodeURIComponent(stringify(datas));
            var tempRequest = [business, datas, callback, option_server, extendArg];
            if (WebCollectConfig.getServerFlag) {
                fireRequest(business, data, callback, option_server, extendArg)
            } else {
                WebCollectConfig.requestList.push(tempRequest);
                clearTimeout(t);
                t = setTimeout(getServerTime(), 1e3)
            }
        } else {
            return
        }
    }
    try {
        if (apmCollectData && apmCollectData.length > 0) {
            for (var k = 0, len = apmCollectData.length; k < len; k++) {
                var fireLastdata = apmCollectData.pop();
                var encodefireLastdata = fireLastdata[1];
                init(fireLastdata[0], encodefireLastdata, fireLastdata[2], fireLastdata[3], fireLastdata[4])
            }
        }
    } catch (ex) {}
    window.newLogCount = init
})();