var NYTD = NYTD || {};
NYTD.Analytics = {};
NYTD.Hosts = NYTD.Hosts || (function() {
    return {
        imageHost: "http://i1.nyt.com",
        jsHost: "http://js.nyt.com",
        cssHost: "http://css.nyt.com",
        jsonHost: "http://json8.nytimes.com"
    };
})();

(function() {
    var windowLoaded = false;
    var document_scripts;
    if (window.addEventListener) {
        window.addEventListener("load", function() {
            windowLoaded = true;
        }, false);
    } else {
        if (window.attachEvent) {
            window.attachEvent("onload", function() {
                windowLoaded = true;
            });
        }
    }

    function scriptLoaded(src) {
        document_scripts = document_scripts || {};
        if (document_scripts[src]) {
            return true;
        } else {
            var script_tags = document.getElementsByTagName("script");
            for (var i = 0, script; script = script_tags[i]; i++) {
                if (script.src) {
                    document_scripts[script.src] = 1;
                }
            }
            if (document_scripts[src]) {
                return true;
            } else {
                return false;
            }
        }
    }

    NYTD.require = function(file, callback) {
        if (windowLoaded) {
            throw ("Cannot require file, document is already loaded");
        }
        var url = /^\/[^\/]/.test(file) ? NYTD.Hosts.jsHost + file : file;
        var force = arguments[arguments.length - 1] === true;
        var needsCallbackScriptTag;
        if (force || !scriptLoaded(url)) {
            document.write('<script src="' + url + '" type="text/javascript" charset="utf-8" onerror="throw(\'NYTD.require: An error occured: \' + this.src)"><\/script>');
            document_scripts[url] = 1;
            needsCallbackScriptTag = true;
        }
        if (typeof callback == "function") {
            if (document.addEventListener) {
                if (needsCallbackScriptTag) {
                    document.write('<script type="text/javascript" charset="utf-8">(' + callback.toString() + ")();<\/script>");
                } else {
                    window.setTimeout(function() {
                        callback();
                    }, 0);
                }
            } else {
                NYTD.require.callbacks = NYTD.require.callbacks || [];
                NYTD.require.callbacks.push(callback);
                NYTD.require.callbacks.count = (++NYTD.require.callbacks.count) || 0;
                document.write("<script id=__onAfterRequire" + NYTD.require.callbacks.count + " src=//:><\/script>");
                document.getElementById("__onAfterRequire" + NYTD.require.callbacks.count).onreadystatechange = function() {
                    if (this.readyState == "complete") {
                        this.onreadystatechange = null;
                        (NYTD.require.callbacks.pop())();
                        this.parentNode.removeChild(this);
                    }
                };
            }
        }
    };
})();

NYTD.asyncLoad = function(file, callback) {
    var url = /^\/[^\/]/.test(file) ? NYTD.Hosts.jsHost + file : file;
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = url;
    if (typeof callback === 'function') {
        scriptTag.onload = function(e) {
            callback();
        };

        scriptTag.onreadystatechange = function() {
            if (this.readyState === 'loaded' || this.readyState === 'complete') {
                callback();
            }
        };
    }
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
};

NYTD.Analytics.GoogleAnalytics = (function() {
    var googleAnalyticsTrackerID = {
        'Travel': 'UA-4406282-79',
        'Business': 'UA-4406282-80',
        'Health': 'UA-4406282-81'
    };

    var track = function() {
        var contentGroup = NYTD.Analytics.MetaData.get('CG');
        if (contentGroup !== '') {
            try {
                var pageTracker = _gat._getTracker(googleAnalyticsTrackerID[contentGroup]);
                pageTracker._trackPageview();
            } catch (err) {}
        }
    };

    var init = function() {
        var gaURL = (('https:' === document.location.protocol) ? 'https://ssl.' : 'http://www.') + 'google-analytics.com/ga.js';
        NYTD.asyncLoad(gaURL, track);
    };

    return {
        initialize: init
    };
});

function WebTrends() {
    var that = this;
    this.dcsid = "dcsym57yw10000s1s8g0boozt_9t1x";
    this.domain = "wt.o.nytimes.com";
    this.timezone = -5;
    this.fpcdom = ".nytimes.com";
    this.enabled = true;
    this.i18n = false;
    this.fpc = "WT_FPC";
    this.paidsearchparams = "gclid";
    this.splitvalue = "";
    this.preserve = false;
    this.DCS = {};
    this.WT = {};
    this.DCSext = {};
    this.images = [];
    this.index = 0;
    this.exre = (function() {
        return (window.RegExp ? new RegExp("dcs(uri)|(ref)|(aut)|(met)|(sta)|(sip)|(pro)|(byt)|(dat)|(p3p)|(cfg)|(redirect)|(cip)", "i") : "");
    })();
    this.re = (function() {
        return (window.RegExp ? (that.i18n ? {
            "%25": /\%/g,
            "%26": /\&/g
        } : {
            "%09": /\t/g,
            "%20": / /g,
            "%23": /\#/g,
            "%26": /\&/g,
            "%2B": /\+/g,
            "%3F": /\?/g,
            "%5C": /\\/g,
            "%22": /\"/g,
            "%7F": /\x7F/g,
            "%A0": /\xA0/g
        }) : "");
    })();
}

WebTrends.prototype.dcsGetId = function() {
    if (this.enabled && (document.cookie.indexOf(this.fpc + "=") == -1) && (document.cookie.indexOf("WTLOPTOUT=") == -1)) {
        document.write("<scr" + "ipt type='text/javascript' src='" + "http" + (window.location.protocol.indexOf("https:") == 0 ? "s" : "") + "://" + this.domain + "/" + this.dcsid + "/wtid.js" + "'></scr" + "ipt>");
    }
};

WebTrends.prototype.dcsGetCookie = function(name) {
    var cookies = document.cookie.split("; ");
    var cmatch = [];
    var idx = 0;
    var i = 0;
    var namelen = name.length;
    var clen = cookies.length;

    for (i = 0; i < clen; i++) {
        var c = cookies[i];
        if ((c.substring(0, namelen + 1)) == (name + "=")) {
            cmatch[idx++] = c;
        }
    }

    var cmatchCount = cmatch.length;
    if (cmatchCount > 0) {
        idx = 0;
        if ((cmatchCount > 1) && (name == this.fpc)) {
            var dLatest = new Date(0);
            for (i = 0; i < cmatchCount; i++) {
                var lv = parseInt(this.dcsGetCrumb(cmatch[i], "lv"));
                var dLst = new Date(lv);
                if (dLst > dLatest) {
                    dLatest.setTime(dLst.getTime());
                    idx = i;
                }
            }
        }
        return unescape(cmatch[idx].substring(namelen + 1));
    } else {
        return null;
    }
};

WebTrends.prototype.dcsGetCrumb = function(cval, crumb, sep) {
    var aCookie = cval.split(sep || ":");
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (crumb == aCrumb[0]) {
            return aCrumb[1];
        }
    }
    return null;
};

WebTrends.prototype.dcsGetIdCrumb = function(cval, crumb) {
    var id = cval.substring(0, cval.indexOf(":lv="));
    var aCrumb = id.split("=");
    for (var i = 0; i < aCrumb.length; i++) {
        if (crumb == aCrumb[0]) {
            return aCrumb[1];
        }
    }
    return null;
};

WebTrends.prototype.dcsIsFpcSet = function(name, id, lv, ss) {
    var c = this.dcsGetCookie(name);
    if (c) {
        return ((id == this.dcsGetIdCrumb(c, "id")) && (lv == this.dcsGetCrumb(c, "lv")) && (ss == this.dcsGetCrumb(c, "ss"))) ? 0 : 3;
    }
    return 2;
};

WebTrends.prototype.dcsFPC = function() {
    if (document.cookie.indexOf("WTLOPTOUT=") != -1) {
        return;
    }
    var WT = this.WT;
    var name = this.fpc;
    var dCur = new Date();
    var adj = (dCur.getTimezoneOffset() * 60000) + (this.timezone * 3600000);
    dCur.setTime(dCur.getTime() + adj);
    var dExp = new Date(dCur.getTime() + 315360000000);
    var dSes = new Date(dCur.getTime());
    WT.co_f = WT.vtid = WT.vtvs = WT.vt_f = WT.vt_f_a = WT.vt_f_s = WT.vt_f_d = WT.vt_f_tlh = WT.vt_f_tlv = "";
    if (document.cookie.indexOf(name + "=") == -1) {
        if ((typeof(gWtId) != "undefined") && (gWtId != "")) {
            WT.co_f = gWtId;
        } else {
            if ((typeof(gTempWtId) != "undefined") && (gTempWtId != "")) {
                WT.co_f = gTempWtId;
                WT.vt_f = "1";
            } else {
                WT.co_f = "2";
                var curt = dCur.getTime().toString();
                for (var i = 2; i <= (32 - curt.length); i++) {
                    WT.co_f += Math.floor(Math.random() * 16).toString(16);
                }
                WT.co_f += curt;
                WT.vt_f = "1";
            }
        } if (typeof(gWtAccountRollup) == "undefined") {
            WT.vt_f_a = "1";
        }
        WT.vt_f_s = WT.vt_f_d = "1";
        WT.vt_f_tlh = WT.vt_f_tlv = "0";
    } else {
        var c = this.dcsGetCookie(name);
        var id = this.dcsGetIdCrumb(c, "id");
        var lv = parseInt(this.dcsGetCrumb(c, "lv"));
        var ss = parseInt(this.dcsGetCrumb(c, "ss"));
        if ((id == null) || (id == "null") || isNaN(lv) || isNaN(ss)) {
            return;
        }
        WT.co_f = id;
        var dLst = new Date(lv);
        WT.vt_f_tlh = Math.floor((dLst.getTime() - adj) / 1000);
        dSes.setTime(ss);
        if ((dCur.getTime() > (dLst.getTime() + 1800000)) || (dCur.getTime() > (dSes.getTime() + 28800000))) {
            WT.vt_f_tlv = Math.floor((dSes.getTime() - adj) / 1000);
            dSes.setTime(dCur.getTime());
            WT.vt_f_s = "1";
        }
        if ((dCur.getDay() != dLst.getDay()) || (dCur.getMonth() != dLst.getMonth()) || (dCur.getYear() != dLst.getYear())) {
            WT.vt_f_d = "1";
        }
    }
    WT.co_f = escape(WT.co_f);
    WT.vtid = (typeof(this.vtid) == "undefined") ? WT.co_f : (this.vtid || "");
    WT.vtvs = (dSes.getTime() - adj).toString();
    var expiry = "; expires=" + dExp.toGMTString();
    var cur = dCur.getTime().toString();
    var ses = dSes.getTime().toString();
    document.cookie = name + "=" + "id=" + WT.co_f + ":lv=" + cur + ":ss=" + ses + expiry + "; path=/" + (((this.fpcdom != "")) ? ("; domain=" + this.fpcdom) : (""));
    var rc = this.dcsIsFpcSet(name, WT.co_f, cur, ses);
    if (rc != 0) {
        WT.co_f = WT.vtvs = WT.vt_f_s = WT.vt_f_d = WT.vt_f_tlh = WT.vt_f_tlv = "";
        if (typeof(this.vtid) == "undefined") {
            WT.vtid = "";
        }
        WT.vt_f = WT.vt_f_a = rc;
    }
};

WebTrends.prototype.dcsMultiTrack = function() {
    var args = dcsMultiTrack.arguments ? dcsMultiTrack.arguments : arguments;
    if (args.length % 2 == 0) {
        this.dcsSaveProps(args);
        this.dcsSetProps(args);
        var dCurrent = new Date();
        this.DCS.dcsdat = dCurrent.getTime();
        this.dcsFPC();
        this.dcsTag();
        this.dcsRestoreProps();
    }
};

WebTrends.prototype.dcsCleanUp = function() {
    this.DCS = {};
    this.WT = {};
    this.DCSext = {};
    if (arguments.length % 2 == 0) {
        this.dcsSetProps(arguments);
    }
};

WebTrends.prototype.dcsSetProps = function(args) {
    for (var i = 0; i < args.length; i += 2) {
        if (args[i].indexOf("WT.") == 0) {
            this.WT[args[i].substring(3)] = args[i + 1];
        } else {
            if (args[i].indexOf("DCS.") == 0) {
                this.DCS[args[i].substring(4)] = args[i + 1];
            } else {
                if (args[i].indexOf("DCSext.") == 0) {
                    this.DCSext[args[i].substring(7)] = args[i + 1];
                }
            }
        }
    }
};

WebTrends.prototype.dcsSaveProps = function(args) {
    var i, key, param;
    if (this.preserve) {
        this.args = [];
        for (i = 0; i < args.length; i += 2) {
            param = args[i];
            if (param.indexOf("WT.") == 0) {
                key = param.substring(3);
                this.args[i] = param;
                this.args[i + 1] = this.WT[key] || "";
            } else {
                if (param.indexOf("DCS.") == 0) {
                    key = param.substring(4);
                    this.args[i] = param;
                    this.args[i + 1] = this.DCS[key] || "";
                } else {
                    if (param.indexOf("DCSext.") == 0) {
                        key = param.substring(7);
                        this.args[i] = param;
                        this.args[i + 1] = this.DCSext[key] || "";
                    }
                }
            }
        }
    }
};

WebTrends.prototype.dcsRestoreProps = function() {
    if (this.preserve) {
        this.dcsSetProps(this.args);
        this.args = [];
    }
};

WebTrends.prototype.dcsAdv = function() {
    this.dcsFPC();
};

WebTrends.prototype.dcsVar = function() {
    var dCurrent = new Date();
    var WT = this.WT;
    var DCS = this.DCS;
    WT.tz = parseInt(dCurrent.getTimezoneOffset() / 60 * -1) || "0";
    WT.bh = dCurrent.getHours() || "0";
    WT.ul = navigator.appName == "Netscape" ? navigator.language : navigator.userLanguage;

    if (typeof(screen) == "object") {
        WT.cd = navigator.appName == "Netscape" ? screen.pixelDepth : screen.colorDepth;
        WT.sr = screen.width + "x" + screen.height;
    }

    if (typeof(navigator.javaEnabled()) == "boolean") {
        WT.jo = navigator.javaEnabled() ? "Yes" : "No";
    }

    if (document.title) {
        if (window.RegExp) {
            var tire = new RegExp("^" + window.location.protocol + "//" + window.location.hostname + "\\s-\\s");
            WT.ti = document.title.replace(tire, "");
        } else {
            WT.ti = document.title;
        }
    }

    WT.js = "Yes";
    WT.jv = (function() {
        var agt = navigator.userAgent.toLowerCase();
        var major = parseInt(navigator.appVersion);
        var mac = (agt.indexOf("mac") != -1);
        var ff = (agt.indexOf("firefox") != -1);
        var ff0 = (agt.indexOf("firefox/0.") != -1);
        var ff10 = (agt.indexOf("firefox/1.0") != -1);
        var ff15 = (agt.indexOf("firefox/1.5") != -1);
        var ff20 = (agt.indexOf("firefox/2.0") != -1);
        var ff3up = (ff && !ff0 && !ff10 & !ff15 & !ff20);
        var nn = (!ff && (agt.indexOf("mozilla") != -1) && (agt.indexOf("compatible") == -1));
        var nn4 = (nn && (major == 4));
        var nn6up = (nn && (major >= 5));
        var ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
        var ie4 = (ie && (major == 4) && (agt.indexOf("msie 4") != -1));
        var ie5up = (ie && !ie4);
        var op = (agt.indexOf("opera") != -1);
        var op5 = (agt.indexOf("opera 5") != -1 || agt.indexOf("opera/5") != -1);
        var op6 = (agt.indexOf("opera 6") != -1 || agt.indexOf("opera/6") != -1);
        var op7up = (op && !op5 && !op6);
        var jv = "1.1";

        if (ff3up) {
            jv = "1.8";
        } else {
            if (ff20) {
                jv = "1.7";
            } else {
                if (ff15) {
                    jv = "1.6";
                } else {
                    if (ff0 || ff10 || nn6up || op7up) {
                        jv = "1.5";
                    } else {
                        if ((mac && ie5up) || op6) {
                            jv = "1.4";
                        } else {
                            if (ie5up || nn4 || op5) {
                                jv = "1.3";
                            } else {
                                if (ie4) {
                                    jv = "1.2";
                                }
                            }
                        }
                    }
                }
            }
        }
        return jv;
    })();

    WT.ct = "unknown";
    if (document.body && document.body.addBehavior) {
        try {
            document.body.addBehavior("#default#clientCaps");
            WT.ct = document.body.connectionType || "unknown";
            document.body.addBehavior("#default#homePage");
            WT.hp = document.body.isHomePage(location.href) ? "1" : "0";
        } catch (e) {}
    }

    if (document.all) {
        WT.bs = document.body ? document.body.offsetWidth + "x" + document.body.offsetHeight : "unknown";
    } else {
        WT.bs = window.innerWidth + "x" + window.innerHeight;
    }

    WT.fv = (function() {
        var i, flash;
        if (window.ActiveXObject) {
            for (i = 15; i > 0; i--) {
                try {
                    flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    return i + ".0";
                } catch (e) {}
            }
        } else {
            if (navigator.plugins && navigator.plugins.length) {
                for (i = 0; i < navigator.plugins.length; i++) {
                    if (navigator.plugins[i].name.indexOf("Shockwave Flash") != -1) {
                        return navigator.plugins[i].description.split(" ")[2];
                    }
                }
            }
        }
        return "Not enabled";
    })();

    WT.slv = (function() {
        var slv = "Not enabled";
        try {
            if (navigator.userAgent.indexOf("MSIE") != -1) {
                var sli = new ActiveXObject("AgControl.AgControl");
                if (sli) {
                    slv = "Unknown";
                }
            } else {
                if (navigator.plugins["Silverlight Plug-In"]) {
                    slv = "Unknown";
                }
            }
        } catch (e) {}
        if (slv != "Not enabled") {
            var i, m, M, F;
            if ((typeof(Silverlight) == "object") && (typeof(Silverlight.isInstalled) == "function")) {
                for (i = 9; i > 0; i--) {
                    M = i;
                    if (Silverlight.isInstalled(M + ".0")) {
                        break;
                    }
                    if (slv == M) {
                        break;
                    }
                }
                for (m = 9; m >= 0; m--) {
                    F = M + "." + m;
                    if (Silverlight.isInstalled(F)) {
                        slv = F;
                        break;
                    }
                    if (slv == F) {
                        break;
                    }
                }
            }
        }
        return slv;
    })();

    if (this.i18n) {
        if (typeof(document.defaultCharset) == "string") {
            WT.le = document.defaultCharset;
        } else {
            if (typeof(document.characterSet) == "string") {
                WT.le = document.characterSet;
            } else {
                WT.le = "unknown";
            }
        }
    }

    WT.tv = "9.3.0";
    WT.sp = this.splitvalue;
    WT.dl = "0";
    WT.ssl = (window.location.protocol.indexOf("https:") == 0) ? "1" : "0";
    DCS.dcsdat = dCurrent.getTime();
    DCS.dcssip = window.location.hostname;
    DCS.dcsuri = window.location.pathname;
    WT.es = DCS.dcssip + DCS.dcsuri;
    if (window.location.search) {
        DCS.dcsqry = window.location.search;
    }
    if (DCS.dcsqry) {
        var dcsqry = DCS.dcsqry.toLowerCase();
        var params = this.paidsearchparams.length ? this.paidsearchparams.toLowerCase().split(",") : [];
        for (var i = 0; i < params.length; i++) {
            if (dcsqry.indexOf(params[i] + "=") != -1) {
                WT.srch = "1";
                break;
            }
        }
    }
    if ((window.document.referrer != "") && (window.document.referrer != "-")) {
        if (!(navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) < 4)) {
            DCS.dcsref = window.document.referrer;
        }
    }
};

WebTrends.prototype.dcsEscape = function(S, REL) {
    if (REL != "") {
        S = S.toString();
        for (var R in REL) {
            if (REL[R] instanceof RegExp) {
                S = S.replace(REL[R], R);
            }
        }
        return S;
    } else {
        return escape(S);
    }
};

WebTrends.prototype.dcsA = function(N, V) {
    if (this.i18n && (this.exre != "") && !this.exre.test(N)) {
        if (N == "dcsqry") {
            var newV = "";
            var params = V.substring(1).split("&");
            for (var i = 0; i < params.length; i++) {
                var pair = params[i];
                var pos = pair.indexOf("=");
                if (pos != -1) {
                    var key = pair.substring(0, pos);
                    var val = pair.substring(pos + 1);
                    if (i != 0) {
                        newV += "&";
                    }
                    newV += key + "=" + this.dcsEncode(val);
                }
            }
            V = V.substring(0, 1) + newV;
        } else {
            V = this.dcsEncode(V);
        }
    }
    return "&" + N + "=" + this.dcsEscape(V, this.re);
};

WebTrends.prototype.dcsEncode = function(S) {
    return (typeof(encodeURIComponent) == "function") ? encodeURIComponent(S) : escape(S);
};

WebTrends.prototype.dcsCreateImage = function(dcsSrc) {
    if (document.images) {
        this.images[this.index] = new Image();
        this.images[this.index].src = dcsSrc;
        this.index++;
    } else {
        document.write('<img alt="" border="0" name="DCSIMG" width="1" height="1" src="' + dcsSrc + '">');
    }
};

WebTrends.prototype.dcsMeta = function() {
    var elems;
    if (document.documentElement) {
        elems = document.getElementsByTagName("meta");
    } else {
        if (document.all) {
            elems = document.all.tags("meta");
        }
    } if (typeof(elems) != "undefined") {
        var length = elems.length;
        for (var i = 0; i < length; i++) {
            var name = elems.item(i).name;
            var content = elems.item(i).content;
            var equiv = elems.item(i).httpEquiv;
            if (name.length > 0) {
                if (name.toUpperCase().indexOf("WT.") == 0) {
                    this.WT[name.substring(3)] = content;
                } else {
                    if (name.toUpperCase().indexOf("DCSEXT.") == 0) {
                        this.DCSext[name.substring(7)] = content;
                    } else {
                        if (name.toUpperCase().indexOf("DCS.") == 0) {
                            this.DCS[name.substring(4)] = content;
                        }
                    }
                }
            }
        }
    }
};

WebTrends.prototype.dcsTag = function() {
    if (document.cookie.indexOf("WTLOPTOUT=") != -1) {
        return;
    }
    var WT = this.WT;
    var DCS = this.DCS;
    var DCSext = this.DCSext;
    var i18n = this.i18n;
    var P = "http" + (window.location.protocol.indexOf("https:") == 0 ? "s" : "") + "://" + this.domain + (this.dcsid == "" ? "" : "/" + this.dcsid) + "/dcs.gif?";
    if (i18n) {
        WT.dep = "";
    }
    for (var N in DCS) {
        if (DCS[N] && (typeof DCS[N] != "function")) {
            P += this.dcsA(N, DCS[N]);
        }
    }
    for (N in WT) {
        if (WT[N] && (typeof WT[N] != "function")) {
            P += this.dcsA("WT." + N, WT[N]);
        }
    }
    for (N in DCSext) {
        if (DCSext[N] && (typeof DCSext[N] != "function")) {
            if (i18n) {
                WT.dep = (WT.dep.length == 0) ? N : (WT.dep + ";" + N);
            }
            P += this.dcsA(N, DCSext[N]);
        }
    }
    if (i18n && (WT.dep.length > 0)) {
        P += this.dcsA("WT.dep", WT.dep);
    }
    if (P.length > 2048 && navigator.userAgent.indexOf("MSIE") >= 0) {
        P = P.substring(0, 2040) + "&WT.tu=1";
    }
    this.dcsCreateImage(P);
    this.WT.ad = "";
};

WebTrends.prototype.dcsDebug = function() {
    var t = this;
    var i = t.images[0].src;
    var q = i.indexOf("?");
    var r = i.substring(0, q).split("/");
    var m = "<b>Protocol</b><br><code>" + r[0] + "<br></code>";
    m += "<b>Domain</b><br><code>" + r[2] + "<br></code>";
    m += "<b>Path</b><br><code>/" + r[3] + "/" + r[4] + "<br></code>";
    m += "<b>Query Params</b><code>" + i.substring(q + 1).replace(/\&/g, "<br>") + "</code>";
    m += "<br><b>Cookies</b><br><code>" + document.cookie.replace(/\;/g, "<br>") + "</code>";
    if (t.w && !t.w.closed) {
        t.w.close();
    }
    t.w = window.open("", "dcsDebug", "width=500,height=650,scrollbars=yes,resizable=yes");
    t.w.document.write(m);
    t.w.focus();
};

WebTrends.prototype.dcsCollect = function() {
    if (this.enabled) {
        this.dcsVar();
        this.dcsMeta();
        this.dcsAdv();
        if (typeof(this.dcsCustom) == "function") {
            this.dcsCustom();
        }
        this.dcsTag();
    }
};

function dcsMultiTrack() {
    if (typeof(_tag) != "undefined") {
        return (_tag.dcsMultiTrack());
    }
}

function dcsDebug() {
    if (typeof(_tag) != "undefined") {
        return (_tag.dcsDebug());
    }
}

Function.prototype.wtbind = function(obj) {
    var method = this;
    var temp = function() {
        return method.apply(obj, arguments);
    };
    return temp;
};

NYTD.Analytics.WebTrends = new WebTrends();
NYTD.Analytics.WebTrends.dcsGetId();

(function() {
    NYTD.Analytics.WebTrends.fpcdom = (function() {
        var domainParts = document.location.hostname.split("."),
            partsLength = domainParts.length,
            fpcdom = (partsLength >= 2) ? "." + domainParts[partsLength - 2] + "." + domainParts[partsLength - 1] : "";
        return fpcdom;
    })();
    var originalDcsVar = NYTD.Analytics.WebTrends.dcsVar;
    NYTD.Analytics.WebTrends.dcsVar = function() {
        originalDcsVar.apply(NYTD.Analytics.WebTrends);
        NYTD.Analytics.WebTrends.DCS.dcssip = (function(hostname) {
            if (/^http:\/\/(s?www[239]?\.)?(partners\.)?(nyt|(newyork|ny)?times(ontheweb)?)\.(com\.?|net)\/(index\.html|pages|nojavascript|home|yr\/mo\/day)?\/?$/.test(hostname)) {
                return "http://www.nytimes.com";
            } else {
                return hostname;
            }
        })(window.location.hostname);
        NYTD.Analytics.WebTrends.WT.es = NYTD.Analytics.WebTrends.DCS.dcssip + NYTD.Analytics.WebTrends.DCS.dcsuri;
    };
    window.dcsMultiTrack = function() {
        NYTD.Analytics.WebTrends.dcsMultiTrack.apply(NYTD.Analytics.WebTrends, arguments);
        NYTD.Analytics.WebTrends.dcsCleanUp();
        NYTD.Analytics.WebTrends.dcsVar();
        NYTD.Analytics.WebTrends.dcsMeta();
        NYTD.Analytics.WebTrends.dcsAdv();
    };
})();

var s_code_linktrack = function(desc) {
    try {
        dcsMultiTrack("DCS.dcssip", "www.nytimes.com", "DCS.dcsuri", "/" + desc + ".html", "WT.ti", desc, "WT.z_dcsm", "1");
    } catch (err) {}
};

var s_code_linktrack_classifieds = s_code_linktrack;
var s_code_linktrack_indiv = s_code_linktrack;
NYTD.Analytics.PageData = (function() {
    var i, len, parts, key, value, name, cur;
    var queryParams = {};
    var queryString = document.location.search;
    if (queryString !== "") {
        queryString = queryString.slice(1);
        var pairs = queryString.split("&");
        for (i = 0, len = pairs.length; i < len; ++i) {
            parts = pairs[i].split("=");
            key = parts[0];
            value = parts[1] || "";
            queryParams[key] = value;
        }
    }

    var cookies = {};
    var cookiePairs = document.cookie.split("; ");
    for (i = 0, len = cookiePairs.length; i < len; ++i) {
        cur = cookiePairs[i];
        parts = cur.split("=");
        name = parts[0];
        value = parts[1] || "";
        cookies[name] = value;
    }

    return {
        url: document.URL,
        domain: document.domain,
        path: document.location.pathname,
        query: function(key) {
            return queryParams[key] || "";
        },
        cookies: function(name) {
            return cookies[name] || "";
        }
    };
})();

NYTD.Analytics.MetaData = (function() {
    var metaTagReferences, originalMetaData, metaValueUpdates, metaDataToSet;
    var initialize = function() {
        metaTagReferences = {};
        originalMetaData = {};
        metaValueUpdates = {};
        metaDataToSet = {};
        var metaTags = document.getElementsByTagName("meta");
        for (var i = 0, count = metaTags.length; i < count; ++i) {
            var currentTag = metaTags[i];
            var key = currentTag.getAttribute("name");
            var val = currentTag.getAttribute("content");
            if (key !== null) {
                originalMetaData[key] = val;
                metaTagReferences[key] = currentTag;
            }
        }
    };

    var reset = initialize;
    var getMetaData = function(key) {
        var retVal = originalMetaData[key] || "";
        return retVal;
    };

    var addMetaData = function(key, val) {
        if (key === "") {
            return;
        }
        if (!metaTagReferences[key] && !NYTD.Analytics.PageData.query(key) && val !== "") {
            metaDataToSet[key] = val;
        } else {
            if (originalMetaData[key]) {
                metaValueUpdates[key] = val;
            }
        }
        originalMetaData[key] = val;
    };

    var writeMetaTags = function() {
        var key;
        for (key in metaValueUpdates) {
            if (metaValueUpdates.hasOwnProperty(key)) {
                metaTagReferences[key].setAttribute("content", metaValueUpdates[key]);
            }
        }
        var fragment = document.createDocumentFragment();
        for (key in metaDataToSet) {
            if (metaDataToSet.hasOwnProperty(key)) {
                var elem = document.createElement("meta");
                elem.setAttribute("name", key);
                elem.setAttribute("content", metaDataToSet[key]);
                fragment.appendChild(elem);
            }
        }
        var headTag = document.getElementsByTagName("head")[0];
        headTag.appendChild(fragment);
    };

    initialize();
    return {
        get: getMetaData,
        add: addMetaData,
        flush: function() {
            writeMetaTags();
            reset();
        }
    };
})();

NYTD.Analytics.Mappings = {
    defaultDcsid: "dcsym57yw10000s1s8g0boozt_9t1x",
    dcsidMap: {
        "AP/Reuters": "dcs15dnk9100004r7jamfwu0p_3v8n",
        "Archive": "dcssxc7tw10000ggrcqca1cbr_1v1i",
        "Arts": "dcsnu1k8n00000oi2prv9fbeo_2w5s",
        "Autos": "dcs3i2ttw0000043xyk839ceo_2v6n",
        "Blogrunner": "dcs9rqdr610000082j6e7xceo_1c8r",
        "Books": "dcss90tjf00000knzmux6hbeo_8r8y",
        "Business": "dcsc32upj10000c58n7kgpaeo_8i3g",
        "Cartoons": "dcsc1dh4600000oiajcqd9eeo_9l2m",
        "Cartoons / Humor": "dcsc1dh4600000oiajcqd9eeo_9l2m",
        "Classifieds": "dcso5eb2r10000cpz9bq5cceo_3j5e",
        "Crosswords/Games": "dcsepujaa100000s5bq9bpceo_7w6k",
        "Dance": "dcs9ihxq600000w842mebkbeo_9r6q",
        "Digital Subscription": "dcsv96qcv000008alp4trgo0q_7h8h",
        "Email This": "dcsy6xxc210000g07639fkkvs_7b7o",
        "General": "dcsym57yw10000s1s8g0boozt_9t1x",
        "Great Homes": "dcszwassu10000w8cogv42y86_8h8v",
        "Health": "dcsfj6l0t100008ijt0irzaeo_2k8f",
        "Homepage": "dcsa5pgfq10000c9zuysqk0lm_6i8y",
        "Home Delivery": "dcsbnggae10000kbq7blis7nn_6g9j",
        "Home Delivery Acquisition": "dcsio1db9100004n4exgb9o0q_6o3k",
        "Jobs": "dcsxmnyde100000oerlyk5ceo_6k5k",
        "Knowledge Network": "dcs69r7oi100004nscorwmdeo_7r4i",
        "Learning Network": "dcslh0e4x00000ggzmnn3ldeo_6f8k",
        "Member Center": "dcst9xior10000wo45l9anceo_4u9e",
        "Most Popular": "dcsvmgcs910000o2ubv1z1deo_8b5s",
        "Movies": "dcsyoaqvl00000wc34qfambeo_4q3b",
        "Multimedia": "dcsvs34dy000000chtbmk7eeo_3f9p",
        "Music": "dcsrioyse100000kjghaqubeo_2d4x",
        "MyTimes": "dcsctlxlp10000chdjl4jlceo_2d1n",
        "N.Y./Region": "dcsj5tb4n100000sl76culaeo_4f3w",
        "News Tracker": "dcsa1h2mn00000oacf4of5eeo_5f2m",
        "Olympics": "dcs3oivag100004zd9xgx1mfh_4f9w",
        "Opinion": "dcs5ydwfq100008me456mabeo_1z2v",
        "Politics": "dcsa23rmv10000wowiejpwx86_4v7j",
        "Real Estate": "dcsuvvccp000000sdtpzj7ceo_3j2x",
        "Science": "dcsaon9rw0000008ifmgqtaeo_2f9c",
        "Search": "dcsmcntzl00000wwyhty30deo_8o2v",
        "Self Service": "dcs1tovv3100004rjcdl3h79j_7p9f",
        "Sports": "dcss4vytr000000kbuy6j8beo_6f7s",
        "Style": "dcs2dla2i00000431qkl70ceo_3j4r",
        "Sunday Magazine": "dcsrmsj6n10000wok933qrceo_1x8d",
        "T:Style": "dcs31c2fd10000w8wjmo22ceo_5x6n",
        "Technology": "dcs591klg00000c97pblfraeo_7p3p",
        "Theater": "dcsxl9f4810000oub8mfiybeo_5l8v",
        "TimesSelect": "dcsqdkcdj100004zt5huzfceo_3b7v",
        "Times File": "dcs91tz2300000c1p17hs3eeo_4o7e",
        "Times Topics": "dcs3baftr1000008q5oxvjceo_4r9g",
        "Travel": "dcsktwey810000kfp9nsv3ceo_6n1r",
        "TV": "dcsghn1j900000gs8yfgfwbeo_3r9l",
        "U.S.": "dcsypfq3j00000gsclwfljaeo_6i3w",
        "Video": "dcs1j460r100008uw7es2eceo_6c4w",
        "Weather": "dcsker4wf10000wszj8b32eeo_4m7u",
        "Week In Review": "dcsvfceih10000o610i65qdeo_7y5r",
        "Widget": "dcsoy2de300000ch9g4qg9oct_9j4x",
        "World": "dcspjt2na00000wcnvo8wdaeo_7q9o"
    },
    contentGroupMap: {
        "aponline": "AP/Reuters",
        "arts": "Arts",
        "automobiles": "Autos",
        "books": "Books",
        "business": "Business",
        "Business Day": "Business",
        "crosswords": "Crosswords/Games",
        "dining": "Style",
        "education": "U.S.",
        "fashion": "Style",
        "garden": "Style",
        "greathomesanddestinations": "Great Homes",
        "health": "Health",
        "jobs": "Jobs",
        "magazine": "Sunday Magazine",
        "movies": "Movies",
        "multimedia": "General",
        "nyregion": "N.Y./Region",
        "olympics": "Olympics",
        "opinion": "Opinion",
        "podcasts": "General",
        "publiceditor": "Opinion",
        "realestate": "Real Estate",
        "reuters": "AP/Reuters",
        "science": "Science",
        "sports": "Sports",
        "style": "Style",
        "t-magazine": "T:Style",
        "technology": "Technology",
        "theater": "Theater",
        "timestopics": "Times Topics",
        "todayspaper": "General",
        "travel": "Travel",
        "us": "U.S.",
        "washington": "U.S.",
        "weekinreview": "Week in Review",
        "world": "World"
    },
    subcontentGroupMap: {
        "africa": "Africa",
        "americas": "Americas",
        "asia": "Asia Pacific",
        "autoreviews": "New Cars",
        "baseball": "Baseball",
        "basketball": "Pro Basketball",
        "bestseller": "Best-Seller Lists",
        "boxoffice": "Box Office",
        "broadway": "Broadway",
        "chapters": "First Chapters",
        "collectibles": "Collectibles",
        "contributors": "Contributors",
        "commercial": "Commercial",
        "communities": "Communities",
        "criticspicks": "Critics Pick",
        "culture": "Culture",
        "currentreleases": "In Theaters",
        "dealbookjobs": "Dealbook Jobs",
        "design": "Design",
        "dining": "Dining",
        "earth": "Environment",
        "editorials": "Editorials",
        "education": "Education",
        "europe": "Europe",
        "fashion": "Fashion",
        "food": "Food",
        "football": "Pro Football",
        "garden": "Home and Garden",
        "golf": "Golf",
        "guide": "Health Guide",
        "hockey": "Hockey",
        "homevideo": "On DVD",
        "london": "London",
        "media": "Media and Advertising",
        "mens-fashion": "Men's Fashion",
        "middleeast": "Middle East",
        "ncaabasketball": "College Basketball",
        "ncaafootball": "College Football",
        "nutrition": "Fitness and Nutrition",
        "nyregionopinions": "NY/Region Opinions",
        "nyregionspecial2": "The Region",
        "offbroadway": "Off Broadway",
        "offoffbroadway": "Off Off Broadway",
        "othersports": "Other Sports",
        "personaltech": "Personal Tech",
        "podcasts": "Podcasts",
        "policy": "Money and Policy",
        "research": "Research",
        "review": "Sunday Book Review",
        "reviews": "Reviews",
        "smallbusiness": "Small Business",
        "soccer": "Soccer",
        "space": "Space and Cosmos",
        "tennis": "Tennis",
        "thecity": "The City",
        "tmagazine": "T Magazine",
        "travel": "Travel",
        "views": "Views",
        "washington": "Washington",
        "weddings": "Weddings",
        "womens-fashion": "Women's Fashion",
        "worldbusiness": "World Business",
        "yourmoney": "Your Money"
    }
};

NYTD.Analytics.Rules = {
    getContentGroup: function(url, domain, path) {
        var contentGroup = NYTD.Analytics.MetaData.get("contentGroup");
        if (contentGroup === "") {
            if (/^http:\/\/(www\.)?(nytimes|times)\.com\/(\/|index\.html|pages\/|pages\/partners\/aol\/homepage\/|yr\/mo\/day\/)?$/.test(url)) {
                contentGroup = "Homepage";
            } else {
                if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/\b(world|international)\b\//.test(path) || /^\/international\//.test(path) || /\/packages\/html\/\b(world|international)\b\//.test(path) || /^\/\b(pages|ref|reuters|aponline|cfr)\b\/world\//.test(path)) {
                    contentGroup = "World";
                } else {
                    if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/\b(us\/politics|politics)\b\//.test(path) || /\/packages\/html\/politics\//.test(path) || /^\/pages\/politics\//.test(path) || /^\/yr\/mo\/day\/politics\//.test(path) || /^\/politics\//.test(path) || /^\/ref\/politics\//.test(path) || /^\/ref\/us\/politics\//.test(path) || /\/election-guide\//.test(path)) {
                        contentGroup = "Politics";
                    } else {
                        if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/\b(us|education|washington|national)\b\//.test(path) || /\/packages\/html\/\b(us|education|washington|national)\b\//.test(path) || /^\/pages\/\b(us|education|washington|national)\b\//.test(path) || /^\/yr\/mo\/day\/\b(us|education|washington|national)\b\//.test(path) || /^\/\b(us|education|washington|national)\b\//.test(path) || /^\/aponline\/us\//.test(path) || /^\/reuters\/us\//.test(path) || /^\/ref\/\b(us|education|washington|national)\b\//.test(path) || /^\/cq\//.test(path)) {
                            contentGroup = "U.S.";
                        } else {
                            if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/nyregion\//.test(path) || /^\/packages\/khtml\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/nyregion\//.test(path) || /\/packages\/html\/nyregion\//.test(path) || /^\/pages\/nyregion\//.test(path)) {
                                contentGroup = "N.Y./Region";
                            } else {
                                if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/business\//.test(path) || /\/packages\/html\/business\//.test(path) || /^\/pages\/business\//.test(path) || /^\/yr\/mo\/day\/business\//.test(path) || /^\/business\//.test(path) || /^\/aponline\/business\//.test(path) || /^\/reuters\/business\//.test(path) || /^\/ref\/business\//.test(path) || /^\/allbusiness\//.test(path) || /^\/inc_com\//.test(path)) {
                                    contentGroup = "Business";
                                } else {
                                    if (domain == "tech.nytimes.com" || domain == "tech2.nytimes.com" || domain == "download.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/technology\//.test(path) || /\/packages\/html\/technology\//.test(path) || /^\/pages\/technology\//.test(path) || /^\/tech\//.test(path) || /^\/aponline\/technology\//.test(path) || /^\/reuters\/technology\//.test(path) || /^\/ref\/technology\//.test(path) || /^\/pages\/cnet\//.test(path) || /^\/cnet\//.test(path) || /^\/paidcontent\//.test(path) || /^\/idg\//.test(path) || (/^\/gst\/fullpage\.html/.test(path) && NYTD.Analytics.PageData.query("sec") == "technology")) {
                                        contentGroup = "Technology";
                                    } else {
                                        if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/science\//.test(path) || /\/packages\/html\/science\//.test(path) || /^\/ref\/science\//.test(path) || /^\/pages\/science\//.test(path)) {
                                            contentGroup = "Science";
                                        } else {
                                            if (domain == "health.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/health\//.test(path) || /\/packages\/html\/health\//.test(path) || /^\/pages\/health\//.test(path) || /^\/aponline\/health\//.test(path) || /^\/reuters\/health\//.test(path) || /^\/ref\/health\//.test(path)) {
                                                contentGroup = "Health";
                                            } else {
                                                if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/sports\//.test(path) || /\/packages\/html\/sports\//.test(path) || /^\/yr\/mo\/day\/sports\//.test(path) || /^\/sports\//.test(path) || /^\/pages\/sports\//.test(path) || /^\/aponline\/sports\//.test(path) || /^\/reuters\/sports\//.test(path)) {
                                                    contentGroup = "Sports";
                                                } else {
                                                    if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/opinion\//.test(path) || /\/packages\/html\/opinion\//.test(path) || /^\/pages\/opinion\//.test(path) || /^\/pages\/readersopinions\//.test(path) || /^\/opinion\//.test(path) || /^\/top\/opinion\//.test(path) || /^\/ref\/opinion\//.test(path)) {
                                                        contentGroup = "Opinion";
                                                    } else {
                                                        if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/books\//.test(path) || /\/packages\/html\/books\//.test(path) || /^\/pages\/books\//.test(path) || /^\/ref\/books\//.test(path)) {
                                                            contentGroup = "Books";
                                                        } else {
                                                            if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/arts\/dance\//.test(path) || /\/packages\/html\/dance\//.test(path) || /^\/pages\/arts\/dance\//.test(path)) {
                                                                contentGroup = "Dance";
                                                            } else {
                                                                if (domain == "movies.nytimes.com" || domain == "movies2.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/movies\//.test(path) || /\/packages\/html\/movies\//.test(path) || /^\/pages\/movies\//.test(path) || /^\/ref\/movies\//.test(path)) {
                                                                    contentGroup = "Movies";
                                                                } else {
                                                                    if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/arts\/music\//.test(path) || /\/packages\/html\/music\//.test(path) || /^\/pages\/arts\/music\//.test(path)) {
                                                                        contentGroup = "Music";
                                                                    } else {
                                                                        if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/arts\/television\//.test(path) || /\/packages\/html\/television\//.test(path) || /^\/pages\/arts\/television\//.test(path)) {
                                                                            contentGroup = "TV";
                                                                        } else {
                                                                            if (domain == "theater.nytimes.com" || domain == "theater2.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/theater\//.test(path) || /\/mem\/theater\//.test(path) || /\/mem\/ticketwatch\.html/.test(path) || /\/packages\/html\/theater\//.test(path) || /^\/pages\/theater\//.test(path) || /^\/readersreviews\/theater\//.test(path)) {
                                                                                contentGroup = "Theater";
                                                                            } else {
                                                                                if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/arts\//.test(path) || /\/packages\/html\/arts\//.test(path) || /^\/aponline\/arts\//.test(path) || /^\/reuters\/arts\//.test(path) || /^\/pages\/arts\//.test(path)) {
                                                                                    contentGroup = "Arts";
                                                                                } else {
                                                                                    if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/style\/\b(t|tmagazine)\b\//.test(path) || /^\/pages\/style\/(t|tmagazine)\//.test(path)) {
                                                                                        contentGroup = "T:Style";
                                                                                    } else {
                                                                                        if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/\b(style|fashion|dining|garden)\b\//.test(path) || /\/packages\/html\/\b(style|fashion|dining|garden)\b\//.test(path) || /^\/pages\/\b(style|fashion|dining|garden)\b\//.test(path) || /^\/ref\/fashion\//.test(path)) {
                                                                                            contentGroup = "Style";
                                                                                        } else {
                                                                                            if (domain == "travel.nytimes.com" || domain == "travel2.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/travel\//.test(path) || /^\/pages\/travel\//.test(path) || /^\/travel\//.test(path) || /^\/map\/travel\//.test(path) || /^\/packages\/html\/travel\//.test(path) || /^\/gst\/travel\/travsearch\.html/.test(path) || (/^\/gst\/fullpage\.html/.test(path) && NYTD.Analytics.PageData.query("sec") == "travel")) {
                                                                                                contentGroup = "Travel";
                                                                                            } else {
                                                                                                if (domain == "jobmarket.nytimes.com" || domain == "salary.nytimes.com" || /\/packages\/html\/jobs\//.test(path) || /^\/pages\/jobs\//.test(path) || /^\/marketing\/jobmarket\//.test(path)) {
                                                                                                    contentGroup = "Jobs";
                                                                                                } else {
                                                                                                    if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/\b(realestate\/greathomes|greathomesanddestinations)\b\//.test(path) || /^\/pages\/great-homes-and-destinations\//.test(path) || /^\/pages\/greathomes\//.test(path) || /^\/top\/great-homes-and-destinations\//.test(path)) {
                                                                                                        contentGroup = "Real Estate";
                                                                                                    } else {
                                                                                                        if (domain == "realestate.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/realestate\//.test(path) || /\/packages\/html\/realestate\//.test(path) || /^\/pages\/realestate\//.test(path) || /^\/ref\/realestate\//.test(path)) {
                                                                                                            contentGroup = "Real Estate";
                                                                                                        } else {
                                                                                                            if (domain == "autos.nytimes.com" || domain == "collectiblecars.nytimes.com" || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/automobiles\//.test(path) || /^\/pages\/automobiles\//.test(path) || /^\/ref\/automobiles\//.test(path) || /^\/automobiles\//.test(path) || /^\/autos\//.test(path) || /^\/packages\/html\/automobiles\//.test(path)) {
                                                                                                                contentGroup = "Autos";
                                                                                                            } else {
                                                                                                                if (/^\/search\/query/.test(path)) {
                                                                                                                    contentGroup = "Search";
                                                                                                                } else {
                                                                                                                    if (domain == "listings.nytimes.com" || domain == "placead.nytimes.com" || /^\/top\/classifieds\//.test(path) || /^\/gst\/personals.html/.test(path)) {
                                                                                                                        contentGroup = "Classifieds";
                                                                                                                    } else {
                                                                                                                        if (domain == "video.on.nytimes.com") {
                                                                                                                            contentGroup = "Video";
                                                                                                                        } else {
                                                                                                                            if (/^\/top\/reference\/timestopics\//.test(path) || /^\/top\/news\/business\//.test(path) || /^\/top\/news\/international\//.test(path) || /^\/top\/news\/national\//.test(path) || /^\/top\/classifieds\/realestate\//.test(path)) {
                                                                                                                                contentGroup = "Times Topics";
                                                                                                                            } else {
                                                                                                                                if (/^\/mem\/emailthis.html/.test(path)) {
                                                                                                                                    contentGroup = "Email This";
                                                                                                                                } else {
                                                                                                                                    if (/^\/mem\/tnt.html/.test(path)) {
                                                                                                                                        contentGroup = "News Tracker";
                                                                                                                                    } else {
                                                                                                                                        if (/^\/membercenter\//.test(path) || /^\/mem\/email\.html/.test(path) || /^\/mem\/profile\.html/.test(path) || /^\/ref\/membercenter\//.test(path) || /^\/auth\/login/.test(path) || /^\/forgot/.test(path) || /^\/commerce\/jsp\//.test(path) || /^\/gst\/(regi|forgot|confirmem|betamail|signout|purchase_gc)\.html/.test(path)) {
                                                                                                                                            contentGroup = "Member Center";
                                                                                                                                        } else {
                                                                                                                                            if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/crosswords\//.test(path) || /^\/pages\/crosswords\//.test(path) || /^\/ref\/crosswords\//.test(path) || /^\/premium\/xword\//.test(path) || /^\/premiumproducts\/crosswords\/index.html/.test(path)) {
                                                                                                                                                contentGroup = "Crosswords/Games";
                                                                                                                                            } else {
                                                                                                                                                if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/magazine\//.test(path) || /^\/pages\/magazine\//.test(path) || /^\/ref\/magazine\//.test(path) || /^\/packages\/html\/magazine\//.test(path)) {
                                                                                                                                                    contentGroup = "Sunday Magazine";
                                                                                                                                                } else {
                                                                                                                                                    if (/^\/gst\/most(popular|emailed|blogged|searched|popularmovies)\.html/.test(path)) {
                                                                                                                                                        contentGroup = "Most Popular";
                                                                                                                                                    } else {
                                                                                                                                                        if (/^\/learning\//.test(path) || /\/packages\/html\/learning\//.test(path)) {
                                                                                                                                                            contentGroup = "Learning Network";
                                                                                                                                                        } else {
                                                                                                                                                            if (domain == "college.nytimes.com" || /\/packages\/html\/college\//.test(path) || /^\/college\//.test(path) || /\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/college\//.test(path)) {
                                                                                                                                                                contentGroup = "Knowledge Network";
                                                                                                                                                            } else {
                                                                                                                                                                if (/\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/weekinreview\//.test(path) || /\/packages\/html\/weekinreview\//.test(path) || /^\/pages\/weekinreview\//.test(path) || /^\/weekinreview\//.test(path)) {
                                                                                                                                                                    contentGroup = "Week In Review";
                                                                                                                                                                } else {
                                                                                                                                                                    if (/^\/gst\/weather.html/.test(path) || /^\/mem\/weather.html/.test(path) || /\/packages\/html\/weather\//.test(path) || /^\/weather/.test(path)) {
                                                                                                                                                                        contentGroup = "Weather";
                                                                                                                                                                    } else {
                                                                                                                                                                        if (/^\/pages\/multimedia\//.test(path) || /\/packages\/html\/multimedia\//.test(path) || /^\/ref\/multimedia\//.test(path)) {
                                                                                                                                                                            contentGroup = "Multimedia";
                                                                                                                                                                        } else {
                                                                                                                                                                            if (/^\/pages\/cartoons\//.test(path) || /\/packages\/html\/cartoons\//.test(path)) {
                                                                                                                                                                                contentGroup = "Cartoons";
                                                                                                                                                                            } else {
                                                                                                                                                                                if (/^\/pages\/\b(aponline|reuters)\b\//.test(path)) {
                                                                                                                                                                                    contentGroup = "AP/Reuters";
                                                                                                                                                                                } else {
                                                                                                                                                                                    if (/^\/slideshow\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/nytfrontpage\//.test(path)) {
                                                                                                                                                                                        contentGroup = "Homepage";
                                                                                                                                                                                    } else {
                                                                                                                                                                                        if (domain == "nytimes.adready.com") {
                                                                                                                                                                                            contentGroup = "Self Service";
                                                                                                                                                                                        } else {
                                                                                                                                                                                            contentGroup = "General";
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return contentGroup;
    },
    readPageTags: function() {
        NYTD.Analytics.MetaData.add("WT.z_gpt", NYTD.Analytics.MetaData.get("PT"));
        NYTD.Analytics.MetaData.add("WT.z_gpst", NYTD.Analytics.MetaData.get("PST"));
        NYTD.Analytics.MetaData.add("WT.z_gpsst", NYTD.Analytics.MetaData.get("PSST"));
        NYTD.Analytics.MetaData.add("WT.z_gpssst", NYTD.Analytics.MetaData.get("PSSST"));
        NYTD.Analytics.MetaData.add("WT.z_pc", NYTD.Analytics.MetaData.get("PC"));
        NYTD.Analytics.MetaData.add("WT.z_ps", NYTD.Analytics.MetaData.get("PS"));
        NYTD.Analytics.MetaData.add("WT.z_puv", NYTD.Analytics.MetaData.get("PUV"));
        NYTD.Analytics.MetaData.add("WT.z_gosst", NYTD.Analytics.MetaData.get("GOOST"));
        NYTD.Analytics.MetaData.add("WT.z_gosst", NYTD.Analytics.MetaData.get("GOSST"));
        NYTD.Analytics.MetaData.add("WT.z_gsac", NYTD.Analytics.MetaData.get("GSAC"));
        NYTD.Analytics.MetaData.add("WT.z_gtn", NYTD.Analytics.MetaData.get("GTN"));
        NYTD.Analytics.MetaData.add("WT.gcom", NYTD.Analytics.MetaData.get("GCOM"));
        NYTD.Analytics.MetaData.add("WT.z_clmst", NYTD.Analytics.MetaData.get("CLMST"));
        NYTD.Analytics.MetaData.add("WT.z_bn", NYTD.Analytics.MetaData.get("BN"));
        NYTD.Analytics.MetaData.add("WT.z_pud", NYTD.Analytics.MetaData.get("PUD"));
        NYTD.Analytics.MetaData.add("WT.z_tvt", NYTD.Analytics.MetaData.get("TVT"));
        NYTD.Analytics.MetaData.add("WT.z_tvn", NYTD.Analytics.MetaData.get("TVN"));
        NYTD.Analytics.MetaData.add("WT.z_tvid", NYTD.Analytics.MetaData.get("TVID"));
        NYTD.Analytics.MetaData.add("WT.z_tDest", NYTD.Analytics.MetaData.get("TDES"));
        NYTD.Analytics.MetaData.add("WT.z_tRegion", NYTD.Analytics.MetaData.get("TDREG"));
        NYTD.Analytics.MetaData.add("WT.cre", NYTD.Analytics.MetaData.get("cre"));
        NYTD.Analytics.MetaData.add("WT.z_nyts", NYTD.Analytics.PageData.cookies("NYT-S"));
        NYTD.Analytics.MetaData.add("WT.z_nytd", NYTD.Analytics.PageData.cookies("nyt-d"));
        NYTD.Analytics.MetaData.add("WT.z_rmid", NYTD.Analytics.PageData.cookies("RMID"));
        NYTD.Analytics.MetaData.add("WT.z_gblc", NYTD.Analytics.MetaData.get("GBLC"));
        NYTD.Analytics.MetaData.add("WT.z_hpt", NYTD.Analytics.MetaData.get("HPT"));
    },

    setContentInfo: function(contentGroup) {
        var path = NYTD.Analytics.PageData.path;
        var url = NYTD.Analytics.PageData.url;
        var subcontentGroup = NYTD.Analytics.MetaData.get("WT.cg_s");
        var pageType = NYTD.Analytics.MetaData.get("WT.z_gpt");
        var pageSubType = NYTD.Analytics.MetaData.get("WT.z_gpst");

        if (contentGroup == "Health") {
            NYTD.Analytics.MetaData.add("WT.z_hgst", NYTD.Analytics.MetaData.get("HGST"));
            NYTD.Analytics.MetaData.add("WT.z_hgsn", NYTD.Analytics.MetaData.get("HGSN"));
            NYTD.Analytics.GoogleAnalytics.initialize();
        } else {
            if (contentGroup == "Times Topics") {
                NYTD.Analytics.MetaData.add("WT.z_gpt", "Topic");
            } else {
                if (contentGroup == "Books") {
                    NYTD.Analytics.MetaData.add("WT.z_bper", NYTD.Analytics.MetaData.get("per"));
                    NYTD.Analytics.MetaData.add("WT.z_ebk", NYTD.Analytics.MetaData.get("ttl"));
                } else {
                    if (contentGroup == "Real Estate" || contentGroup == "Great Homes") {
                        NYTD.Analytics.MetaData.add("WT.z_resz", NYTD.Analytics.MetaData.get("RESZ"));
                        NYTD.Analytics.MetaData.add("WT.z_res", NYTD.Analytics.MetaData.get("RES"));
                        NYTD.Analytics.MetaData.add("WT.z_reco", NYTD.Analytics.MetaData.get("RECO"));
                        NYTD.Analytics.MetaData.add("WT.z_rer", NYTD.Analytics.MetaData.get("RER"));
                    } else {
                        if (contentGroup == "Theater") {
                            NYTD.Analytics.MetaData.add("WT.z_eplay", NYTD.Analytics.MetaData.get("ttl"));
                        } else {
                            if (contentGroup == "Travel") {
                                if (subcontentGroup === "") {
                                    if (/\/travel\/escapes\//.test(path)) {
                                        subcontentGroup = "Escapes";
                                    } else {
                                        if (/\/travel\/tmagazine\//.test(url)) {
                                            subcontentGroup = "T Travel";
                                        }
                                    }
                                }
                                NYTD.Analytics.MetaData.add("WT.cg_s", subcontentGroup);
                                var pageSubSubType = NYTD.Analytics.MetaData.get("WT.z_gpsst");
                                var pageSubSubSubType = NYTD.Analytics.MetaData.get("WT.z_gpssst");
                                var metaTom = NYTD.Analytics.MetaData.get("tom");
                                var metaCol = NYTD.Analytics.MetaData.get("col");
                                if (pageType == "Article" && pageSubType == "News") {
                                    if (metaCol !== "") {
                                        pageSubSubType = metaCol;
                                    } else {
                                        if (/\/travel\/escapes\//.test(path)) {
                                            pageSubSubType = "Escapes";
                                        } else {
                                            if (/\/travel\/tmagazine\//.test(path)) {
                                                pageSubSubType = "T Travel";
                                            }
                                        }
                                    }
                                }
                                if (pageType === "" || pageType == "Other") {
                                    if (/^http:\/\/travel\.nytimes\.com\/$/.test(url) || /^\/pages\/travel\/index.html$/.test(path)) {
                                        pageType = "Section Front";
                                    } else {
                                        if (/^\/pages\/travel\/escapes\/$/.test(path) || /^\/pages\/travel\/escapes\/index.html/.test(path)) {
                                            pageType = "Section Front";
                                            pageSubType = "SubSection Front";
                                        } else {
                                            if (/^\/pages\/travel\/tmagazine\/$/.test(path) || /^\/pages\/travel\/tmagazine\/index.html/.test(path)) {
                                                pageType = "Section Front";
                                                pageSubType = "SubSection Front";
                                            } else {
                                                if (/\/frugal-traveler\//.test(path)) {
                                                    pageType = "Topic";
                                                    pageSubType = "Series";
                                                } else {
                                                    if (/\/overview.html$/.test(path)) {
                                                        pageType = "Topic";
                                                        pageSubType = "Travel Guide";
                                                        pageSubSubType = "Overview";
                                                    } else {
                                                        if (/\/overview-detail.html$/.test(path)) {
                                                            pageType = "Topic";
                                                            pageSubType = "Travel Guide";
                                                            pageSubSubType = "Overview";
                                                        } else {
                                                            if (/\/hotels.html$/.test(path)) {
                                                                pageType = "Topic";
                                                                pageSubType = "Travel Guide";
                                                                pageSubSubType = "Where to Stay";
                                                                pageSubSubSubType = "Suggestions";
                                                            } else {
                                                                if (/\/hotel-detail.html$/.test(path)) {
                                                                    pageType = "Topic";
                                                                    pageSubType = "Venue Detail";
                                                                    pageSubSubType = "Where to Stay";
                                                                    pageSubSubSubType = "Review";
                                                                } else {
                                                                    if (/\/hotel-listings.html$/.test(path)) {
                                                                        pageType = "Topic";
                                                                        pageSubType = "Travel Guide";
                                                                        pageSubSubType = "Where to Stay";
                                                                        pageSubSubSubType = "Listings";
                                                                    } else {
                                                                        if (/\/restaurants.html$/.test(path)) {
                                                                            pageType = "Topic";
                                                                            pageSubType = "Travel Guide";
                                                                            pageSubSubType = "Where to Eat";
                                                                            pageSubSubSubType = "Suggestions";
                                                                        } else {
                                                                            if (/\/restaurant-detail.html$/.test(path)) {
                                                                                pageType = "Topic";
                                                                                pageSubType = "Venue Detail";
                                                                                pageSubSubType = "Where to Eat";
                                                                                pageSubSubSubType = "Review";
                                                                            } else {
                                                                                if (/\/restaurant-listings.html$/.test(path)) {
                                                                                    pageType = "Topic";
                                                                                    pageSubType = "Travel Guide";
                                                                                    pageSubSubType = "Where to Eat";
                                                                                    pageSubSubSubType = "Listings";
                                                                                } else {
                                                                                    if (/\/attractions.html$/.test(path)) {
                                                                                        pageType = "Topic";
                                                                                        pageSubType = "Travel Guide";
                                                                                        pageSubSubType = "What to Do";
                                                                                        pageSubSubSubType = "Suggestions";
                                                                                    } else {
                                                                                        if (/\/attraction-detail.html$/.test(path)) {
                                                                                            pageType = "Topic";
                                                                                            pageSubType = "Venue Detail";
                                                                                            pageSubSubType = "What to Do";
                                                                                            pageSubSubSubType = "Review";
                                                                                        } else {
                                                                                            if (/\/attraction-listings.html$/.test(path)) {
                                                                                                pageType = "Topic";
                                                                                                pageSubType = "Travel Guide";
                                                                                                pageSubSubType = "What to Do";
                                                                                                var listingType = NYTD.Analytics.PageData.query("type");
                                                                                                if (listingType !== "") {
                                                                                                    if (listingType == "Attraction") {
                                                                                                        pageSubSubSubType = "Listings";
                                                                                                    } else {
                                                                                                        pageSubSubSubType = listingType;
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                if (/\/when-to-go.html$/.test(path)) {
                                                                                                    pageType = "Topic";
                                                                                                    pageSubType = "Travel Guide";
                                                                                                    pageSubSubType = "When to Go";
                                                                                                } else {
                                                                                                    if (/\/where-to-go.html$/.test(path)) {
                                                                                                        pageType = "Topic";
                                                                                                        pageSubType = "Travel Guide";
                                                                                                        pageSubSubType = "Where to Go";
                                                                                                    } else {
                                                                                                        if (/\/maps.html/.test(path)) {
                                                                                                            pageType = "Topic";
                                                                                                            pageSubType = "Travel Guide";
                                                                                                            pageSubSubType = "Maps";
                                                                                                        } else {
                                                                                                            if (/\/frommers\//.test(path)) {
                                                                                                                pageType = "Article";
                                                                                                                pageSubType = "Travel Guide";
                                                                                                            } else {
                                                                                                                if (/\/slideshow\//.test(path)) {
                                                                                                                    pageType = "Multimedia";
                                                                                                                    pageSubType = "Slideshow";
                                                                                                                } else {
                                                                                                                    if (/\/travsearch.html/.test(path)) {
                                                                                                                        pageType = "Search";
                                                                                                                        pageSubType = "Results";
                                                                                                                    } else {
                                                                                                                        pageType = "Other";
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                NYTD.Analytics.MetaData.add("WT.z_gpt", pageType);
                                NYTD.Analytics.MetaData.add("WT.z_gpst", pageSubType);
                                NYTD.Analytics.MetaData.add("WT.z_gpsst", pageSubSubType);
                                NYTD.Analytics.MetaData.add("WT.z_gpssst", pageSubSubSubType);
                                var partnerPage;
                                if (/\/frommers\//.test(path)) {
                                    partnerPage = "Frommers";
                                    NYTD.Analytics.MetaData.add("WT.z_pc", partnerPage);
                                }
                                var wt_region;
                                var wt_country;
                                var wt_state;
                                var wt_city;
                                var wt_destination;
                                if ((pageType == "Topic") || (pageType == "Article" && partnerPage == "Frommers")) {
                                    var startRE = /\/travel\/guides\//g;
                                    var endRE = /\/[A-Za-z0-9\-_]+\.html/g;
                                    var tempArray0 = startRE.exec(path);
                                    var tempArray1 = endRE.exec(path);
                                    if (tempArray0 !== null && tempArray1 !== null) {
                                        var locationString = path.substring(startRE.lastIndex, tempArray1.index);
                                        var locationArray = locationString.split("/");
                                        wt_region = locationArray[0];
                                        wt_country = locationArray[1];
                                        wt_state = locationArray[2];
                                        wt_city = locationArray[3];
                                    }
                                }
                                if (typeof wt_region != "undefined") {
                                    NYTD.Analytics.MetaData.add("WT.z_tRegion", wt_region);
                                }
                                if (typeof wt_country != "undefined") {
                                    wt_destination = wt_country;
                                }
                                if (typeof wt_state != "undefined") {
                                    wt_destination = wt_state;
                                }
                                if (typeof wt_city != "undefined") {
                                    wt_destination = wt_city;
                                }
                                if (typeof wt_destination != "undefined") {
                                    NYTD.Analytics.MetaData.add("WT.z_tDest", wt_destination);
                                }
                                var refer = NYTD.Analytics.PageData.query("refer");
                                if (refer !== "") {
                                    NYTD.Analytics.MetaData.add("WT.z_gref", refer);
                                }
                                if (/\/hotel-detail.html$/.test(path)) {
                                    NYTD.Analytics.MetaData.add("WT.z_tvt", "Hotel");
                                } else {
                                    if (/\/restaurant-detail.html$/.test(path)) {
                                        NYTD.Analytics.MetaData.add("WT.z_tvt", "Restaurant");
                                    } else {
                                        if (/\/attraction-detail.html$/.test(path)) {
                                            NYTD.Analytics.MetaData.add("WT.z_tvt", "Attraction");
                                        }
                                    }
                                } if (/\/hotel-detail.html$/.test(path) || /\/restaurant-detail.html$/.test(path) || /\/attraction-detail.html$/.test(path)) {
                                    var venueName = "";
                                    var docTitle = document.title;
                                    if (typeof docTitle != "undefined") {
                                        var endIndex = docTitle.indexOf(" - ");
                                        venueName = docTitle.substring(0, endIndex);
                                    }
                                    NYTD.Analytics.MetaData.add("WT.z_tvn", venueName);
                                }
                                var vid = NYTD.Analytics.PageData.query("vid");
                                if (vid !== "") {
                                    NYTD.Analytics.MetaData.add("WT.z_tvid", vid);
                                }
                                var searchResults;
                                var wt_tross = "";
                                var wt_tross_r = "";
                                if (pageType == "Search" && pageSubType == "Results") {
                                    wt_tross = NYTD.Analytics.PageData.query("term");
                                    searchResults = document.getElementById("noResults");
                                    if (null === searchResults) {
                                        wt_tross_r = "1";
                                    } else {
                                        wt_tross_r = "0";
                                    }
                                }
                                NYTD.Analytics.MetaData.add("WT.z_tross", wt_tross);
                                NYTD.Analytics.MetaData.add("WT.z_tross_r", wt_tross_r);
                                NYTD.Analytics.GoogleAnalytics.initialize();
                            } else {
                                if (contentGroup == "Movies") {
                                    var clearMoviesArticleTags = function() {
                                        NYTD.Analytics.MetaData.add("WT.z.gsg", "");
                                        NYTD.Analytics.MetaData.add("WT.z_aid", "");
                                        NYTD.Analytics.MetaData.add("WT.z_clmst", "");
                                        NYTD.Analytics.MetaData.add("WT.z_gat", "");
                                        NYTD.Analytics.MetaData.add("WT.z_hdl", "");
                                        NYTD.Analytics.MetaData.add("WT.z_pua", "");
                                        NYTD.Analytics.MetaData.add("WT.z_pud", "");
                                        NYTD.Analytics.MetaData.add("WT.z_put", "");
                                        NYTD.Analytics.MetaData.add("WT.z_puv", "");
                                    };
                                    NYTD.Analytics.MetaData.add("WT.z_mid", NYTD.Analytics.MetaData.get("MID"));
                                    NYTD.Analytics.MetaData.add("WT.z_mti", NYTD.Analytics.MetaData.get("MTI"));
                                    NYTD.Analytics.MetaData.add("WT.z_mpid", NYTD.Analytics.MetaData.get("MPID"));
                                    NYTD.Analytics.MetaData.add("WT.z_mpn", NYTD.Analytics.MetaData.get("MPN"));
                                    NYTD.Analytics.MetaData.add("WT.z_tszc", NYTD.Analytics.MetaData.get("TSZC"));
                                    var gcom = NYTD.Analytics.MetaData.get("WT.gcom");
                                    if (/\/critics_picks\.html/.test(path) && NYTD.Analytics.PageData.query("critic") !== "") {
                                        subcontentGroup = "Critics Picks";
                                        pageType = "Topic";
                                        pageSubType = "Critics";
                                    } else {
                                        if (/\/critics-picks\.html/.test(path)) {
                                            subcontentGroup = "Critics Picks";
                                            pageType = "Section Front";
                                            pageSubType = "Subsection Front";
                                        } else {
                                            if (/\/critics-picks/.test(path)) {
                                                subcontentGroup = "Critics Picks";
                                                pageType = "Section Front";
                                                pageSubType = "Subsection Front";
                                            } else {
                                                if (/\/timespulse\.html/.test(path)) {
                                                    subcontentGroup = "Times Pulse";
                                                    pageType = "Section Front";
                                                    pageSubType = "Subsection Front";
                                                    clearMoviesArticleTags();
                                                } else {
                                                    if (/\/1000best\.html/.test(path)) {
                                                        subcontentGroup = "1000";
                                                        pageType = "Section Front";
                                                        pageSubType = "Subsection Front";
                                                        clearMoviesArticleTags();
                                                    } else {
                                                        if (/\/homevideo\/index\.html/.test(path)) {
                                                            subcontentGroup = "DVD";
                                                            pageType = "Section Front";
                                                            pageSubType = "Subsection Front";
                                                        } else {
                                                            if (/\/shopping_cart\.html/.test(path)) {
                                                                subcontentGroup = "Shopping Cart";
                                                                pageType = "Ecommerce";
                                                                pageSubType = "Cart";
                                                            } else {
                                                                if (/\/continue_shopping\.html/.test(path)) {
                                                                    subcontentGroup = "Shopping Cart";
                                                                    pageType = "Ecommerce";
                                                                    pageSubType = "Continue";
                                                                } else {
                                                                    if (/\/boxoffice\/weekend_us\/index\.html/.test(path) || /\/boxoffice\/alltime_us\/index\.html/.test(path) || /\/boxoffice\/weekend_ny\/index\.html/.test(path) || /\/boxoffice\/alltime_ny\/index\.html/.test(path) || /\/boxoffice\/weekend_uk\/index\.html/.test(path) || /\/boxoffice\/alltime_uk\/index\.html/.test(path)) {
                                                                        subcontentGroup = "Box Office";
                                                                        pageType = "Reference";
                                                                        pageSubType = "Box Office";
                                                                    } else {
                                                                        if (/\/highlyrated\/alltime\/index\.html/.test(path) || /\/highlyrated\/currentreleases\/index\.html/.test(path)) {
                                                                            pageType = "Community";
                                                                            pageSubType = "Highest Rated";
                                                                            gcom = "Com";
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    NYTD.Analytics.MetaData.add("WT.cg_s", subcontentGroup);
                                    NYTD.Analytics.MetaData.add("WT.z_gpt", pageType);
                                    NYTD.Analytics.MetaData.add("WT.z_gpst", pageSubType);
                                    NYTD.Analytics.MetaData.add("WT.gcom", gcom);
                                } else {
                                    if (contentGroup == "Member Center") {
                                        if (/\/auth\/chk_login/.test(path) || /\/auth\/login/.test(path) || /\/login/.test(path) || /\/glogin/.test(path)) {
                                            pageType = "Access";
                                            pageSubType = "Login";
                                        } else {
                                            if (/^\/gst\/regi\.html/.test(path)) {
                                                pageType = "Access";
                                                pageSubType = "Regi";
                                            } else {
                                                if (/^\/gst\/forgot\.html/.test(path)) {
                                                    pageType = "Access";
                                                    pageSubType = "Forgot";
                                                } else {
                                                    if (/^\/gst\/signout\.html/.test(path)) {
                                                        pageType = "Access";
                                                        pageSubType = "Signout";
                                                    } else {
                                                        if (/^\/commerce\/jsp\//.test(path)) {
                                                            pageSubType = "E-Commerce";
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        NYTD.Analytics.MetaData.add("WT.z_gpt", pageType);
                                        NYTD.Analytics.MetaData.add("WT.z_gpst", pageSubType);
                                    } else {
                                        if (contentGroup == "Email This") {
                                            NYTD.Analytics.MetaData.add("WT.z_gpt", "Tools");
                                            NYTD.Analytics.MetaData.add("WT.z_gpst", "Email This");
                                            if (/Thank You/.test(document.title)) {
                                                var articleBody = $("articleBody");
                                                if (articleBody) {
                                                    var articleURLNode = articleBody.down("p.sentTo a");
                                                    if (articleURLNode) {
                                                        var articleURL = articleURLNode.href;
                                                        var articleTitle = articleURLNode.innerHTML;
                                                        var articleContentGroup = NYTD.Analytics.Rules.getContentGroup("", "", articleURL);
                                                        NYTD.Analytics.MetaData.add("WT.z_co", articleContentGroup);
                                                        NYTD.Analytics.MetaData.add("WT.z_hdl", articleTitle);
                                                        NYTD.Analytics.MetaData.add("WT.z_guie", "e");
                                                    }
                                                }
                                            }
                                        } else {
                                            if (contentGroup == "Business") {
                                                NYTD.Analytics.GoogleAnalytics.initialize();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    setReferrerInfo: function() {
        var origRefUrl = NYTD.Analytics.PageData.cookies("FramesetReferrer");
        var refUrl = origRefUrl || document.referrer;
        if (refUrl !== undefined && refUrl !== "") {
            var refDom = refUrl.match(/:\/\/(www\.)?([^\/:]+)/);
            refDom = refDom[2] ? refDom[2] : "";
            NYTD.Analytics.MetaData.add("WT.z_ref", refDom);
            NYTD.Analytics.MetaData.add("WT.z_sorg", NYTD.Analytics.Rules.isSearchEngine(refDom));
        }
    },
    getReferrerQuery: function() {
        var refQuery = "";
        var url_parts = document.referrer.split("?");
        if (url_parts[1]) {
            var url_args = url_parts[1].split("&");
            for (var i = 0; i < url_args.length; i++) {
                var keyval = url_args[i].split("=");
                if (keyval[0] == "q") {
                    refQuery = keyval[1];
                }
            }
        }
        return refQuery;
    },
    isSearchEngine: function(refDom) {
        var refType = "";
        if ((/google\./.test(refDom) && NYTD.Analytics.Rules.getReferrerQuery() !== "") || (/search\./.test(refDom)) || (/ask.com/.test(refDom)) || (/altavista.com/.test(refDom))) {
            refType = "1";
        }
        return refType;
    },
    handleCGExceptions: function(contentGroup, subcontentGroup, cgTag, scgTag) {
        var retVal = {
            contentGroup: contentGroup,
            subcontentGroup: subcontentGroup
        };
        if (subcontentGroup == "dance") {
            retVal.contentGroup = "Dance";
            retVal.subcontentGroup = "";
        } else {
            if (subcontentGroup == "music") {
                retVal.contentGroup = "Music";
                retVal.subcontentGroup = "";
            } else {
                if (subcontentGroup == "television") {
                    retVal.contentGroup = "TV";
                    retVal.subcontentGroup = "";
                } else {
                    if (subcontentGroup == "olympics") {
                        retVal.contentGroup = "Olympics";
                        retVal.subcontentGroup = "";
                    } else {
                        if (subcontentGroup == "politics") {
                            retVal.contentGroup = "Politics";
                            retVal.subcontentGroup = "";
                        }
                    }
                }
            }
        } if (cgTag == "education") {
            retVal.subcontentGroup = "Education";
        } else {
            if (cgTag == "washington") {
                retVal.subcontentGroup = "Washington";
            } else {
                if (cgTag == "fashion") {
                    retVal.subcontentGroup = "Fashion";
                } else {
                    if (cgTag == "dining") {
                        retVal.subcontentGroup = "Dining";
                    } else {
                        if (cgTag == "garden") {
                            retVal.subcontentGroup = "Garden";
                        } else {
                            if ((cgTag == "Your Money") || (cgTag == "your-money")) {
                                if (NYTD.Analytics.MetaData.get("PT") == "Article") {
                                    NYTD.Analytics.MetaData.add("WT.z_gtn", subcontentGroup);
                                }
                                retVal.contentGroup = "Business";
                                retVal.subcontentGroup = "Your Money";
                            }
                        }
                    }
                }
            }
        } if (scgTag == "Weddings") {
            retVal.contentGroup = "Style";
            retVal.subcontentGroup = "Weddings";
        }
        if (subcontentGroup == "Dealbook Jobs") {
            retVal.contentGroup = "Business";
        }
        if (cgTag == "xword") {
            retVal.contentGroup = "Crosswords/Games";
        }
        return retVal;
    },
    setSectionFront: function() {
        if ((NYTD.Analytics.MetaData.get("WT.z_gpt") == "Section Front") && NYTD.Analytics.MetaData.get("WT.cg_s")) {
            NYTD.Analytics.MetaData.add("WT.z_gpst", "Subsection Front");
        }
    },
    setInteractiveGraphicInfo: function() {
        NYTD.Analytics.MetaData.add("WT.z_gpt", "Multimedia");
        NYTD.Analytics.MetaData.add("WT.z_gpst", "Flash");
        NYTD.Analytics.MetaData.add("WT.z_pud", NYTD.Analytics.MetaData.get("pdate"));
    },
    setSlideshowInfo: function() {
        NYTD.Analytics.MetaData.add("WT.z_gpt", "Multimedia");
        NYTD.Analytics.MetaData.add("WT.z_gpst", "Slideshow");
        NYTD.Analytics.MetaData.add("WT.z_pud", NYTD.Analytics.MetaData.get("pdate"));
        NYTD.Analytics.MetaData.add("WT.z_sssn", NYTD.Analytics.MetaData.get("SSSN"));
        NYTD.Analytics.MetaData.add("WT.z_ssts", NYTD.Analytics.MetaData.get("SSTS"));
        NYTD.Analytics.MetaData.add("WT.z_sse", NYTD.Analytics.MetaData.get("SSE"));
    },
    setArticleInfo: function(articleID) {
        if (articleID !== "") {
            var pubDate = NYTD.Analytics.MetaData.get("pdate");
            var pubType = NYTD.Analytics.Rules.getPubTypeFromDate(pubDate);
            NYTD.Analytics.MetaData.add("WT.z_gpt", "Article");
            NYTD.Analytics.MetaData.add("WT.z_gpst", NYTD.Analytics.MetaData.get("tom"));
            NYTD.Analytics.MetaData.add("WT.z_hdl", NYTD.Analytics.MetaData.get("hdl"));
            if (pubType == "Archive") {
                NYTD.Analytics.MetaData.add("WT.z_aid", "nyta-" + articleID);
            } else {
                NYTD.Analytics.MetaData.add("WT.z_aid", articleID);
            }
            NYTD.Analytics.MetaData.add("WT.z_pud", pubDate);
            NYTD.Analytics.MetaData.add("WT.z_put", pubType);
            NYTD.Analytics.MetaData.add("WT.z.gsg", pubType);
            if (pubDate.length == 8) {
                var tYear = pubDate.substring(0, 4);
                if (tYear < 2004) {
                    NYTD.Analytics.MetaData.add("WT.ti", "Archive Article from " + tYear);
                    NYTD.Analytics.MetaData.add("DCS.dcsuri", "http://www.nytimes.com/archive/" + tYear + ".html");
                }
                if (pubType == "Archive") {
                    if (tYear >= 1987) {
                        NYTD.Analytics.MetaData.add("WT.z_gat", "1987-Present");
                    } else {
                        if (tYear >= 1981) {
                            NYTD.Analytics.MetaData.add("WT.z_gat", "1981-1986");
                        } else {
                            if (tYear >= 1923) {
                                NYTD.Analytics.MetaData.add("WT.z_gat", "1923-1980");
                            } else {
                                NYTD.Analytics.MetaData.add("WT.z_gat", "1851-1922");
                            }
                        }
                    }
                }
            }
            NYTD.Analytics.MetaData.add("WT.z_pua", "free");
            var bylVal = NYTD.Analytics.MetaData.get("byl");
            bylVal = bylVal.replace("&#8217;", "'");
            if (bylVal.indexOf("By ") != -1) {
                bylVal = bylVal.substring(3);
                var bylValInd = bylVal.indexOf(" and ");
                if (bylValInd != -1) {
                    bylVal = bylVal.substring(0, bylValInd) + ";" + bylVal.substring(bylValInd + 5);
                }
            }
            NYTD.Analytics.MetaData.add("WT.z_clmst", bylVal);
            NYTD.Analytics.Rules.setXTS(bylVal);
            var pageWanted = NYTD.Analytics.PageData.query("pagewanted");
            if (pageWanted === "") {
                NYTD.Analytics.MetaData.add("WT.z_puv", "Normal");
            } else {
                NYTD.Analytics.MetaData.add("WT.z_puv", pageWanted);
            }
        }
    },
    setPubDateInfo: function(pdate) {
        NYTD.Analytics.Rules.setPubDateRange(pdate);
        NYTD.Analytics.MetaData.add("WT.z_pyr", pdate.substring(0, 4));
    },
    setPubDateRange: function(pdate) {
        var relativePubDate = "No Pub Date";
        var currentDate = new Date();
        var currentDateMs = currentDate.getTime();
        var pubDate = new Date();
        if (pdate.length == 8) {
            var tYear = pdate.substring(0, 4);
            var tMonth = pdate.substring(4, 6);
            var tDay = pdate.substring(6, 8);
            pubDate.setFullYear(tYear, tMonth - 1, tDay);
        }
        var pubDateMs = pubDate.getTime();
        var publicDomainStartDate = new Date();
        publicDomainStartDate.setYear(1851);
        publicDomainStartDate.setMonth(0);
        publicDomainStartDate.setDate(1);
        var publicDomainStartDateMs = publicDomainStartDate.getTime();
        var payArchiveStartDate = new Date();
        payArchiveStartDate.setYear(1923);
        payArchiveStartDate.setMonth(0);
        payArchiveStartDate.setDate(1);
        var payArchiveStartDateMs = payArchiveStartDate.getTime();
        var payArchiveEndDate = new Date();
        payArchiveEndDate.setYear(1986);
        payArchiveEndDate.setMonth(11);
        payArchiveEndDate.setDate(31);
        var payArchiveEndDateMs = payArchiveEndDate.getTime();
        var dateDiffMs = currentDateMs - pubDateMs;
        if (dateDiffMs < 0) {
            relativePubDate = "Tomorrow";
        } else {
            if (0 <= dateDiffMs && dateDiffMs < 86400000) {
                relativePubDate = "Same Day";
            } else {
                if (86400000 <= dateDiffMs && dateDiffMs < 172800000) {
                    relativePubDate = "1 Day";
                } else {
                    if (172800000 <= dateDiffMs && dateDiffMs < 259200000) {
                        relativePubDate = "2 Day";
                    } else {
                        if (259200000 <= dateDiffMs && dateDiffMs < 345600000) {
                            relativePubDate = "3 Day";
                        } else {
                            if (345600000 <= dateDiffMs && dateDiffMs < 432000000) {
                                relativePubDate = "4 Day";
                            } else {
                                if (432000000 <= dateDiffMs && dateDiffMs < 518400000) {
                                    relativePubDate = "5 Day";
                                } else {
                                    if (518400000 <= dateDiffMs && dateDiffMs < 604800000) {
                                        relativePubDate = "6 Day";
                                    } else {
                                        if (604800000 <= dateDiffMs && dateDiffMs < 691200000) {
                                            relativePubDate = "7 Day";
                                        } else {
                                            if (691200000 <= dateDiffMs && dateDiffMs < 2678400000) {
                                                relativePubDate = "Month";
                                            } else {
                                                if (2678400000 <= dateDiffMs && dateDiffMs < 7776000000) {
                                                    relativePubDate = "90 Day";
                                                } else {
                                                    if (7776000000 <= dateDiffMs && dateDiffMs < 31536000000) {
                                                        relativePubDate = "1 Year";
                                                    } else {
                                                        if (31536000000 <= dateDiffMs && dateDiffMs < 157680000000) {
                                                            relativePubDate = "5 Years";
                                                        } else {
                                                            if (157680000000 <= dateDiffMs && dateDiffMs < 315360000000) {
                                                                relativePubDate = "10 Years";
                                                            } else {
                                                                if (315360000000 <= dateDiffMs && pubDateMs > payArchiveEndDateMs) {
                                                                    relativePubDate = "Post 86";
                                                                } else {
                                                                    if (315360000000 <= dateDiffMs && (payArchiveStartDateMs <= pubDateMs && pubDateMs <= payArchiveEndDateMs)) {
                                                                        relativePubDate = "Pay Archive";
                                                                    } else {
                                                                        if (315360000000 <= dateDiffMs && (publicDomainStartDateMs <= pubDateMs && pubDateMs <= payArchiveStartDateMs)) {
                                                                            relativePubDate = "Public Domain";
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        NYTD.Analytics.MetaData.add("WT.z_pudr", relativePubDate);
    },
    setCommentOverflowInfo: function(articleID) {
        NYTD.Analytics.MetaData.add("WT.z_aid", articleID);
        NYTD.Analytics.MetaData.add("WT.z_hdl", NYTD.Analytics.MetaData.get("hdl"));
        if (NYTD.Analytics.MetaData.get("WT.z_gpst") == "Comments Overflow") {
            NYTD.Analytics.MetaData.add("WT.gcom", "Com");
        }
        NYTD.Analytics.MetaData.add("WT.z_acpn", NYTD.Analytics.MetaData.get("ACPN"));
        NYTD.Analytics.MetaData.add("WT.z_acos", NYTD.Analytics.MetaData.get("ACOS"));
    },
    getPubTypeFromDate: function(pdate) {
        if (pdate !== undefined && pdate.length == 8) {
            var currentDate = new Date();
            var articleDate = new Date();
            articleDate.setDate(pdate.substring(6));
            articleDate.setMonth(pdate.substring(4, 6) - 1);
            articleDate.setFullYear(pdate.substring(0, 4));
            if (articleDate < currentDate) {
                return "Archive";
            } else {
                return "web";
            }
        } else {
            return "web";
        }
    },
    setXTS: function(clmst) {
        if (/DAVID BROOKS/.test(clmst) || /MAUREEN DOWD/.test(clmst) || /ROGER COHEN/.test(clmst) || /THOMAS L. FRIEDMAN/.test(clmst) || /BOB HERBERT/.test(clmst) || /NICHOLAS D. KRISTOF/.test(clmst) || /PAUL KRUGMAN/.test(clmst) || /FRANK RICH/.test(clmst) || /DAVE ANDERSON/.test(clmst) || /PETER APPLEBOME/.test(clmst) || /HARVEY ARATON/.test(clmst) || /DAN BARRY/.test(clmst) || /JIM DWYER/.test(clmst) || /CLYDE HABERMAN/.test(clmst) || /ADAM LIPTAK/.test(clmst) || /GRETCHEN MORGENSON/.test(clmst) || /JOE NOCERA/.test(clmst) || /JOSEPH NOCERA/.test(clmst) || /FLOYD NORRIS/.test(clmst) || /WILLIAM C. RHODEN/.test(clmst) || /SELENA ROBERTS/.test(clmst) || /GEORGE VECSEY/.test(clmst) || /JOHN VINOCUR/.test(clmst)) {
            NYTD.Analytics.MetaData.add("WT.z_gts", "XTS");
        }
    },
    setSearchInfo: function() {
        var searchResults;
        var wt_oss = "";
        var wt_oss_r = "";
        var wt_gosst = "";
        var ossName = "";
        var ossrName = "";
        if (/\/gst\/health\/healthsearch.html/.test(NYTD.Analytics.PageData.pagePath)) {
            wt_oss = NYTD.Analytics.PageData.query("query");
            if (wt_oss === "") {
                wt_oss = NYTD.Analytics.PageData.query("term");
            }
            searchResults = document.getElementById("sortBy");
            ossName = "WT.z_hoss";
            ossrName = "WT.z_hoss_r";
        }
        if (null === searchResults) {
            wt_oss_r = "0";
        } else {
            wt_oss_r = "1";
            if (wt_oss === "") {
                wt_oss = "No Term";
            }
        } if (wt_oss !== "") {
            NYTD.Analytics.MetaData.add(ossName, wt_oss);
            NYTD.Analytics.MetaData.add(ossrName, wt_oss_r);
        }
        if (wt_gosst !== "") {
            var wt_osstArray = {
                "nyt": "Search > Articles 1981-Present",
                "p": "Search > Articles 1851-1980",
                "g": "Search > Google Web Results",
                "m": "Search > Multimedia",
                "nycks": "Search > NYC Events & Venues",
                "ref": "Search > Reference",
                "blog": "Search > Blogs"
            };
            var searchType = wt_osstArray[wt_gosst];
            if (searchType === undefined) {
                searchType = wt_gosst;
            }
            NYTD.Analytics.MetaData.add("WT.z_gosst", searchType);
        }
    },
    setTrackEvents: function() {
        var wt_section = NYTD.Analytics.MetaData.get("WT.cg_n");
        var wt_subsection = NYTD.Analytics.MetaData.get("WT.cg_s");
        var wt_pagetype = NYTD.Analytics.MetaData.get("WT.z_gpt");
        var wt_pagesubtype = NYTD.Analytics.MetaData.get("WT.z_gpst");
        if ((wt_pagetype == "Homepage" && wt_pagesubtype != "Times Extra") || (wt_section == "Politics" && wt_pagetype == "Section Front") || (wt_section == "Opinion" && wt_pagetype == "Section Front") || (wt_section == "Business" && wt_pagetype == "Section Front") || (wt_subsection == "Dealbook" && wt_pagesubtype == "Blog Main")) {
            gtrackevents = true;
        }
    },
    setDefaultTags: function() {
        if (NYTD.Analytics.MetaData.get("WT.z_gpt") === "") {
            NYTD.Analytics.MetaData.add("WT.z_gpt", "Other");
        }
    }
};

NYTD.Analytics.runController = function() {
    var contentGroup = NYTD.Analytics.MetaData.get("WT.cg_n");
    var cgTagValue = NYTD.Analytics.MetaData.get("CG");
    if (contentGroup === "") {
        var contentGroupLookupValue = NYTD.Analytics.Mappings.contentGroupMap[cgTagValue];
        contentGroup = contentGroupLookupValue || cgTagValue;
        if (contentGroup === "") {
            contentGroup = NYTD.Analytics.Rules.getContentGroup(NYTD.Analytics.PageData.url, NYTD.Analytics.PageData.domain, NYTD.Analytics.PageData.path);
        }
    }
    var scgTagValue = NYTD.Analytics.MetaData.get("SCG");
    var subcontentGroupLookupValue = NYTD.Analytics.Mappings.subcontentGroupMap[scgTagValue];
    var subcontentGroup = subcontentGroupLookupValue || scgTagValue;
    var updatedValues = NYTD.Analytics.Rules.handleCGExceptions(contentGroup, subcontentGroup, cgTagValue, scgTagValue);
    contentGroup = updatedValues.contentGroup;
    subcontentGroup = updatedValues.subcontentGroup;
    NYTD.Analytics.MetaData.add("WT.cg_n", contentGroup);
    NYTD.Analytics.MetaData.add("WT.cg_s", subcontentGroup);
    NYTD.Analytics.Rules.readPageTags();
    NYTD.Analytics.Rules.setContentInfo(contentGroup);
    NYTD.Analytics.Rules.setReferrerInfo();
    NYTD.Analytics.Rules.setSectionFront();
    var mappedDataSourceId = NYTD.Analytics.Mappings.dcsidMap[contentGroup];
    if (mappedDataSourceId) {
        NYTD.Analytics.WebTrends.dcsid = mappedDataSourceId;
    }
    if (typeof dcsvid !== "undefined" && dcsvid != "0") {
        NYTD.Analytics.MetaData.add("WT.dcsvid", dcsvid);
    }
    if (typeof regstatus !== "undefined") {
        NYTD.Analytics.MetaData.add("WT.rv", (regstatus == "registered") ? "1" : "0");
    }
    var metaArticleId = NYTD.Analytics.MetaData.get("articleid");
    if (metaArticleId !== "" && NYTD.Analytics.MetaData.get("WT.z_gpst") != "Comments Overflow") {
        NYTD.Analytics.Rules.setArticleInfo(metaArticleId);
    } else {
        NYTD.Analytics.Rules.setCommentOverflowInfo(metaArticleId);
    }
    var pub_date = NYTD.Analytics.MetaData.get("WT.z_pud");
    if (pub_date !== "") {
        NYTD.Analytics.Rules.setPubDateInfo(pub_date);
    }
    var tomMetaTag = NYTD.Analytics.MetaData.get("tom");
    if (tomMetaTag == "interactive_graphic" || tomMetaTag == "interactive_feature") {
        NYTD.Analytics.Rules.setInteractiveGraphicInfo();
    }
    if (/^\/imagepages/.test(NYTD.Analytics.PageData.pagePath)) {
        NYTD.Analytics.MetaData.add("PT", "Multimedia");
        NYTD.Analytics.MetaData.add("PST", "Image");
    }
    tomMetaTag = NYTD.Analytics.MetaData.get("tom");
    if ((tomMetaTag == "Slideshow") || (/^\/slideshow\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\//.test(NYTD.Analytics.PageData.pagePath))) {
        NYTD.Analytics.Rules.setSlideshowInfo();
    }
    var metaEmailCampId = NYTD.Analytics.PageData.query("emc");
    NYTD.Analytics.MetaData.add("WT.mc_id", metaEmailCampId);
    var externalCampId = NYTD.Analytics.PageData.query("excamp");
    if (externalCampId !== "") {
        NYTD.Analytics.MetaData.add("WT.mc_id", externalCampId);
        NYTD.Analytics.MetaData.add("WT.srch", "1");
    }
    if (NYTD.Analytics.MetaData.get("WT.mc_id") !== "") {
        NYTD.Analytics.MetaData.add("WT.mc_ev", "click");
    }
    if (NYTD.Analytics.PageData.query("no_interstitial") !== "") {
        NYTD.Analytics.MetaData.add("WT.z_dirlnk", "1");
    }
    if (/NYT-Global/.test(document.cookie)) {
        NYTD.Analytics.MetaData.add("WT.gv", "2");
    } else {
        if (/edition\|GLOBAL/.test(document.cookie)) {
            NYTD.Analytics.MetaData.add("WT.gv", "1");
        }
    } if (document.cookie.match(/autorefresh=1/)) {
        NYTD.Analytics.MetaData.add("WT.z_jog", "1");
        var expTime = new Date();
        expTime.setTime(expTime.getTime() - 60000);
        document.cookie = "autorefresh=0; expires=" + expTime.toGMTString() + "; path=/";
    }
    NYTD.Analytics.Rules.setTrackEvents();
    NYTD.Analytics.Rules.setSearchInfo();
    NYTD.Analytics.Rules.setDefaultTags();
    NYTD.Analytics.MetaData.flush();
};

NYTD.Analytics.runController();
NYTD.Analytics.WebTrends.dcsCollect();
var rsi_k;
var rsi_now = new Date();
var rsi_csid = "H07707";
if (typeof(csids) == "undefined") {
    var csids = [rsi_csid];
} else {
    csids.push(rsi_csid);
}
var _rsiaa = 0;
var _rsiba = 1;
var _rsica = 0;
var _rsida = 0;
var _rsiea = 0;
var _rsifa = 1;
var _rsiga = "0806180";
var _rsiha = "pix04.revsci.net";
var _rsiia = "js";
var _rsija = "b";
var _rsika = "3";
var _rsila = 3;
var _rsima = new Array();
var _rsina = 0;
var _rsioa;
var _rsipa;
var _rsiqa;
var _rsira;
var _rsisa;
var _rsita;
_rsiua();

function DM_cat(Da) {
    _rsioa = Da;
}

function DM_name(Ea) {
    _rsipa = Ea;
}

function DM_keywords(st) {
    _rsiqa = st;
}

function DM_event(Fa) {
    _rsira = Fa;
}

function DM_addToLoc(n, v) {
    _rsisa = _rsiva(_rsisa, n, v);
}

function DM_addEncToLoc(n, v) {
    DM_addToLoc(_rsiwa(n), _rsiwa(v));
}

function DM_setLoc(u) {
    _rsisa = u;
}

function DM_setCsid(Ga) {
    rsi_csid = Ga;
}

function rsi_c(Ha) {
    this._rsixa = Ha;
}

function rsi_ral(Ia) {
    this._rsiaa = Ia;
}

function rsi_riu(Ja) {
    this._rsiba = Ja;
}

function rsi_tiu(Ka) {
    this._rsica = Ka;
}

function rsi_m(La) {
    this._rsida = La;
}

function rsi_dw(Ma) {
    this._rsiea = Ma;
}

function rsi_tu(Na) {
    this._rsifa = docW;
}

function rsi_s(Oa) {
    this._rsiha = Oa;
}

function rsi_t(Pa) {
    this._rsiia = Pa;
}

function rsi_en(Qa) {
    this._rsija = Qa;
}

function rsi_cn(Ra) {
    this._rsika = Ra;
}

function rsi_us(Sa) {
    this._rsila = Sa;
}

function DM_tag() {
    var Ta;
    if (_rsina == 0 || _rsida == 1) {
        if (typeof(DM_prep) == "function") {
            DM_prep(rsi_csid);
        }
        var Ua = _rsiya();
        if (_rsiia == "gif") {
            Ta = new Image(2, 3);
            Ta.src = Ua;
            _rsima[_rsima.length] = Ta;
        } else {
            if (_rsiia == "js") {
                if (_rsiea == 1) {
                    document.write('<script language="JavaScript" type="text/javascript" src="' + Ua + '"><' + "/script>");
                } else {
                    var Va = document.createElement("script");
                    Va.language = "JavaScript";
                    Va.type = "text/javascript";
                    Va.src = Ua;
                    if (document.body == null) {
                        document.getElementsByTagName("head")[0].appendChild(Va);
                    } else {
                        document.body.insertBefore(Va, document.body.firstChild);
                    }
                    Ta = Va;
                }
            }
        }
        _rsina = 1;
    }
    _rsiua();
    return Ta;
}

function _rsiya() {
    var Wa = "";
    Wa = "DM_LOC=" + _rsiwa(_rsisa);
    if (_rsioa) {
        Wa += "&DM_CAT=" + _rsiwa(_rsioa);
    }
    if (_rsira) {
        Wa += "&DM_EVT=" + _rsiwa(_rsira);
    }
    if (_rsiqa) {
        Wa += "&DM_KYW=" + _rsiwa(_rsiqa);
    }
    if (_rsiba == 1 && _rsita) {
        Wa += "&DM_REF=" + _rsiwa(_rsita);
    }
    if (_rsica == 1) {
        Wa += "&DM_TIT=" + _rsiwa(document.title);
    }
    if (_rsipa) {
        Wa += "&DM_NAM=" + _rsiwa(_rsipa);
    }
    Wa += "&DM_EOM=1";
    var Xa = location.protocol + "//";
    var Ya = "/" + rsi_csid + "/" + _rsija + _rsika + "/0/" + _rsila + "/" + _rsiga + "/";
    var Za = Math.floor(Math.random() * 1000000000) + "." + _rsiia;
    var $a = Xa + _rsiha + Ya + Za + "?D=" + _rsiwa(Wa) + "&C=" + _rsiwa(csids);
    if (_rsifa) {
        var ab = $a.length;
        if (ab >= 2000) {
            if ($a.charAt(1998) == "%") {
                $a = $a.substr(0, 1998);
            } else {
                if ($a.charAt(1999) == "%") {
                    $a = $a.substr(0, 1999);
                } else {
                    $a = $a.substr(0, 2000);
                }
            }
        }
    }
    return $a;
}

function _rsiza(i) {
    var bb = i.toString(16).toUpperCase();
    return bb.length < 2 ? "0" + bb : bb;
}

function _rsiAa(c) {
    var i = c.charCodeAt(0);
    if (isNaN(i)) {
        return "";
    }
    if (i < 128) {
        return "%" + _rsiza(i);
    }
    if (i < 2048) {
        return "%" + _rsiza(192 + (i >> 6)) + "%" + _rsiza(128 + (i & 63));
    }
    if (i < 65536) {
        return "%" + _rsiza(224 + (i >> 12)) + "%" + _rsiza(128 + (i >> 6 & 63)) + "%" + _rsiza(128 + (i & 63));
    }
    return "%" + _rsiza(240 + (i >> 18)) + "%" + _rsiza(128 + (i >> 12 & 63)) + "%" + _rsiza(128 + (i >> 6 & 63)) + "%" + _rsiza(128 + (i & 63));
}
var _rsiwa;
if (typeof(encodeURIComponent) == "function") {
    _rsiwa = encodeURIComponent;
} else {
    var _rsiBa = new RegExp("[\x00-\x20]|[\x22-\x26]|[\x2B-\x2C]|\x2F|[\x3A-\x40]|[\x5B-\x5E]|\x60|[\x7B-\x7D]|[\x7F-\uFFFF]", "g");
    _rsiwa = function(v) {
        return v.toString().replace(_rsiBa, _rsiAa);
    };
}

function _rsiva(u, n, v) {
    return u + (u.indexOf("?") == -1 ? "?" : "&") + n + "=" + v;
}

function _rsiCa(u) {
    var i = u.indexOf("#");
    return (i >= 0) ? u.substr(0, i) : u;
}

function _rsiua() {
    _rsita = _rsiCa(document.referrer.toString());
    _rsisa = (_rsiaa == 1) ? _rsita : _rsiCa(window.location.href);
    _rsioa = null;
    _rsipa = null;
    _rsiqa = null;
}

NYTD.Analytics.RevenueScience = {};
NYTD.Analytics.RevenueScience.addCategory = function(category, valueToAppend) {
    if (valueToAppend != "") {
        return category + " > " + valueToAppend;
    } else {
        return category;
    }
};

NYTD.Analytics.RevenueScience.init = function() {
    var contentGroup = NYTD.Analytics.MetaData.get("WT.cg_n");
    if (contentGroup != "Homepage") {
        var catValue = "NYTimesglobal";
        catValue = NYTD.Analytics.RevenueScience.addCategory(catValue, contentGroup);
        catValue = NYTD.Analytics.RevenueScience.addCategory(catValue, NYTD.Analytics.MetaData.get("WT.cg_s"));
        DM_cat(catValue);
        DM_tag();
    }
};

NYTD.Analytics.RevenueScience.init();
NYTD.asyncLoad((window.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js", function() {
    var url = window.location.protocol + "//" + window.location.host + window.location.pathname;
    var section = NYTD.Analytics.MetaData.get("CG").toLowerCase();
    COMSCORE.beacon({
        c1: 2,
        c2: 3005403,
        c3: "",
        c4: url,
        c5: section,
        c6: "",
        c15: ""
    });
});

(function() {
    var d = new Image(1, 1);
    d.onerror = d.onload = function() {
        d.onerror = d.onload = null;
    };
    d.src = ["//secure-us.imrworldwide.com/cgi-bin/m?ci=us-nytimes&cg=0&cc=1&si=", escape(window.location.href), "&rp=", escape(document.referrer), "&ts=compact&rnd=", (new Date()).getTime()].join("");
})();

NYTD.UPTracker = (function() {
    var config = {
        baseUrl: "http://up.nytimes.com/?",
        eventType: undefined,
        data: undefined,
        defaultArguments: "d=0//&c=1"
    };
    var url;

    function init(params) {
        if (params.baseUrl) {
            config.baseUrl = params.baseUrl;
        }
        if (params.eventType) {
            config.eventType = params.eventType;
        }
        if (params.data) {
            config.data = params.data;
        }
    }

    function send() {
        if (url) {
            var img = document.createElement("img");
            img.setAttribute("border", 0);
            img.setAttribute("height", 0);
            img.setAttribute("width", 0);
            img.setAttribute("src", url);
            document.body.appendChild(img);
        } else {
            return false;
        }
    }

    function appendAndSend() {
        var jsonData = JSON.stringify(config.data);
        if (jsonData) {
            url += "&p=" + encodeURIComponent(jsonData);
        }
        send();
    }

    function createUrl() {
        url = config.baseUrl + config.defaultArguments;
        if (config.eventType) {
            url += "&e=" + config.eventType;
        }
        url += "&u=" + encodeURIComponent(window.location.href);
        url += "&r=" + encodeURIComponent(document.referrer);
        if (config.data) {
            if (JSON && JSON.stringify) {
                appendAndSend();
            } else {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = NYTD.Hosts.jsHost + "/js/app/lib/json/json2-min.js";
                script.onload = function() {
                    appendAndSend();
                };
                script.onreadystatechange = function() {
                    if (this.readyState == "loaded" || this.readyState == "complete") {
                        appendAndSend();
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        } else {
            send();
        }
    }
    return {
        track: function(trackParams) {
            var params = trackParams || {};
            init(params);
            createUrl();
        }
    };
})();

var _sf_async_config = {
    uid: 16698,
    domain: "nytimes.com",
    pingServer: "pnytimes.chartbeat.net",
    path: window.location.pathname,
    title: window.TimesPeople && TimesPeople.Page.getTitle() || document.title.replace("- NYTimes.com", "")
};

try {
    _sf_async_config.sections = [document.getElementsByName("CG")[0].content, document.getElementsByName("SCG")[0].content].join(",");
} catch (e) {}
try {
    _sf_async_config.authors = (document.getElementsByName("byl")[0] || document.getElementsByName("CLMST")[0]).content.replace("By ", "").toLowerCase().replace(/\b[a-z]/g, function() {
        return arguments[0].toUpperCase();
    });
} catch (e) {}

(function() {
    function loadChartbeat() {
        window._sf_endpt = (new Date()).getTime();
        var e = document.createElement("script");
        e.setAttribute("language", "javascript");
        e.setAttribute("type", "text/javascript");
        e.setAttribute("src", (("https:" == document.location.protocol) ? "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" : "http://static.chartbeat.com/") + "js/chartbeat.js");
        document.body.appendChild(e);
    }
    
    if (window.addEventListener) {
        window.addEventListener("load", loadChartbeat, false);
    } else {
        if (window.attachEvent) {
            window.attachEvent("onload", loadChartbeat);
        }
    }
})();
