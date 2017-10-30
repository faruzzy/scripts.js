// taken from outlook.com to investigate the flyAway Effect
// Original file: animations_9TSgKb1_EplFXg3QgjsV8Q2.js under a.gfx.ms
(function() {
    function y(n) {
        return window.requestAnimationFrame ? window.requestAnimationFrame(n) : (n(), null);
    }

    function b(n, t, i) {
        for (var r, u, e, f = 0, o = t.length; f < o; f++)
            if (r = t[f], i === 0 && (r.initialDelay = r.delay), typeof r.stagger == "function" && (r.delay = r.stagger(i, r.initialDelay)), typeof r.offsetArray == "object" && (u = r.offsetArray.getOffset(i), e = r.getCss || w, r.name = r.endAtOffset ? v(e, 0, 0, u.left, u.top) : v(e, u.left, u.top, 0, 0)), typeof r.startOffsetArray == "object") {
                var s = r.startOffsetArray.getOffset(i), h = r.endOffsetArray.getOffset(i), e = r.getCss || w;
                r.name = v(e, s.left, s.top, h.left, h.top);
            }
    }

    function h(n) {
        n.style[r + "Animation"] = null;
    }

    function f(t) {
        t.each(function() {
            var t = n(this);
            t.css({height: t.height(),width: t.width()});
        });
    }

    function e(n) {
        n.css({height: "",width: ""});
    }

    function k(t, i, u) {
        for (var c = [], a = [], v = [], y = [], p = [], o = i.length, f, w, e = 0; e < o; e++)
            f = i[e], c.push(f.delay + "ms"), a.push(f.duration + "ms"), v.push(f.timing), y.push(f.name), p.push("both");
        return t.style[r + "AnimationDelay"] = c.join(","), t.style[r + "AnimationDuration"] = a.join(","), t.style[r + "AnimationTimingFunction"] = v.join(","), t.style[r + "AnimationName"] = y.join(","), t.style[r + "AnimationFillMode"] = p.join(","), w = new n.Deferred(function(r) {
            var f = function() {
                u && h(t);
                var i = n(t);
                clearTimeout(a),
                n(document).unbind(s, e),
                r.resolve()
            },
            e = function(n) {
                n.target === t && (o -= 1, o === 0 && f())
            }, c, a;

            n(document).bind(s, e), c = Math.max.apply(Math, i.map(function(n) {
                return n.delay + n.duration;
            })), 
            a = l.setTimeout(f, c + 100);
        });
    }

    function t(t, i, r, u) {
        var f, e, o, w;
        r = typeof r == "undefined" ? !0 : r;
        var s, c = [], l = n.makeArray(i), h = null;
        h = u ? n(t) : n(t).filter(":visible");
        var a = n.makeArray(h), v = a.length, y = function(n, t) {
            var i, u = {left: 0,top: 0};
            b(n, l, t), i = k(n, l, r), c.push(i)
        }, p = function() {
            s = n.Deferred().resolve()
        };
        try {
            if (v !== 0) {
                for (f = 0; f < v; f++)
                    if (e = a[f], e instanceof Array)
                        for (o = 0, w = e.length; o < w; o++)
                            y(e[o], f);
                    else
                        y(e, f);
                s = n.when.apply(n, c)
            } else
                p()
        } catch (d) {
            p()
        }
        return s
    }
    function w(n, t) {
        return n !== 0 || t !== 0 ? c + ":translate(" + n + "px," + t + "px);" : c + ":none;"
    }
    function v(n, t, i, r, u) {
        var e, f, s;
        if (r = r || 0, u = u || 0, t = Math.floor(t), i = Math.floor(i), r = Math.floor(r), u = Math.floor(u), e = p[0].sheet, f = "translate_" + [t, i, r, u].join("_"), !(f in a)) {
            s = "@{0}keyframes {1} { from { {2} } to { {3} }}".format(o, f, n(t, i), n(r, u));
            try {
                e.insertRule(s, e.cssRules.length),
                a[f] = !0;
            } catch (h) {
            }
        }
        return f;
    }
    var l = window, n = l.jQuery, u = l.wLive.Animations, o, r, d, s, a;
    if ($B.RE_WebKit)
        o = "-webkit-", r = "webkit", s = "webkitAnimationEnd";
    else if ($B.Firefox)
        o = "-moz-", r = "Moz", s = "animationend";
    else if ($B.IE && $B.V >= 10)
        o = "-ms-", r = "ms", s = "MSAnimationEnd";
    else
        return;
    var c = o + "transform", i = function(t, i) {
        var r, u;
        r = Array.isArray(t) && t.length > 0 ? t : t && t.hasOwnProperty("top") && t.hasOwnProperty("left") ? [t] : i ? i : [{top: "0px",left: "0px"}], u = r.length - 1, $B.rtl && n.each(r, function(n, t) {
            t.left = -t.left
        }), this.getOffset = function(n) {
            return n > u && (n = u), r[n];
        }
    }, p = n("<style>");
    n("head").append(p), a = {}, n.extend(u, {Direction: {Horizontal: "Width",Vertical: "Height"},Enabled: !0,expand: function(i, r) {
            var o = n(i), s;
            return o.show(), f(o), s = t(i, [{name: "FadeIn",delay: 200,duration: 167,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, {name: "Show" + (r || u.Direction.Vertical),delay: 0,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]), s.then(function() {
                e(o);
            }), s.promise();
        },
        collapse: function(i, r) {
            var o = n(i), s;
            return f(o), s = t(i, [{name: "FadeOut",delay: 0,duration: 167,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, {name: "Hide" + (r || u.Direction.Vertical),delay: 167,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]), s.then(function() {
                o.hide(), e(o)
            }), s.promise()
        },
        fadeIn: function(i, r) {
            return n(i).show(), t(i, {name: "FadeIn",delay: 0,duration: 167,timing: "linear"}, r).promise()
        },
        fadeOut: function(i, r) {
            var u = t(i, {name: "FadeOut",delay: 0,duration: 200,timing: "linear"}, r).promise();
            return u.then(function() {
                n(i).hide()
            }), u
        },
        addToList: function(i, r) {
            var o = n(i), s;
            return o.show(), f(o), s = t(i, [{name: "ScaleIn",delay: 167,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, {name: "FadeIn",delay: 167,duration: 167,timing: "linear"}, {name: "Show" + (r || u.Direction.Vertical),delay: 0,duration: 500,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]), s.then(function() {
                e(o);
            }), s.promise();
        },
        deleteFromList: function(i, r) {
            var o = n(i), s;
            return o.show(), f(o), s = t(i, [{name: "ScaleOut",delay: 0,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, {name: "FadeOut",delay: 0,duration: 167,timing: "linear"}, {name: "Hide" + (r || u.Direction.Vertical),delay: 167,duration: 500,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]), s.then(function() {
                o.hide(), e(o)
            }), s.promise()
        },
        addToSearchList: function(i, r) {
            var o = n(i), s;
            return o.show(), f(o), s = t(i, [{name: "FadeIn",delay: 0,duration: 50,timing: "linear"}, {name: "Show" + (r || u.Direction.Vertical),delay: 0,duration: 300,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]), s.then(function() {
                e(o);
            }), s.promise();
        },
        deleteFromSearchList: function(i, r) {
            var o = n(i), s;
            return f(o), s = t(i, [{name: "FadeOut",delay: 0,duration: 50,timing: "linear"}, {name: "Hide" + (r || u.Direction.Vertical),delay: 0,duration: 300,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]), s.then(function() {
                o.hide(), e(o)
            }), s.promise()
        },
        deleteFromListFast: function(r, u, f) {
            var o = t(r, [{name: "FadeOut",delay: 0,duration: 50,timing: "linear"}], !1), s = new i(f), c = t(u, [{offsetArray: s,delay: 0,duration: 300,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)",endAtOffset: !0}], !1), e = n.Deferred();
            return n.when(o, c).then(function() {
                e.resolve(), n(r).each(function() {
                    h(this)
                }), n(u).each(function() {
                    h(this)
                })
            }), e.promise()
        },
        addAndDeleteInListFast: function(r, u, f, e, o) {
            for (var a = n.Deferred(), v = [], p = [], w = [], b = [], k = [], d = [], g = [], c, s = 0; s < f.length; s++)
                c = f[s], n.inArray(c, r) !== -1 ? (v.push(e[s]), p.push(o[s])) : n.inArray(c, u) !== -1 ? (w.push(e[s]), b.push(o[s])) : (k.push(e[s]), d.push(o[s]), g.push(c));
            var nt = n(r).filter(":visible"), l = n(u).filter(":visible"), tt = n(g).filter(":visible");
            return l.addClass("NoDisplay"), y(function() {
                l.removeClass("NoDisplay");
                var r = t(nt, [{name: "FadeOut",delay: 0,duration: 50,timing: "linear"}, {startOffsetArray: new i(v),endOffsetArray: new i(p),delay: 0,duration: 300,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}], !1, !0), u = t(l, [{name: "FadeIn",delay: 0,duration: 50,timing: "linear"}, {startOffsetArray: new i(w),endOffsetArray: new i(b),delay: 0,duration: 300,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}], !1, !0), e = t(tt, [{startOffsetArray: new i(k),endOffsetArray: new i(d),delay: 0,duration: 300,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}], !1, !0);
                n.when(r, u, e).then(function() {
                    a.resolve(), n(f).each(function() {
                        h(this)
                    })
                })
            }), a.promise()
        },
        showEdgeUI: function(r, u, f) {
            n(r).show();
            var e = new i(u);
            return t(r, {offsetArray: e,delay: 0,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, f).promise()
        },
        showPanel: function(r, u) {
            n(r).show();
            var f = new i(u);
            return t(r, {offsetArray: f,delay: 0,duration: 733,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}).promise()
        },
        hideEdgeUI: function(r, u, f) {
            var o = new i(u), e = t(r, {offsetArray: o,delay: 0,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)",endAtOffset: !0}, f);
            return e.then(function() {
                n(r).hide()
            }), e.promise()
        },
        hidePanel: function(r, u) {
            var e = new i(u), f = t(r, {offsetArray: e,delay: 0,duration: 733,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)",endAtOffset: !0});
            return f.then(function() {
                n(r).hide()
            }), f.promise()
        },
        flyAway: function(n, r) {
            var u = new i(r), 
                f = t(n, [{name: "FlyAwayScale",delay: 0,duration: 366,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, {offsetArray: u,delay: 366,duration: 366,timing: "cubic-bezier(0.11, 0.5, 0.24, 0.96)",endAtOffset: !0,getCss: function(n, t) {
                        var i = "";
                        return (n !== 0 || t !== 0) && (i = "left:" + n + "px; top:" + t + "px"), i
                    }}, {name: "FadeOut",delay: 366,duration: 366,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]);
            return f.promise()
        },
        showPopup: function(r, u) {
            n(r).show();
            var f = new i(u, [{top: "50",left: "0"}]);
            return t(r, [{name: "FadeIn",delay: 83,duration: 83,timing: "linear"}, {offsetArray: f,delay: 0,duration: 367,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}]).promise();
        },
        hidePopup: function(i) {
            return t(i, {name: "FadeOut",delay: 0,duration: 83,timing: "linear"}).promise().then(function() {
                n(i).hide();
            });
        },
        enterContent: function(r, u, f, e) {
            var s = n.Deferred(), o = n(r);
            return e || o.show(), o.css("visibility", "hidden"), y(function() {
                o.css("visibility", "visible"), t(r, [{offsetArray: new i(u, [{top: 0,left: 40}]),delay: 0,duration: 370,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}, {name: "FadeIn",delay: 0,duration: 170,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}], f, !0).then(function() {
                    s.resolve();
                })
            }), s.promise();
        },
        exitContent: function(r, u, f) {
            var e = t(r, [{offsetArray: new i(u, [{top: 0,left: -10}]),delay: 0,duration: 80,timing: "linear"}, {name: "FadeOut",delay: 0,duration: 80,timing: "linear"}], f);
            return e.then(function() {
                n(r).hide()
            }), e.promise()
        },
        reveal: function(r, u, f, e, o) {
            var l = new i(f, [{top: "0px",left: "-10px"}]), a = t(u, {offsetArray: l,delay: 0,duration: 450,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}), h = t(e, {name: "FadeIn",delay: 0,duration: 50,timing: "linear"}), s;
            return h.then(function() {
                n(e).css("opacity", 1)
            }), s = t(o, {name: "Tap",delay: 0,duration: 200,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}), s.then(function() {
                n(o).css(c, "scale(1.05)")
            }), n.when(a, h, s).promise()
        },
        hide: function(r, u, f, e, o) {
            var l = new i(f, [{top: "0px",left: "10px"}]), a = t(u, {offsetArray: l,delay: 0,duration: 200,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}), h = t(e, {name: "FadeOut",delay: 0,duration: 50,timing: "linear"}), s;
            return h.then(function() {
                n(e).css("opacity", 0)
            }), s = t(o, {name: "Untap",delay: 0,duration: 100,timing: "cubic-bezier(0.1, 0.9, 0.2, 1)"}), s.then(function() {
                n(o).css(c, "none")
            }), n.when(a, h, s).promise()
        }})
})()
