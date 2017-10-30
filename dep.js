function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = '[\\?&]' + name + '=([^&#]*)', regex = new RegExp(regexS), results = regex.exec(window.location.search);
    return null == results ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function onYouTubeIframeAPIReady() {
    YouTubeAPIReady = !0;
}

function scrollTo(e, t, n) {
    var i = getScrollTop(e),
        s = t - i,
        o = 0,
        u = function() {
            o += 16;

            var t = Math.easeInOutQuad(o, i, s, n);
            getScrollTop(e, t), n > o && window.requestAnimationFrame(u);
        };
    u();
}

function returnTrue() {
    return !0;
}

function returnFalse() {
    return !1;
}

function hasClass(target, className) {
    return new RegExp("(\\s|^)" + className + "(\\s|$)").test(target.className);
}

function fade(type, el, duration, callback) {
    function func() {
        opacity = isIn ? opacity + gap : opacity - gap, el.style.opacity = opacity, el.style.filter = "alpha(opacity=" + 100 * opacity + ")", el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + 100 * opacity + ")", (0 >= opacity || opacity >= 1) && window.clearInterval(fading), 0 >= opacity && (el.style.display = "none", callback && callback())
    }

    var isIn = "in" == type, opacity = isIn ? 0 : 1, interval = 50, gap = interval / duration;
    isIn && (el.style.display = "block", el.style.opacity = opacity, el.style.filter = "alpha(opacity=" + opacity + ")", el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + opacity + ")");
    var fading = window.setInterval(func, interval)
}

var imageSequenceAnimation = function(_options, callback) {
    var Element,
        Current_Child,
        Next_Child,
        Next_Next_Child,
        Previous_Child,
        Previous_Previous_Child,
        animationInterval,
        options,
        _inst = this,
        Current_Frame = 0,
        Previous_Frame = 0,
        Reverse = "false",
        imageSeqIinitialize = function(_options, callback) {
            var defaults = {
                fps: 12,
                totalFrames: 10,
                loop: !1,
                srcBase: "images/sprite",
                ext: "jpg",
                sequenceElement: null,
                stopAt: null,
                loadingVisible: !0,
                loadingElement: null,
                loadCallBack: null,
                autoplay: !0,
                frametype: "img",
                loadCallBack: function() {},
                animationCompleteCallback: function() {},
                revAnimationCompleteCallback: function() {
            }};
            _inst.options = mergeObjects(defaults, _options), callback && (options.loadCallBack = callback), Element = _inst.options.sequenceElement, createLoadCarousel();
        },

        createLoadCarousel = function() {
            if ("img" == _inst.options.frametype)
                var divA = document.createElement("img"),
                    divB = document.createElement("img"),
                    divC = document.createElement("img"),
                    divD = document.createElement("img"),
                    divE = document.createElement("img");
            else
                var divA = document.createElement("div"),
                    divB = document.createElement("div"),
                    divC = document.createElement("div"),
                    divD = document.createElement("div"),
                    divE = document.createElement("div");

            divA.className = "a",
            divA.style.position = "absolute",
            divA.style.height = "100%",
            divA.style.width = "100%",
            divA.style.top = 0,
            divA.style.left = 0,
            divA.style.backgroundPosition = "top center",
            divB.className = "b",
            divB.style.position = "absolute",
            divB.style.height = "100%",
            divB.style.width = "100%",
            divB.style.top = 0,
            divB.style.left = 0,
            divB.style.backgroundPosition = "top center",
            divC.className = "c",
            divC.style.position = "absolute",
            divC.style.height = "100%",
            divC.style.width = "100%",
            divC.style.top = 0,
            divC.style.left = 0,
            divC.style.backgroundPosition = "top center",
            divD.className = "d",
            divD.style.position = "absolute",
            divD.style.height = "100%",
            divD.style.width = "100%",
            divD.style.top = 0,
            divD.style.left = 0,
            divD.style.backgroundPosition = "top center",
            divE.className = "e",
            divE.style.position = "absolute",
            divE.style.height = "100%",
            divE.style.width = "100%",
            divE.style.top = 0,
            divE.style.left = 0,
            divE.style.backgroundPosition = "top center",
        "img" == _inst.options.frametype && (divA.style.height = "auto", divB.style.height = "auto", divC.style.height = "auto", divD.style.height = "auto", divE.style.height = "auto"), Element.appendChild(divB), Element.appendChild(divC), Element.appendChild(divD), Element.appendChild(divE), Element.appendChild(divA), Current_Child = $$(".a", Element), Next_Child = $$(".b", Element), Next_Next_Child = $$(".d", Element), Previous_Child = $$(".c", Element), Previous_Previous_Child = $$(".e", Element), Previous_Child.style.display = "none", Next_Child.style.display = "none", Previous_Previous_Child.style.display = "none", Next_Next_Child.style.display = "none", Current_Child.style.display = "block";
        var nF = Current_Frame < _inst.options.totalFrames ? Current_Frame + 1 : _inst.options.totalFrames, nnF = Current_Frame + 1 < _inst.options.totalFrames ? Current_Frame + 2 : _inst.options.totalFrames, pF = Current_Frame > 0 ? Current_Frame - 1 : 0, ppF = Current_Frame - 1 > 0 ? Current_Frame - 2 : 0;
        "img" == _inst.options.frametype ? (Current_Child.src = _inst.options.srcBase + Current_Frame + "." + _inst.options.ext, Next_Child.src = _inst.options.srcBase + nF + "." + _inst.options.ext, Next_Next_Child.src = _inst.options.srcBase + nnF + "." + _inst.options.ext, Previous_Child.src = _inst.options.srcBase + pF + "." + _inst.options.ext, Previous_Previous_Child.src = _inst.options.srcBase + ppF + "." + _inst.options.ext) : (Current_Child.style.backgroundImage = "url('" + _inst.options.srcBase + Current_Frame + "." + _inst.options.ext + "')", Next_Child.style.backgroundImage = "url('" + _inst.options.srcBase + nF + "." + _inst.options.ext + "')", Next_Next_Child.style.backgroundImage = "url('" + _inst.options.srcBase + nnF + "." + _inst.options.ext + "')", Previous_Child.style.backgroundImage = "url('" + _inst.options.srcBase + pF + "." + _inst.options.ext + "')", Previous_Previous_Child.style.backgroundImage = "url('" + _inst.options.srcBase + ppF + "." + _inst.options.ext + "')")
    },

    animate = function(single, reverse) {
        if (a = Current_Child, b = Next_Child, c = Previous_Child, d = Next_Next_Child, e = Previous_Previous_Child, "true" != reverse ? (Current_Child = b, Previous_Child = a, Next_Child = d, Previous_Previous_Child = c, Next_Next_Child = e, Previous_Child.style.display = "none", Next_Child.style.display = "none", Previous_Previous_Child.style.display = "none", Next_Next_Child.style.display = "none", Current_Child.style.display = "block", "single" != single && (Current_Frame < _inst.options.totalFrames ? (Previous_Frame = Current_Frame, Current_Frame++) : 1 == _inst.options.loop ? Current_Frame = Previous_Frame = 1 : (clearInterval(animationInterval), _inst.options.animationCompleteCallback()), _inst.options.stopAt && Current_Frame >= _inst.options.stopAt && clearInterval(animationInterval))) : (Current_Child = c, Previous_Child = e, Next_Child = a, Previous_Previous_Child = d, Next_Next_Child = b, Previous_Child.style.display = "none", Next_Child.style.display = "none", Previous_Previous_Child.style.display = "none", Next_Next_Child.style.display = "none", Current_Child.style.display = "block", "single" != single && (Current_Frame >= 0 ? (Previous_Frame = Current_Frame, Current_Frame--) : 1 == _inst.options.loop ? Current_Frame = Previous_Frame = _inst.options.totalFrames : (clearInterval(animationInterval), _inst.options.revAnimationCompleteCallback()), _inst.options.stopAt && Current_Frame <= _inst.options.stopAt && clearInterval(animationInterval))), 1 == _inst.options.loop)
            var nF = Current_Frame < _inst.options.totalFrames ? Current_Frame + 1 : 0, nnF = Current_Frame + 1 < _inst.options.totalFrames ? Current_Frame + 2 : 1, pF = Current_Frame > 0 ? Current_Frame - 1 : 0, ppF = Current_Frame - 1 > 0 ? Current_Frame - 2 : _inst.options.totalFrames;
        else
            var nF = Current_Frame < _inst.options.totalFrames ? Current_Frame + 1 : _inst.options.totalFrames, nnF = Current_Frame + 1 < _inst.options.totalFrames ? Current_Frame + 2 : 0, pF = Current_Frame > 0 ? Current_Frame - 1 : 0, ppF = Current_Frame - 1 > 0 ? Current_Frame - 2 : _inst.options.totalFrames;
        "img" == _inst.options.frametype ? (Next_Child.src = _inst.options.srcBase + nF + "." + _inst.options.ext, Next_Next_Child.src = _inst.options.srcBase + nnF + "." + _inst.options.ext, Previous_Child.src = _inst.options.srcBase + pF + "." + _inst.options.ext, Previous_Previous_Child.src = _inst.options.srcBase + ppF + "." + _inst.options.ext) : (Next_Child.style.backgroundImage = "url('" + _inst.options.srcBase + nF + "." + _inst.options.ext + "')", Next_Next_Child.style.backgroundImage = "url('" + _inst.options.srcBase + nnF + "." + _inst.options.ext + "')", Previous_Child.style.backgroundImage = "url('" + _inst.options.srcBase + pF + "." + _inst.options.ext + "')", Previous_Previous_Child.style.backgroundImage = "url('" + _inst.options.srcBase + ppF + "." + _inst.options.ext + "')")
    };

    _inst.model = function() {
        return options
    },

    _inst.start = function() {
        clearInterval(animationInterval), animationInterval = setInterval(function() {
            animate("interval", Reverse)
        }, parseInt(1e3 / _inst.options.fps))
    },

    _inst.pause = function() {
        clearInterval(animationInterval)
    },

    _inst.reverse = function(bool, autoplay) {
        Reverse = bool, "true" == autoplay && (clearInterval(animationInterval), animationInterval = setInterval(function() {
            animate("interval", Reverse)
        }, parseInt(1e3 / _inst.options.fps)))
    },

    _inst.reset = function() {
        Current_Frame = 1, animate()
    },

    _inst.element = function() {
        return Element
    },

    _inst.changeRow = function(num) {
        Current_Row = num
    },

    _inst.goToFrame = function(num) {
        return Current_Frame != parseInt(num) && (Current_Frame = parseInt(num), Previous_Frame > Current_Frame ? animate("single", !0) : animate("single")), Element
    },

    _inst.step = function() {
        return options.cols > Current_Frame + 1 && (Current_Frame++, animate()), Element
    },

    imageSeqIinitialize(_options, callback);
},

spriteAnimation = function(_options, callback) {
    var Element,
        animationInterval,
        _inst = this,
        Current_Frame = 1,
        Current_Row = 1,
        Reverse = 'false';

    _options = _options || {};
    var spriteIinitialize = function(_options, callback) {
        var defaults = {fps: 12,cols: 10,rows: 2,stopAt: null,cell_width: 250,cell_height: 250,loop: !1,stopAt: null,src: "images/sprite.png",spriteElement: null,endFrame: null,loadingVisible: !0,loadingElement: null,loadCallBack: null,autoplay: !0,loadCallBack: function() {
            },animationCompleteCallback: function() {
            }};
        _inst.options = mergeObjects(defaults, _options), callback && (_inst.options.loadCallBack = callback), Element = _inst.options.spriteElement, Element.spriteAnimation = _inst, Element && (Element.style.backgroundImage = "url(" + _inst.options.src + ")")
    }, 

    animate = function() {
        var xPos = -((Current_Frame - 1) * _inst.options.cell_width), 
            yPos = -((Current_Row - 1) * _inst.options.cell_height), 
            el = Element;

        el.style.backgroundPosition = xPos + "px " + yPos + "px", 
        "true" != Reverse ? 
            (Current_Frame < _inst.options.cols ? 
                Current_Frame++ : 
                1 == _inst.options.loop ? Current_Frame = 1 : (null != _inst.options.endFrame && (el.style["background-position"] = _inst.options.cell_width + "px"), 

                clearInterval(animationInterval)), 

            _inst.options.stopAt && Current_Frame >= _inst.options.stopAt && clearInterval(animationInterval)) 
            : (Current_Frame > 1 ? Current_Frame-- : 1 == _inst.options.loop ? Current_Frame = _inst.options.cols : clearInterval(animationInterval), _inst.options.stopAt && Current_Frame <= _inst.options.stopAt && clearInterval(animationInterval))
    };

    spriteIinitialize(_options, callback), this.model = function() {
        return options
    },

    this.instructions = function() {
        return instructions
    },

    this.image = function() {
        return options.src
    },

    this.start = function() {
        clearInterval(animationInterval), animationInterval = setInterval(function() {
            animate()
        }, parseInt(1e3 / _inst.options.fps))
    },

    this.pause = function() {
        clearInterval(animationInterval)
    },

    this.reset = function() {
        Current_Frame = 1;
        var xPos = -((Current_Frame - 1) * _inst.options.cell_width), yPos = -((Current_Row - 1) * _inst.options.cell_height), el = $$(Element);
        el.style["background-position"] = xPos + "px " + yPos + "px"
    },

    this.reverse = function(bool, autoplay) {
        Reverse = bool, "true" == autoplay && (clearInterval(animationInterval), animationInterval = setInterval(function() {
            animate()
        }, parseInt(1e3 / _inst.options.fps)))
    },

    this.element = function() {
        return Element
    },

    this.changeRow = function(num) {
        Current_Row = num
    },

    this.goToFrame = function(num) {
        return 1 > num && (num = 1), num > _inst.options.cols && (num = _inst.options.cols), Current_Frame = parseInt(num), animate(), Element
    },

    this.step = function() {
        return _inst.options.cols > Current_Frame + 1 && (Current_Frame++, animate()), Element
    }
},

HostedVideoPlayer = function(_options, callback) {
    var _inst = this;
    _options = _options ? _options : {};
    var trackInterval,
        player = null,
        created = !1,
        HostedVideoPlayerInitialize = function(_options, callback) {
            var defaults = {
                container: null,
                srcBase: null,
                autoCreate: "true",
                autoplay: "false",
                loop: "false",
                playCompleteCallback: function() {}
            };
            _inst.options = mergeObjects(defaults, _options),
            callback && (_inst.options.playCompleteCallback = callback),
            "true" == _inst.options.autoCreate && create(),
            _inst.options.container.HostedVideoPlayer = _inst
        },

    create = function() {
        if (-1 !== navigator.userAgent.indexOf("MSIE 8")) {
            var bak_image = new Image;
                bak_image.src = _inst.options.srcBase + ".jpg",
                bak_image.className = "poster",
                _inst.options.container.appendChild(bak_image);
        } else {
            var Vid = ce("video");
            Vid.className = "opacityZero", Vid.poster = _inst.options.srcBase + ".jpg", "true" == _inst.options.autoplay && (Vid.autoplay = "autoplay"), "true" == _inst.options.loop && (Vid.loop = "loop"), Vid.height = "960", Vid.width = "540", Vid.style.position = "absolute", Vid.style.left = "0px", Vid.style.height = "100%", Vid.style.width = "auto";
            var Mp4 = ce("source"), Webm = ce("source"), Ogv = ce("source");
            Mp4.type = "video/mp4", Webm.type = "video/webm", Ogv.type = "video/ogg", Mp4.src = _inst.options.srcBase + ".mp4", Webm.src = _inst.options.srcBase + ".webm", Ogv.src = _inst.options.srcBase + ".ogv", Vid.appendChild(Mp4), Vid.appendChild(Webm), Vid.appendChild(Ogv), _inst.options.container.appendChild(Vid)
        }
    },

    ce = function(e) {
        return document.createElement(e)
    };

    _inst.create = function() {
        return created ? "already created, guy" : (create(), void 0)
    },

    _inst.player = function() {
        return player
    },

    _inst.pause = function() {
        return player.pauseVideo()
    },

    _inst.play = function() {
        return player.playVideo()
    },

    _inst.destroy = function() {
        clearInterval(trackInterval), player = null, _inst = null
    },

    HostedVideoPlayerInitialize(_options, callback)
},

traskList = function(_options, callback) {
    var _inst = this;
    _options = _options ? _options : {};
    var currElem, advanceInterval, scrollTick = 0;
    _inst.options;
    var traskListInitialize = function(_options, callback) {
        var defaults = {
            contents: [],
            nav: [],
            scrollContext: window,
            scrollResolution: 5,
            autoAdvanceTime: 5e3,
            changeItemListeners: [],
            animateInCallback: function() {},
            animateOutCallback: function() {},
            initCompleteCallback: function() {}
        };

        _inst.options = mergeObjects(defaults, _options), callback && (_inst.options.initCompleteCallback = callback), "true" == _inst.options.autoAdvance && (advanceInterval = setInterval(stepForward, _inst.options.autoAdvanceTime)), _inst.options.nav.length > 0 && setupNav(), _inst.bindScroll()
    },

    setupNav = function() {
        for (var i = 0; i < _inst.options.nav.length; i++)
            vine.bind(_inst.options.nav[i], "click", function(e) {
                for (var targ = e.srcElement || e.currentTarget, targ_rel = e.srcElement && e.srcElement.getAttribute ? e.srcElement.getAttribute("rel") : e.currentTarget.attributes.rel.value, i = 0; i < _inst.options.nav.length; i++)
                    _inst.options.nav[i] -= " active";
                targ.className += " active", change(targ_rel)
            })
    },

    stepForward = function() {},

    change = function(rel, external) {
        _inst.options.animateOutCallback(currElem);
        for (var i = 0; i < _inst.options.contents.length; i++) {
            var t = _inst.options.contents[i], tR = t.getAttribute ? t.getAttribute("rel") : t.attributes.rel.value;
            rel == tR && (currElem = t)
        }
        if (_inst.options.animateInCallback(currElem), "true" != external)
            for (var l = _inst.options.changeItemListeners, i = 0; i < l.length; i++)
                l[i](rel)
    },

    scrollListen = function() {
        if (scrollTick == _inst.options.scrollResolution) {
            for (var param = _inst.options.scrollContext == window ? "" : _inst.options.scrollContext, cS = getScrollTop(param), currPlace = null, i = 0; i < _inst.options.contents.length; i++)
                cS > _inst.options.contents[i].offsetTop - 200 && cS < _inst.options.contents[i].offsetTop + _inst.options.contents[i].offsetHeight - 200 && (currPlace = i);
            if (currPlace && currElem != _inst.options.contents[currPlace]) {
                currElem = _inst.options.contents[currPlace];
                for (var rel = currElem.getAttribute ? currElem.getAttribute("rel") : currElem.attributes.rel.value, l = _inst.options.changeItemListeners, i = 0; i < l.length; i++)
                    l[i](rel, currElem)
            }
            scrollTick = 0
        } else
            scrollTick++
    };

    _inst.goTo = function(rel) {
        change(rel, "true");
    },

    _inst.addListener = function(func) {
        _inst.options.changeItemListeners.push(func)
    },

    _inst.bindScroll = function() {
        vine.unbind($$(_inst.options.scrollContext), "scroll", scrollListen), vine.bind($$(_inst.options.scrollContext), "scroll", scrollListen)
    },

    _inst.unBindScroll = function() {
        vine.unbind($$(_inst.options.scrollContext), "scroll", scrollListen)
    },

    traskListInitialize(_options, callback)
},

traskMarquee = function(_options, callback) {
    var _inst = this;
    _options = _options ? _options : {};
    var advanceInterval, currElem = "";
    _inst.options;
    var traskMarqueeInitialize = function(_options, callback) {
        var defaults = {
            contents: [],
            nav: [],
            autoAdvance: "false",
            autoAdvanceTime: 8e3,
            changeItemListeners: [],
            animateInCallback: function() {},
            animateOutCallback: function() {},
            initCompleteCallback: function() {}
        };

        _inst.options = mergeObjects(defaults, _options), callback && (_inst.options.initCompleteCallback = callback), "true" == _inst.options.autoAdvance && (advanceInterval = setInterval(stepForward, _inst.options.autoAdvanceTime)), _inst.options.nav.length > 0 && setupNav()
    },

    setupNav = function() {
        if (_inst.options.nav.length < 2)
            _inst.options.nav.parentNode.parentNode.style.display = "none";
        else
            for (var i = 0; i < _inst.options.nav.length; i++) {
                var t = _inst.options.nav[i] || _inst.options.nav;
                vine.bind(t, "click", clickNav)
            }
        showFirst()
    },

    clickNav = function(e) {
        for (var targ = e.srcElement || e.currentTarget || e, targ_rel = targ.getAttribute ? targ.getAttribute("rel") : targ.attributes.rel.value, i = 0; i < _inst.options.nav.length; i++) {
            var t = _inst.options.nav[i] || _inst.options.nav;
            t = t.className.split(" active").join("")
        }
        targ.className += " active", change(targ_rel)
    },

    showFirst = function() {
        var t = _inst.options.nav[0] || _inst.options.nav, c = _inst.options.contents[0] || _inst.options.contents;
        t.getAttribute ? t.getAttribute("rel") : t.attributes.rel.value, t.className += " active", c.className += " active", currElem = c
    },

    stepForward = function() {
        for (var c = _inst.options.contents, x = 0, i = 0; i < c.length; i++)
            c[i] ? currElem == c[i] && (x = i) : currElem == c && (x = i);
        var nI = x >= c.length - 1 ? 0 : x + 1, cn = c[nI] ? c[nI] : c, rel = cn.getAttribute ? cn.getAttribute("rel") : cn.attributes.rel.value;
        change(rel, "true")
    },

    change = function(rel, external) {
        for (var foundElement = "", i = 0; i < _inst.options.contents.length; i++) {
            var t = _inst.options.contents[i] || _inst.options.contents, tR = t.getAttribute ? t.getAttribute("rel") : t.attributes.rel.value;
            rel == tR && (foundElement = t)
        }
        if ("" != foundElement)
            if (currElem && _inst.options.animateOutCallback(currElem), currElem = foundElement, _inst.options.animateInCallback(currElem), "true" != external)
                for (var l = _inst.options.changeItemListeners, i = 0; i < l.length; i++)
                    l[i](rel);
            else
                for (var i = 0; i < _inst.options.nav.length; i++) {
                    var t = _inst.options.nav[i] || _inst.options.nav, tR = t.getAttribute ? t.getAttribute("rel") : t.attributes.rel.value;
                    tR == rel ? t.className += " active" : t.className = t.className.split(" active").join("")
                }
    };

    traskMarqueeInitialize(_options, callback),

    _inst.goTo = function(rel) {
        change(rel, "true");
    },

    _inst.addListener = function(func) {
        _inst.options.changeItemListeners.push(func);
    },

    _inst.pause = function(toggle) {
        clearInterval(advanceInterval), "false" == toggle && (advanceInterval = setInterval(stepForward, _inst.options.autoAdvanceTime));
    }
},

YTPlayerWrapper = function(_options, callback) {
    var _inst = this;
    _options = _options ? _options : {};
    var trackInterval,
        player = null,
        created = !1,
        completed = "",
        YTPlayerWrapperInitialize = function(_options, callback) {
            var defaults = {
                container: null,
                nav: null,
                height: "100%",
                width: "100%",
                autoplay: 1,
                autoCreate: "true",
                vidID: "4PDJcw9oJt0",
                attachToDOM: "false",
                playingCallBack: function() {},
                playCompleteCallback: function() {
            }
        };
        _inst.options = mergeObjects(defaults, _options), callback && (_inst.options.playCompleteCallback = callback), "true" == _inst.options.autoCreate && create()
    },

    create = function() {
        if (1 != YouTubeAPIReady)
            setTimeout(create, 1e3);
        else {
            if (null == _inst.options.container)
                return alert("the video needs to go into a container, guy");
            player = new YT.Player(_inst.options.container, {height: _inst.options.height,width: _inst.options.width,playerVars: {showinfo: 0,wmode: "transparent",autoplay: _inst.options.autoplay,rel: 0,color: "white"},videoId: _inst.options.vidID,events: {onReady: onPlayerReady,onStateChange: onPlayerStateChange}}), _inst.options.nav && _inst.options.nav.length > 0 && setupNav(), created = !0
        }
    },

    setupNav = function() {},

    onPlayerReady = function() {
        clearInterval(trackInterval), trackInterval = setInterval(trackVidProgress, 1e3), _inst.options.attachToDOM && ($$("#" + _inst.options.container).YT = _inst)
    },

    trackVidProgress = function() {
        switch (t = player.getCurrentTime(), d = player.getDuration(), perc = t / d, !0) {
            case perc > 0 && .25 > perc:
                "partial" != completed && (completed = "partial");
                break;
            case perc > .25 && .5 > perc:
                "medium" != completed && (completed = "medium");
                break;
            case perc > .5 && .75 > perc:
                "majority" != completed && (completed = "majority");
                break;
            case perc > .75 && 1 > perc:
                "complete" != completed && (completed = "complete")
        }
    },

    onPlayerStateChange = function(e) {
        switch (e.data) {
            case YT.PlayerState.PLAYING:
                _inst.options.playingCallBack(_inst.options.container)
        }
    };

    _inst.create = function() {
        return created ? "already created, guy" : (create(), void 0)
    },

    _inst.player = function() {
        return player
    },

    _inst.pause = function() {
        return player.pauseVideo()
    },

    _inst.play = function() {
        return player.playVideo()
    },

    _inst.destroy = function() {
        clearInterval(trackInterval), player = null, _inst = null
    },

    YTPlayerWrapperInitialize(_options, callback)
},

YouTubeAPIReady = !1, 
setupYoutube = function() {
    var tag = document.createElement("script");
    tag.className += " yt_api_inst_trask", tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag), getParameterByName("v")
};

setupYoutube(), !function(e) {
    "function" == typeof define && define.amd ? define(e) : window.onDomReady = e()
}

(function() {
    "use strict";
    function d(e) {
        if (!h) {
            if (!t.body)
                return m(d);
            for (h = !0; e = p.shift(); )
                m(e)
        }
    }
    function v() {
        l ? (t.removeEventListener(a, v, r), d()) : t[s] === i && (t.detachEvent(f, v), d())
    }
    function m(e, t) {
        setTimeout(e, +t >= 0 ? t : 1)
    }
    function y(e) {
        h ? m(e) : p.push(e)
    }
    var e = window,
        t = e.document,
        n = t.documentElement,
        r = !1,
        i = "complete",
        s = "readyState",
        o = "attachEvent",
        u = "addEventListener",
        a = "DOMContentLoaded",
        f = "onreadystatechange",
        l = u in t,
        c = r,
        h = r,
        p = [];

    if (t[s] === i)
        m(d);
    else if (l)
        t[u](a, v, r), e[u]("load", d, r);
    else {
        t[o](f, v), e[o]("onload", d);
        try {
            c = null == e.frameElement && n
        } catch (g) {

        }

        c && c.doScroll && function b() {
            if (!h) {
                try {
                    c.doScroll("left")
                } catch (e) {
                    return m(b, 50)
                }
                d()
            }
        }()
    }
    return y.version = "1.2", y;
});

var m = function(e, t, n) {
    for (t = document, n = t.createElement("p"), n.innerHTML = e, e = t.createDocumentFragment(); t = n.firstChild; )
        e.appendChild(t);
    return e
},

$$ = function(e, t) {
    var r,
        n = e.match(/^(\W)?(.*)/);

    n[1] ? "#" == n[1] ? (r = "getElementById", e = n[2]) : r = "querySelectorAll" : (r = "getElementsByTagName", e = n[2]);
    var i = (t || document)[r](e);
    return null == i || "undefined" == i ? i = null : i.length && 1 == i.length && (i = i[0], i.length = 1), i
};

vine = function(a, b, c, d, e, f, g, h, i) {
    function j(d, e) {
        return e = d[a] = d[a] || b++, c[e] || (c[e] = {b: {},e: {}})
    }

    function k(a) {
        return a.charAt ? g.getElementById(a) : a
    }

    return h = {
        d: j,
        id: k,
        Event: i = function(a, b, c) {
            c = this;
            for (b in a)
                c[b] = c[b] || a[b];
            c.timestamp = +new Date, c.target || (c.target = c.srcElement)
        },

        bind: function(a, b, c, g, i, l, m, n) {
            if ((n = (m = b.split(" ")).length) > 1)
                for (; n--; )
                    h.bind(a, m[n], c);
            else
                a = k(a),
                i = j(a),
                (l = /^(.+)\.([^\.]+)$/.exec(b)) && (b = l[2], l = l[1]), (i.e[b] || (i.e[b] = [])).push({n: l,f: c,d: g || {}}), !i.b[b] && (i.b[b] = 1, a[e] ? a[e](b, function(c) {
                    h.trigger(a, b, c)[d] && c.preventDefault()
                }, null) : a[f]("on" + b, function() {
                    return !h.trigger(a, b, window.event)[d]
                }))
        },

        trigger: function(a, b, c, e, f, h, l, m, n) {
            if (a = k(a), !c && a.nodeType) {
                if (!a.fireEvent)
                    return l = g.createEvent((init = /click|mousedown|mouseup|mousemove/.test(b)) ? "MouseEvents" : "HTMLEvents"), l[init ? "initMouseEvent" : "initEvent"](b, !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), a.dispatchEvent(l), l;
                try {
                    return new i({defaultPrevented: a["click" === b ? b : fireEvent]("on" + b)})
                } catch (o) {
                }
            }
            if (l = new i(c || {}), e = j(a).e[b]) {
                for (f = 0, h = e.length; h > f; f++)
                    (n = e[f]) && (l.namespace = n.n, l.data = n.d, m = m || n.f.call(a, l) === !1);
                l[d] = l[d] || m
            }
            return l
        },

        unbind: function(b, d, e, f, g, h, i) {
            if (b = k(b), !d)
                return c[b[a]] = b[a] = null;
            if (e = j(b), d.charAt)
                if ("." === d.charAt(0)) {
                    d = d.substring(1);
                    for (g in e.e)
                        for (i = e.e[g], h = i.length, f = 0; h > f; f++)
                            i[f].n === d && (i[f] = null)
                } else
                    e.e[d] = [];
            else
                for (g in e.e)
                    for (i = e.e[g], h = i.length, f = 0; h > f; f++)
                        i[f].f === d && (i[f] = null)
        }
    },

    i.prototype = {
        defaultPrevented: !1,
        preventDefault: function() {
            this[d] = !0
        }
    },
    h
} (+new Date, 1, {}, "defaultPrevented", "addEventListener", "attachEvent", document), this.W = function() {
    var d, e, a = window, b = document, c = b.documentElement, f = "style", g = "createElement", h = "appendChild", i = "offsetHeight", j = "offsetWidth", k = [];
    return function(l) {
        var n, o, p, m = typeof l;
        return "function" != m ? (o = b[g]("div"), o[f].width = "1em", c[h](o), n = o[j], n = n ? n : 16, c.removeChild(o), "number" == m ? l / n : (o = c[j], (p = a.innerWidth) || (p = c.clientWidth), o = 5 > 100 * (p - o) / p ? p : o, l ? o / n : o)) : ((o = a.addEventListener) ? o("resize", l, !1) : a.attachEvent("onresize", l), k.length || (d = b[g]("b"), d[f].position = "absolute", d[f].top = "-99em", d.innerHTML = "W", c[h](d), e = d[i], setInterval(function(a, b) {
            if (e != (b = d[i]))
                for (a = k.length; a; )
                    k[--a]();
            e = b
        }, 250)), k.push(l), void 0)
    }
}(),

Math.linearTween = function(e, t, n, r) {
    return n * e / r + t
},

Math.easeInQuad = function(e, t, n, r) {
    return e /= r, n * e * e + t
},

Math.easeOutQuad = function(e, t, n, r) {
    return e /= r, -n * e * (e - 2) + t
},

Math.easeInOutQuad = function(e, t, n, r) {
    return e /= r / 2, 1 > e ? n / 2 * e * e + t : (e--, -n / 2 * (e * (e - 2) - 1) + t)
},

Math.easeInCubic = function(e, t, n, r) {
    return e /= r, n * e * e * e + t
},

Math.easeOutCubic = function(e, t, n, r) {
    return e /= r, e--, n * (e * e * e + 1) + t
},

Math.easeInOutCubic = function(e, t, n, r) {
    return e /= r / 2, 1 > e ? n / 2 * e * e * e + t : (e -= 2, n / 2 * (e * e * e + 2) + t)
},

Math.easeInQuart = function(e, t, n, r) {
    return e /= r, n * e * e * e * e + t
},

Math.easeOutQuart = function(e, t, n, r) {
    return e /= r, e--, -n * (e * e * e * e - 1) + t
},

Math.easeInOutQuart = function(e, t, n, r) {
    return e /= r / 2, 1 > e ? n / 2 * e * e * e * e + t : (e -= 2, -n / 2 * (e * e * e * e - 2) + t)
},

Math.easeInQuint = function(e, t, n, r) {
    return e /= r, n * e * e * e * e * e + t
},

Math.easeOutQuint = function(e, t, n, r) {
    return e /= r, e--, n * (e * e * e * e * e + 1) + t
},

Math.easeInOutQuint = function(e, t, n, r) {
    return e /= r / 2, 1 > e ? n / 2 * e * e * e * e * e + t : (e -= 2, n / 2 * (e * e * e * e * e + 2) + t)
},

Math.easeInSine = function(e, t, n, r) {
    return -n * Math.cos(e / r * (Math.PI / 2)) + n + t
},

Math.easeOutSine = function(e, t, n, r) {
    return n * Math.sin(e / r * (Math.PI / 2)) + t
},

Math.easeInOutSine = function(e, t, n, r) {
    return -n / 2 * (Math.cos(Math.PI * e / r) - 1) + t
},

Math.easeInExpo = function(e, t, n, r) {
    return n * Math.pow(2, 10 * (e / r - 1)) + t
},

Math.easeOutExpo = function(e, t, n, r) {
    return n * (-Math.pow(2, -10 * e / r) + 1) + t
},

Math.easeInOutExpo = function(e, t, n, r) {
    return e /= r / 2, 1 > e ? n / 2 * Math.pow(2, 10 * (e - 1)) + t : (e--, n / 2 * (-Math.pow(2, -10 * e) + 2) + t)
},

Math.easeInCirc = function(e, t, n, r) {
    return e /= r, -n * (Math.sqrt(1 - e * e) - 1) + t
},

Math.easeOutCirc = function(e, t, n, r) {
    return e /= r, e--, n * Math.sqrt(1 - e * e) + t
},

Math.easeInOutCirc = function(e, t, n, r) {
    return e /= r / 2, 1 > e ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + t : (e -= 2, n / 2 * (Math.sqrt(1 - e * e) + 1) + t)
};

var sa_debug = !1;

!function() {
    for (var e = 0, t = ["ms", "moz", "webkit", "o"], n = 0; n < t.length && !window.requestAnimationFrame; ++n)
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(t) {
        var r = (new Date).getTime(),
        i = Math.max(0, 16 - (r - e)),
        s = window.setTimeout(function() {
            t(r + i)
        }, i);

        return e = r + i, s
    }),

    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    })
}();

var getHeight = function(e) {
    var t, e = e ? e : "document";
    if ("document" == e) {
        var n = document;
        t = Math.max(Math.max(n.body.scrollHeight, n.documentElement.scrollHeight), Math.max(n.body.offsetHeight, n.documentElement.offsetHeight), Math.max(n.body.clientHeight, n.documentElement.clientHeight))
    } else
        t = $$(e).scrollHeight;
    return t
},

getScrollTop = function(e, t) {
    var n, e = e ? e : "document";
    if ("document" != e) {
        var r = $$(e);
        t ? r.scrollTop = t : n = r.scrollTop
    } else if ("undefined" != typeof pageYOffset)
        t ? (log(t), window.scroll(0, Math.round(t))) : n = pageYOffset;
    else {
        var i = document.body, s = document.documentElement;
        s = s.clientHeight ? s : i, t ? s.scrollTop = t : n = s.scrollTop
    }
    return n
},

mergeObjects = function(e, t) {
    var n = {};
    if ("object" != typeof e || "object" != typeof t)
        return sa_debug ? alert("both items passed into mergeObjects must be objects") : null;
    for (k in e)
        n[k] = t[k] ? t[k] : e[k] ? e[k] : null;
    for (k in t)
        n[k] || (n[k] = t[k]);
    return n
};

HTMLDivElement.prototype.height = function() {
    var e = this.offsetHeight;
    if (this.currentStyle) {
        var t = this.currentStyle;
        e += t["margin-top"] += t["margin-bottom"] += t["padding-top"] += t["padding-bottom"]
    } else
        e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("margin-top").replace("px", "")), e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("margin-bottom").replace("px", "")), e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("padding-top").replace("px", "")), e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("padding-bottom").replace("px", ""));
    return e
},

HTMLDivElement.prototype.width = function() {
    var e = this.offsetWidth;
    if (this.currentStyle) {
        var t = this.currentStyle;
        e += t["margin-left"] += t["margin-right"] += t["padding-left"] += t["padding-right"]
    } else
        e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("margin-left").replace("px", "")), e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("margin-right").replace("px", "")), e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("padding-left").replace("px", "")), e += parseInt(document.defaultView.getComputedStyle(this, null).getPropertyValue("padding-right").replace("px", ""));
    return e
},

Object.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault: function() {
        var e = this.originalEvent;
        this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault()
    },

    stopPropagation: function() {
        var e = this.originalEvent;
        this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation()
    },

    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue, this.stopPropagation()
    }
};

var getWinSize = function() {
    if (void 0 != window.innerWidth)
        return { width: window.innerWidth, height: window.innerHeight };

    var B = document.body,
        D = document.documentElement;

    return Width = D.clientWidth && 0 != D.clientWidth ? D.clientWidth : B.clientWidth, Height = D.clientHeight && 0 != D.clientHeight ? D.clientHeight : B.clientHeight, {width: Width,height: Height}
};

!function() {
    "use strict";

    function e() {}

    function t(e, t) {
        for (var n = e.length; n--; )
            if (e[n].listener === t)
                return n;
        return -1
    }

    var n = e.prototype;

    n.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i)
                i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else
            t = i[e] || (i[e] = []);
        return t
    },

    n.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1)
            n.push(e[t].listener);
        return n
    },

    n.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    },

    n.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e), o = "object" == typeof n;
        for (i in r)
            r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {listener: n,once: !1});
        return this
    },

    n.on = n.addListener, n.addOnceListener = function(e, t) {
        return this.addListener(e, {listener: t,once: !0})
    },

    n.once = n.addOnceListener, n.defineEvent = function(e) {
        return this.getListeners(e), this
    },

    n.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1)
            this.defineEvent(e[t]);
        return this
    },

    n.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o)
            o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    },

    n.off = n.removeListener, n.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    },

    n.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    },

    n.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener, s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--; )
                o.call(this, t, n[i]);
        else
            for (i in t)
                t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    },

    n.removeEvent = function(e) {
        var t, n = typeof e, i = this._getEvents();
        if ("string" === n)
            delete i[e];
        else if ("object" === n)
            for (t in i)
                i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else
            delete this._events;
        return this
    },

    n.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--; )
                    n = s[r][i], o = n.listener.apply(this, t || []), (o === this._getOnceReturnValue() || n.once === !0) && this.removeListener(e, s[r][i].listener);
        return this
    },

    n.trigger = n.emitEvent, n.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    },

    n.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    },

    n._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    },

    n._getEvents = function() {
        return this._events || (this._events = {})
    },

    "function" == typeof define && define.amd ? define(function() {return e }) : "undefined" != typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}.call(this), function(e) {
    "use strict";
    var t = document.documentElement, n = function() {
    };
    t.addEventListener ? n = function(e, t, n) {
        e.addEventListener(t, n, !1)
    } : t.attachEvent && (n = function(t, n, i) {
        t[n + i] = i.handleEvent ? function() {
            var t = e.event;
            t.target = t.target || t.srcElement, i.handleEvent.call(i, t)
        } : function() {
            var n = e.event;
            n.target = n.target || n.srcElement, i.call(t, n)
        }, t.attachEvent("on" + n, t[n + i])
    });
    var i = function() {
    };
    t.removeEventListener ? i = function(e, t, n) {
        e.removeEventListener(t, n, !1)
    } : t.detachEvent && (i = function(e, t, n) {
        e.detachEvent("on" + t, e[t + n]);
        try {
            delete e[t + n]
        } catch (i) {
            e[t + n] = void 0
        }
    });
    var r = {bind: n,unbind: i};
    "function" == typeof define && define.amd ? define(r) : e.eventie = r
}(this), function(e) {
    "use strict";
    function t(e, t) {
        for (var n in t)
            e[n] = t[n];
        return e
    }
    function n(e) {
        return "[object Array]" === c.call(e)
    }
    function i(e) {
        var t = [];
        if (n(e))
            t = e;
        else if ("number" == typeof e.length)
            for (var i = 0, r = e.length; r > i; i++)
                t.push(e[i]);
        else
            t.push(e);
        return t
    }
    function r(e, n) {
        function r(e, n, s) {
            if (!(this instanceof r))
                return new r(e, n);
            "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = i(e), this.options = t({}, this.options), "function" == typeof n ? s = n : t(this.options, n), s && this.on("always", s), this.getImages(), o && (this.jqDeferred = new o.Deferred);
            var a = this;
            setTimeout(function() {
                a.check()
            })
        }
        function c(e) {
            this.img = e
        }

        r.prototype = new e,
        r.prototype.options = {},
        r.prototype.getImages = function() {
            this.images = [];
            for (var e = 0, t = this.elements.length; t > e; e++) {
                var n = this.elements[e];
                "IMG" === n.nodeName && this.addImage(n);
                for (var i = n.querySelectorAll("img"), r = 0, o = i.length; o > r; r++) {
                    var s = i[r];
                    this.addImage(s)
                }
            }
        },

        r.prototype.addImage = function(e) {
            var t = new c(e);
            this.images.push(t)
        },

        r.prototype.check = function() {
            function e(e, r) {
                return t.options.debug && a && s.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
            }
            var t = this, n = 0, i = this.images.length;
            if (this.hasAnyBroken = !1, !i)
                return this.complete(), void 0;
            for (var r = 0; i > r; r++) {
                var o = this.images[r];
                o.on("confirm", e), o.check()
            }
        },

        r.prototype.progress = function(e) {
            this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
            var t = this;
            setTimeout(function() {
                t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify(t, e)
            })
        },

        r.prototype.complete = function() {
            var e = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var t = this;
            setTimeout(function() {
                if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                    var n = t.hasAnyBroken ? "reject" : "resolve";
                    t.jqDeferred[n](t)
                }
            })
        }, o && (o.fn.imagesLoaded = function(e, t) {
            var n = new r(this, e, t);
            return n.jqDeferred.promise(o(this))
        });
        var f = {};
        return c.prototype = new e, c.prototype.check = function() {
            var e = f[this.img.src];
            if (e)
                return this.useCached(e), void 0;
            if (f[this.img.src] = this, this.img.complete && void 0 !== this.img.naturalWidth)
                return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
            var t = this.proxyImage = new Image;
            n.bind(t, "load", this), n.bind(t, "error", this), t.src = this.img.src
        },

        c.prototype.useCached = function(e) {
            if (e.isConfirmed)
                this.confirm(e.isLoaded, "cached was confirmed");
            else {
                var t = this;
                e.on("confirm", function(e) {
                    return t.confirm(e.isLoaded, "cache emitted confirmed"), !0
                })
            }
        },

        c.prototype.confirm = function(e, t) {
            this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
        },

        c.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        },

        c.prototype.onload = function() {
            this.confirm(!0, "onload"), this.unbindProxyEvents()
        },

        c.prototype.onerror = function() {
            this.confirm(!1, "onerror"), this.unbindProxyEvents()
        },

        c.prototype.unbindProxyEvents = function() {
            n.unbind(this.proxyImage, "load", this), n.unbind(this.proxyImage, "error", this)
        }, r
    }
    var o = e.jQuery, s = e.console, a = void 0 !== s, c = Object.prototype.toString;
    "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], r) : e.imagesLoaded = r(e.EventEmitter, e.eventie)
}(window);
var ce = function(e, html, attr, styleattr) {
    var el = document.createElement(e);
    el.innerHTML = html;
    for (var key in attr)
        el[key] = attr[key];
    for (var key in styleattr)
        el.style[key] = styleattr[key];
    return el
};
!function(window, document) {
    function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement("p"), parent = ownerDocument.getElementsByTagName("head")[0] || ownerDocument.documentElement;
        return p.innerHTML = "x<style>" + cssText + "</style>", parent.insertBefore(p.lastChild, parent.firstChild)
    }
    function getElements() {
        var elements = html5.elements;
        return "string" == typeof elements ? elements.split(" ") : elements
    }
    function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        return data || (data = {}, expanID++, ownerDocument[expando] = expanID, expandoData[expanID] = data), data
    }
    function createElement(nodeName, ownerDocument, data) {
        if (ownerDocument || (ownerDocument = document), supportsUnknownElements)
            return ownerDocument.createElement(nodeName);
        data || (data = getExpandoData(ownerDocument));
        var node;
        return node = data.cache[nodeName] ? data.cache[nodeName].cloneNode() : saveClones.test(nodeName) ? (data.cache[nodeName] = data.createElem(nodeName)).cloneNode() : data.createElem(nodeName), node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node
    }
    function createDocumentFragment(ownerDocument, data) {
        if (ownerDocument || (ownerDocument = document), supportsUnknownElements)
            return ownerDocument.createDocumentFragment();
        data = data || getExpandoData(ownerDocument);
        for (var clone = data.frag.cloneNode(), i = 0, elems = getElements(), l = elems.length; l > i; i++)
            clone.createElement(elems[i]);
        return clone
    }
    function shivMethods(ownerDocument, data) {
        data.cache || (data.cache = {}, data.createElem = ownerDocument.createElement, data.createFrag = ownerDocument.createDocumentFragment, data.frag = data.createFrag()), ownerDocument.createElement = function(nodeName) {
            return html5.shivMethods ? createElement(nodeName, ownerDocument, data) : data.createElem(nodeName)
        }, ownerDocument.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + getElements().join().replace(/\w+/g, function(nodeName) {
            return data.createElem(nodeName), data.frag.createElement(nodeName), 'c("' + nodeName + '")'
        }) + ");return n}")(html5, data.frag)
    }
    function shivDocument(ownerDocument) {
        ownerDocument || (ownerDocument = document);
        var data = getExpandoData(ownerDocument);
        return !html5.shivCSS || supportsHtml5Styles || data.hasCSS || (data.hasCSS = !!addStyleSheet(ownerDocument, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), supportsUnknownElements || shivMethods(ownerDocument, data), ownerDocument
    }
    var supportsHtml5Styles, supportsUnknownElements, version = "3.6.2pre", options = window.html5 || {}, reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, expando = "_html5shiv", expanID = 0, expandoData = {};
    !function() {
        try {
            var a = document.createElement("a");
            a.innerHTML = "<xyz></xyz>", supportsHtml5Styles = "hidden" in a, supportsUnknownElements = 1 == a.childNodes.length || function() {
                document.createElement("a");
                var frag = document.createDocumentFragment();
                return "undefined" == typeof frag.cloneNode || "undefined" == typeof frag.createDocumentFragment || "undefined" == typeof frag.createElement
            }()
        } catch (e) {
            supportsHtml5Styles = !0, supportsUnknownElements = !0
        }
    }();
    var html5 = {elements: options.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video",version: version,shivCSS: options.shivCSS !== !1,supportsUnknownElements: supportsUnknownElements,shivMethods: options.shivMethods !== !1,type: "default",shivDocument: shivDocument,createElement: createElement,createDocumentFragment: createDocumentFragment};
    window.html5 = html5, shivDocument(document)
}(this, document), function(window) {
    "use strict";
    function getStyleProperty(propName) {
        if (propName) {
            if ("string" == typeof docElemStyle[propName])
                return propName;
            propName = propName.charAt(0).toUpperCase() + propName.slice(1);
            for (var prefixed, i = 0, len = prefixes.length; len > i; i++)
                if (prefixed = prefixes[i] + propName, "string" == typeof docElemStyle[prefixed])
                    return prefixed
        }
    }
    var prefixes = "Webkit Moz ms Ms O".split(" "), docElemStyle = document.documentElement.style;
    "function" == typeof define && define.amd ? define(function() {
        return getStyleProperty
    }) : window.getStyleProperty = getStyleProperty
}(window), function(window) {
    "use strict";
    function getStyleSize(value) {
        var num = parseFloat(value), isValid = -1 === value.indexOf("%") && !isNaN(num);
        return isValid && num
    }
    function getZeroSize() {
        for (var size = {width: 0,height: 0,innerWidth: 0,innerHeight: 0,outerWidth: 0,outerHeight: 0}, i = 0, len = measurements.length; len > i; i++) {
            var measurement = measurements[i];
            size[measurement] = 0
        }
        return size
    }
    function defineGetSize(getStyleProperty) {
        function getSize(elem) {
            if ("string" == typeof elem && (elem = document.querySelector(elem)), elem && "object" == typeof elem && elem.nodeType) {
                var style = getStyle(elem);
                if ("none" === style.display)
                    return getZeroSize();
                var size = {};
                size.width = elem.offsetWidth, size.height = elem.offsetHeight;
                for (var isBorderBox = size.isBorderBox = !(!boxSizingProp || !style[boxSizingProp] || "border-box" !== style[boxSizingProp]), i = 0, len = measurements.length; len > i; i++) {
                    var measurement = measurements[i], value = style[measurement], num = parseFloat(value);
                    size[measurement] = isNaN(num) ? 0 : num
                }
                var paddingWidth = size.paddingLeft + size.paddingRight, paddingHeight = size.paddingTop + size.paddingBottom, marginWidth = size.marginLeft + size.marginRight, marginHeight = size.marginTop + size.marginBottom, borderWidth = size.borderLeftWidth + size.borderRightWidth, borderHeight = size.borderTopWidth + size.borderBottomWidth, isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter, styleWidth = getStyleSize(style.width);
                styleWidth !== !1 && (size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth));
                var styleHeight = getStyleSize(style.height);
                return styleHeight !== !1 && (size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight)), size.innerWidth = size.width - (paddingWidth + borderWidth), size.innerHeight = size.height - (paddingHeight + borderHeight), size.outerWidth = size.width + marginWidth, size.outerHeight = size.height + marginHeight, size
            }
        }
        var isBoxSizeOuter, boxSizingProp = getStyleProperty("boxSizing");
        return function() {
            if (boxSizingProp) {
                var div = document.createElement("div");
                div.style.width = "200px", div.style.padding = "1px 2px 3px 4px", div.style.borderStyle = "solid", div.style.borderWidth = "1px 2px 3px 4px", div.style[boxSizingProp] = "border-box";
                var body = document.body || document.documentElement;
                body.appendChild(div);
                var style = getStyle(div);
                isBoxSizeOuter = 200 === getStyleSize(style.width), body.removeChild(div)
            }
        }(), getSize
    }
    var defView = document.defaultView, getStyle = defView && defView.getComputedStyle ? function(elem) {
        return defView.getComputedStyle(elem, null)
    } : function(elem) {
        return elem.currentStyle
    }, measurements = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
    "function" == typeof define && define.amd ? define(["get-style-property"], defineGetSize) : window.getSize = defineGetSize(window.getStyleProperty)
}(window), function(window) {
    "use strict";
    var docElem = document.documentElement, bind = function() {
    };
    docElem.addEventListener ? bind = function(obj, type, fn) {
        obj.addEventListener(type, fn, !1)
    } : docElem.attachEvent && (bind = function(obj, type, fn) {
        obj[type + fn] = fn.handleEvent ? function() {
            var event = window.event;
            event.target = event.target || event.srcElement, fn.handleEvent.call(fn, event)
        } : function() {
            var event = window.event;
            event.target = event.target || event.srcElement, fn.call(obj, event)
        }, obj.attachEvent("on" + type, obj[type + fn])
    });
    var unbind = function() {
    };
    docElem.removeEventListener ? unbind = function(obj, type, fn) {
        obj.removeEventListener(type, fn, !1)
    } : docElem.detachEvent && (unbind = function(obj, type, fn) {
        obj.detachEvent("on" + type, obj[type + fn]);
        try {
            delete obj[type + fn]
        } catch (err) {
            obj[type + fn] = void 0
        }
    });
    var eventie = {bind: bind,unbind: unbind};
    "function" == typeof define && define.amd ? define(eventie) : window.eventie = eventie
}(this), function(window) {
    "use strict";
    function docReady(fn) {
        "function" == typeof fn && (docReady.isReady ? fn() : queue.push(fn))
    }
    function init(event) {
        var isIE8NotReady = "readystatechange" === event.type && "complete" !== document.readyState;
        if (!docReady.isReady && !isIE8NotReady) {
            docReady.isReady = !0;
            for (var i = 0, len = queue.length; len > i; i++) {
                var fn = queue[i];
                fn()
            }
        }
    }
    function defineDocReady(eventie) {
        return eventie.bind(document, "DOMContentLoaded", init), eventie.bind(document, "readystatechange", init), eventie.bind(window, "load", init), docReady
    }
    var document = window.document, queue = [];
    docReady.isReady = !1, "function" == typeof define && define.amd ? define(["eventie"], defineDocReady) : window.docReady = defineDocReady(window.eventie)
}(this), function(exports) {
    "use strict";
    function EventEmitter() {
    }
    function indexOfListener(listener, listeners) {
        if (nativeIndexOf)
            return listeners.indexOf(listener);
        for (var i = listeners.length; i--; )
            if (listeners[i] === listener)
                return i;
        return -1
    }
    var proto = EventEmitter.prototype, nativeIndexOf = Array.prototype.indexOf ? !0 : !1;
    proto._getEvents = function() {
        return this._events || (this._events = {})
    }, proto.getListeners = function(evt) {
        var response, key, events = this._getEvents();
        if ("object" == typeof evt) {
            response = {};
            for (key in events)
                events.hasOwnProperty(key) && evt.test(key) && (response[key] = events[key])
        } else
            response = events[evt] || (events[evt] = []);
        return response
    }, proto.getListenersAsObject = function(evt) {
        var response, listeners = this.getListeners(evt);
        return listeners instanceof Array && (response = {}, response[evt] = listeners), response || listeners
    }, proto.addListener = function(evt, listener) {
        var key, listeners = this.getListenersAsObject(evt);
        for (key in listeners)
            listeners.hasOwnProperty(key) && -1 === indexOfListener(listener, listeners[key]) && listeners[key].push(listener);
        return this
    }, proto.on = proto.addListener, proto.defineEvent = function(evt) {
        return this.getListeners(evt), this
    }, proto.defineEvents = function(evts) {
        for (var i = 0; i < evts.length; i += 1)
            this.defineEvent(evts[i]);
        return this
    }, proto.removeListener = function(evt, listener) {
        var index, key, listeners = this.getListenersAsObject(evt);
        for (key in listeners)
            listeners.hasOwnProperty(key) && (index = indexOfListener(listener, listeners[key]), -1 !== index && listeners[key].splice(index, 1));
        return this
    }, proto.off = proto.removeListener, proto.addListeners = function(evt, listeners) {
        return this.manipulateListeners(!1, evt, listeners)
    }, proto.removeListeners = function(evt, listeners) {
        return this.manipulateListeners(!0, evt, listeners)
    }, proto.manipulateListeners = function(remove, evt, listeners) {
        var i, value, single = remove ? this.removeListener : this.addListener, multiple = remove ? this.removeListeners : this.addListeners;
        if ("object" != typeof evt || evt instanceof RegExp)
            for (i = listeners.length; i--; )
                single.call(this, evt, listeners[i]);
        else
            for (i in evt)
                evt.hasOwnProperty(i) && (value = evt[i]) && ("function" == typeof value ? single.call(this, i, value) : multiple.call(this, i, value));
        return this
    }, proto.removeEvent = function(evt) {
        var key, type = typeof evt, events = this._getEvents();
        if ("string" === type)
            delete events[evt];
        else if ("object" === type)
            for (key in events)
                events.hasOwnProperty(key) && evt.test(key) && delete events[key];
        else
            delete this._events;
        return this
    }, proto.emitEvent = function(evt, args) {
        var i, key, response, listeners = this.getListenersAsObject(evt);
        for (key in listeners)
            if (listeners.hasOwnProperty(key))
                for (i = listeners[key].length; i--; )
                    response = args ? listeners[key][i].apply(null, args) : listeners[key][i](), response === !0 && this.removeListener(evt, listeners[key][i]);
        return this
    }, proto.trigger = proto.emitEvent, proto.emit = function(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args)
    }, "function" == typeof define && define.amd ? define(function() {
        return EventEmitter
    }) : exports.EventEmitter = EventEmitter
}(this), function(window) {
    "use strict";
    function noop() {
    }
    function defineBridget($) {
        function addOptionMethod(PluginClass) {
            PluginClass.prototype.option || (PluginClass.prototype.option = function(opts) {
                $.isPlainObject(opts) && (this.options = $.extend(!0, this.options, opts))
            })
        }
        function bridge(namespace, PluginClass) {
            $.fn[namespace] = function(options) {
                if ("string" == typeof options) {
                    for (var args = slice.call(arguments, 1), i = 0, len = this.length; len > i; i++) {
                        var elem = this[i], instance = $.data(elem, namespace);
                        if (instance)
                            if ($.isFunction(instance[options]) && "_" !== options.charAt(0)) {
                                var returnValue = instance[options].apply(instance, args);
                                if (void 0 !== returnValue)
                                    return returnValue
                            } else
                                logError("no such method '" + options + "' for " + namespace + " instance");
                        else
                            logError("cannot call methods on " + namespace + " prior to initialization; " + "attempted to call '" + options + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var instance = $.data(this, namespace);
                    instance ? (instance.option(options), instance._init()) : (instance = new PluginClass(this, options), $.data(this, namespace, instance))
                })
            }
        }
        if ($) {
            var logError = "undefined" == typeof console ? noop : function(message) {
                console.error(message)
            };
            $.bridget = function(namespace, PluginClass) {
                addOptionMethod(PluginClass), bridge(namespace, PluginClass)
            }
        }
    }
    var slice = Array.prototype.slice;
    "function" == typeof define && define.amd ? define(["jquery"], defineBridget) : defineBridget(window.jQuery)
}(window), function(global, ElemProto) {
    "use strict";
    function match(elem, selector) {
        return elem[matchesMethod](selector)
    }
    function checkParent(elem) {
        if (!elem.parentNode) {
            var fragment = document.createDocumentFragment();
            fragment.appendChild(elem)
        }
    }
    function query(elem, selector) {
        checkParent(elem);
        for (var elems = elem.parentNode.querySelectorAll(selector), i = 0, len = elems.length; len > i; i++)
            if (elems[i] === elem)
                return !0;
        return !1
    }
    function matchChild(elem, selector) {
        return checkParent(elem), match(elem, selector)
    }
    var matchesSelector, matchesMethod = function() {
        if (ElemProto.matchesSelector)
            return "matchesSelector";
        for (var prefixes = ["webkit", "moz", "ms", "o"], i = 0, len = prefixes.length; len > i; i++) {
            var prefix = prefixes[i], method = prefix + "MatchesSelector";
            if (ElemProto[method])
                return method
        }
    }();
    if (matchesMethod) {
        var div = document.createElement("div"), supportsOrphans = match(div, "div");
        matchesSelector = supportsOrphans ? match : matchChild
    } else
        matchesSelector = query;
    "function" == typeof define && define.amd ? define(function() {
        return matchesSelector
    }) : window.matchesSelector = matchesSelector
}(this, Element.prototype), function(window) {
    "use strict";
    function extend(a, b) {
        for (var prop in b)
            a[prop] = b[prop];
        return a
    }
    function Item(element, layout) {
        element && (this.element = element, this.layout = layout, this.position = {x: 0,y: 0}, this._create())
    }
    var getSize = window.getSize, getStyleProperty = window.getStyleProperty, EventEmitter = window.EventEmitter, defView = document.defaultView, getStyle = defView && defView.getComputedStyle ? function(elem) {
        return defView.getComputedStyle(elem, null)
    } : function(elem) {
        return elem.currentStyle
    }, transitionProperty = getStyleProperty("transition"), transformProperty = getStyleProperty("transform"), supportsCSS3 = transitionProperty && transformProperty, is3d = !!getStyleProperty("perspective"), transitionEndEvent = {WebkitTransition: "webkitTransitionEnd",MozTransition: "transitionend",OTransition: "otransitionend",transition: "transitionend"}[transitionProperty], prefixableProperties = ["transform", "transition", "transitionDuration", "transitionProperty"], vendorProperties = function() {
        for (var cache = {}, i = 0, len = prefixableProperties.length; len > i; i++) {
            var prop = prefixableProperties[i], supportedProp = getStyleProperty(prop);
            supportedProp && supportedProp !== prop && (cache[prop] = supportedProp)
        }
        return cache
    }();
    extend(Item.prototype, EventEmitter.prototype), Item.prototype._create = function() {
        this.css({position: "absolute"})
    }, Item.prototype.handleEvent = function(event) {
        var method = "on" + event.type;
        this[method] && this[method](event)
    }, Item.prototype.getSize = function() {
        this.size = getSize(this.element)
    }, Item.prototype.css = function(style) {
        var elemStyle = this.element.style;
        for (var prop in style) {
            var supportedProp = vendorProperties[prop] || prop;
            elemStyle[supportedProp] = style[prop]
        }
    }, Item.prototype.getPosition = function() {
        var style = getStyle(this.element), layoutOptions = this.layout.options, isOriginLeft = layoutOptions.isOriginLeft, isOriginTop = layoutOptions.isOriginTop, x = parseInt(style[isOriginLeft ? "left" : "right"], 10), y = parseInt(style[isOriginTop ? "top" : "bottom"], 10);
        x = isNaN(x) ? 0 : x, y = isNaN(y) ? 0 : y;
        var layoutSize = this.layout.size;
        x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight, y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom, this.position.x = x, this.position.y = y
    }, Item.prototype.layoutPosition = function() {
        var layoutSize = this.layout.size, layoutOptions = this.layout.options, style = {};
        layoutOptions.isOriginLeft ? (style.left = this.position.x + layoutSize.paddingLeft + "px", style.right = "") : (style.right = this.position.x + layoutSize.paddingRight + "px", style.left = ""), layoutOptions.isOriginTop ? (style.top = this.position.y + layoutSize.paddingTop + "px", style.bottom = "") : (style.bottom = this.position.y + layoutSize.paddingBottom + "px", style.top = ""), this.css(style), this.emitEvent("layout", [this])
    };
    var translate = is3d ? function(x, y) {
        return "translate3d(" + x + "px, " + y + "px, 0)"
    } : function(x, y) {
        return "translate(" + x + "px, " + y + "px)"
    };
    Item.prototype._transitionTo = function(x, y) {
        this.getPosition();
        var curX = this.position.x, curY = this.position.y, compareX = parseInt(x, 10), compareY = parseInt(y, 10), didNotMove = compareX === this.position.x && compareY === this.position.y;
        if (this.setPosition(x, y), didNotMove && !this.isTransitioning)
            return this.layoutPosition(), void 0;
        var transX = x - curX, transY = y - curY, transitionStyle = {}, layoutOptions = this.layout.options;
        transX = layoutOptions.isOriginLeft ? transX : -transX, transY = layoutOptions.isOriginTop ? transY : -transY, transitionStyle.transform = translate(transX, transY), this.transition({to: transitionStyle,onTransitionEnd: this.layoutPosition,isCleaning: !0})
    }, Item.prototype.goTo = function(x, y) {
        this.setPosition(x, y), this.layoutPosition()
    }, Item.prototype.moveTo = supportsCSS3 ? Item.prototype._transitionTo : Item.prototype.goTo, Item.prototype.setPosition = function(x, y) {
        this.position.x = parseInt(x, 10), this.position.y = parseInt(y, 10)
    }, Item.prototype._nonTransition = function(args) {
        this.css(args.to), args.isCleaning && this._removeStyles(args.to), args.onTransitionEnd && args.onTransitionEnd.call(this)
    }, Item.prototype._transition = function(args) {
        var transitionDuration = this.layout.options.transitionDuration;
        if (!parseFloat(transitionDuration))
            return this._nonTransition(args), void 0;
        var style = args.to, transitionValue = [];
        for (var prop in style)
            transitionValue.push(prop);
        var transitionStyle = {};
        if (transitionStyle.transitionProperty = transitionValue.join(","), transitionStyle.transitionDuration = transitionDuration, this.element.addEventListener(transitionEndEvent, this, !1), (args.isCleaning || args.onTransitionEnd) && this.on("transitionEnd", function(_this) {
            return args.isCleaning && _this._removeStyles(style), args.onTransitionEnd && args.onTransitionEnd.call(_this), !0
        }), args.from) {
            this.css(args.from);
            var h = this.element.offsetHeight;
            h = null
        }
        this.css(transitionStyle), this.css(style), this.isTransitioning = !0
    }, Item.prototype.transition = Item.prototype[transitionProperty ? "_transition" : "_nonTransition"], Item.prototype.onwebkitTransitionEnd = function(event) {
        this.ontransitionend(event)
    }, Item.prototype.onotransitionend = function(event) {
        this.ontransitionend(event)
    }, Item.prototype.ontransitionend = function(event) {
        event.target === this.element && (this.removeTransitionStyles(), this.element.removeEventListener(transitionEndEvent, this, !1), this.isTransitioning = !1, this.emitEvent("transitionEnd", [this]))
    }, Item.prototype._removeStyles = function(style) {
        var cleanStyle = {};
        for (var prop in style)
            cleanStyle[prop] = "";
        this.css(cleanStyle)
    };
    var cleanTransitionStyle = {transitionProperty: "",transitionDuration: ""};
    Item.prototype.removeTransitionStyles = function() {
        this.css(cleanTransitionStyle)
    }, Item.prototype.removeElem = function() {
        this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
    }, Item.prototype.remove = transitionProperty ? function() {
        var _this = this;
        this.on("transitionEnd", function() {
            return _this.removeElem(), !0
        }), this.hide()
    } : Item.prototype.removeElem, Item.prototype.reveal = function() {
        this.css({display: ""});
        var options = this.layout.options;
        this.transition({from: options.hiddenStyle,to: options.visibleStyle,isCleaning: !0})
    }, Item.prototype.hide = function() {
        this.css({display: ""});
        var options = this.layout.options;
        this.transition({from: options.visibleStyle,to: options.hiddenStyle,isCleaning: !0,onTransitionEnd: function() {
                this.css({display: "none"})
            }})
    }, Item.prototype.destroy = function() {
        this.css({position: "",left: "",right: "",top: "",bottom: "",transition: "",transform: ""})
    }, window.Outlayer = {Item: Item}
}(window), function(window) {
    "use strict";
    function extend(a, b) {
        for (var prop in b)
            a[prop] = b[prop];
        return a
    }
    function isArray(obj) {
        return "[object Array]" === objToString.call(obj)
    }
    function makeArray(obj) {
        var ary = [];
        if (isArray(obj))
            ary = obj;
        else if ("number" == typeof obj.length)
            for (var i = 0, len = obj.length; len > i; i++)
                ary.push(obj[i]);
        else
            ary.push(obj);
        return ary
    }
    function toDashed(str) {
        return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
            return $1 + "-" + $2
        }).toLowerCase()
    }
    function Outlayer(element, options) {
        if ("string" == typeof element && (element = document.querySelector(element)), !element || !isElement(element))
            return console && console.error("Bad " + this.settings.namespace + " element: " + element), void 0;
        this.element = element, this.options = extend({}, this.options), extend(this.options, options);
        var id = ++GUID;
        this.element.outlayerGUID = id, instances[id] = this, this._create(), this.options.isInitLayout && this.layout()
    }
    function copyOutlayerProto(obj, property) {
        obj.prototype[property] = extend({}, Outlayer.prototype[property])
    }
    var _Outlayer = window.Outlayer, Item = _Outlayer.Item, docReady = window.docReady, EventEmitter = window.EventEmitter, eventie = window.eventie, getSize = window.getSize, matchesSelector = window.matchesSelector, document = window.document, console = window.console, jQuery = window.jQuery, noop = function() {
    }, objToString = Object.prototype.toString, isElement = "object" == typeof HTMLElement ? function(obj) {
        return obj instanceof HTMLElement
    } : function(obj) {
        return obj && "object" == typeof obj && 1 === obj.nodeType && "string" == typeof obj.nodeName
    }, indexOf = Array.prototype.indexOf ? function(ary, obj) {
        return ary.indexOf(obj)
    } : function(ary, obj) {
        for (var i = 0, len = ary.length; len > i; i++)
            if (ary[i] === obj)
                return i;
        return -1
    }, GUID = 0, instances = {};
    Outlayer.prototype.settings = {namespace: "outlayer",item: _Outlayer.Item}, Outlayer.prototype.options = {containerStyle: {position: "relative"},isInitLayout: !0,isOriginLeft: !0,isOriginTop: !0,isResizeBound: !0,transitionDuration: "0.4s",hiddenStyle: {opacity: 0,transform: "scale(0.001)"},visibleStyle: {opacity: 1,transform: "scale(1)"}}, extend(Outlayer.prototype, EventEmitter.prototype), Outlayer.prototype._create = function() {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
    }, Outlayer.prototype.reloadItems = function() {
        this.items = this._getItems(this.element.children)
    }, Outlayer.prototype._getItems = function(elems) {
        for (var itemElems = this._filterFindItemElements(elems), Item = this.settings.item, items = [], i = 0, len = itemElems.length; len > i; i++) {
            var elem = itemElems[i], item = new Item(elem, this, this.options.itemOptions);
            items.push(item)
        }
        return items
    }, Outlayer.prototype._filterFindItemElements = function(elems) {
        elems = makeArray(elems);
        var itemSelector = this.options.itemSelector;
        if (!itemSelector)
            return elems;
        for (var itemElems = [], i = 0, len = elems.length; len > i; i++) {
            var elem = elems[i];
            matchesSelector(elem, itemSelector) && itemElems.push(elem);
            for (var childElems = elem.querySelectorAll(itemSelector), j = 0, jLen = childElems.length; jLen > j; j++)
                itemElems.push(childElems[j])
        }
        return itemElems
    }, Outlayer.prototype.getItemElements = function() {
        for (var elems = [], i = 0, len = this.items.length; len > i; i++)
            elems.push(this.items[i].element);
        return elems
    }, Outlayer.prototype.layout = function() {
        this._resetLayout(), this._manageStamps();
        var isInstant = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
        this.layoutItems(this.items, isInstant), this._isLayoutInited = !0
    }, Outlayer.prototype._init = Outlayer.prototype.layout, Outlayer.prototype._resetLayout = function() {
        this.getSize()
    }, Outlayer.prototype.getSize = function() {
        this.size = getSize(this.element)
    }, Outlayer.prototype._getMeasurement = function(measurement, size) {
        var elem, option = this.options[measurement];
        option ? ("string" == typeof option ? elem = this.element.querySelector(option) : isElement(option) && (elem = option), this[measurement] = elem ? getSize(elem)[size] : option) : this[measurement] = 0
    }, Outlayer.prototype.layoutItems = function(items, isInstant) {
        items = this._getItemsForLayout(items), this._layoutItems(items, isInstant), this._postLayout()
    }, Outlayer.prototype._getItemsForLayout = function(items) {
        for (var layoutItems = [], i = 0, len = items.length; len > i; i++) {
            var item = items[i];
            item.isIgnored || layoutItems.push(item)
        }
        return layoutItems
    }, Outlayer.prototype._layoutItems = function(items, isInstant) {
        if (!items || !items.length)
            return this.emitEvent("layoutComplete", [this, items]), void 0;
        this._itemsOn(items, "layout", function() {
            this.emitEvent("layoutComplete", [this, items])
        });
        for (var queue = [], i = 0, len = items.length; len > i; i++) {
            var item = items[i], position = this._getItemLayoutPosition(item);
            position.item = item, position.isInstant = isInstant, queue.push(position)
        }
        this._processLayoutQueue(queue)
    }, Outlayer.prototype._getItemLayoutPosition = function() {
        return {x: 0,y: 0}
    }, Outlayer.prototype._processLayoutQueue = function(queue) {
        for (var i = 0, len = queue.length; len > i; i++) {
            var obj = queue[i];
            this._positionItem(obj.item, obj.x, obj.y, obj.isInstant)
        }
    }, Outlayer.prototype._positionItem = function(item, x, y, isInstant) {
        isInstant ? item.goTo(x, y) : item.moveTo(x, y)
    }, Outlayer.prototype._postLayout = function() {
        var size = this._getContainerSize();
        size && (this._setContainerMeasure(size.width, !0), this._setContainerMeasure(size.height, !1))
    }, Outlayer.prototype._getContainerSize = noop, Outlayer.prototype._setContainerMeasure = function(measure, isWidth) {
        if (void 0 !== measure) {
            var elemSize = this.size;
            elemSize.isBorderBox && (measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth), measure = Math.max(measure, 0), this.element.style[isWidth ? "width" : "height"] = measure + "px"
        }
    }, Outlayer.prototype._itemsOn = function(items, eventName, callback) {
        function tick() {
            return doneCount++, doneCount === count && callback.call(_this), !0
        }
        for (var doneCount = 0, count = items.length, _this = this, i = 0, len = items.length; len > i; i++) {
            var item = items[i];
            item.on(eventName, tick)
        }
    }, Outlayer.prototype.ignore = function(elem) {
        var item = this.getItem(elem);
        item && (item.isIgnored = !0)
    }, Outlayer.prototype.unignore = function(elem) {
        var item = this.getItem(elem);
        item && delete item.isIgnored
    }, Outlayer.prototype.stamp = function(elems) {
        if (elems = this._find(elems)) {
            this.stamps = this.stamps.concat(elems);
            for (var i = 0, len = elems.length; len > i; i++) {
                var elem = elems[i];
                this.ignore(elem)
            }
        }
    }, Outlayer.prototype.unstamp = function(elems) {
        if (elems = this._find(elems))
            for (var i = 0, len = elems.length; len > i; i++) {
                var elem = elems[i], index = indexOf(this.stamps, elem);
                -1 !== index && this.stamps.splice(index, 1), this.unignore(elem)
            }
    }, Outlayer.prototype._find = function(elems) {
        return elems ? ("string" == typeof elems && (elems = this.element.querySelectorAll(elems)), elems = makeArray(elems)) : void 0
    }, Outlayer.prototype._manageStamps = function() {
        if (this.stamps && this.stamps.length) {
            this._getBoundingRect();
            for (var i = 0, len = this.stamps.length; len > i; i++) {
                var stamp = this.stamps[i];
                this._manageStamp(stamp)
            }
        }
    }, Outlayer.prototype._getBoundingRect = function() {
        var boundingRect = this.element.getBoundingClientRect(), size = this.size;
        this._boundingRect = {left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,top: boundingRect.top + size.paddingTop + size.borderTopWidth,right: boundingRect.right - (size.paddingRight + size.borderRightWidth),bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)}
    }, Outlayer.prototype._manageStamp = noop, Outlayer.prototype._getElementOffset = function(elem) {
        var boundingRect = elem.getBoundingClientRect(), thisRect = this._boundingRect, size = getSize(elem), offset = {left: boundingRect.left - thisRect.left - size.marginLeft,top: boundingRect.top - thisRect.top - size.marginTop,right: thisRect.right - boundingRect.right - size.marginRight,bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom};
        return offset
    }, Outlayer.prototype.handleEvent = function(event) {
        var method = "on" + event.type;
        this[method] && this[method](event)
    }, Outlayer.prototype.bindResize = function() {
        this.isResizeBound || (eventie.bind(window, "resize", this), this.isResizeBound = !0)
    }, Outlayer.prototype.unbindResize = function() {
        eventie.unbind(window, "resize", this), this.isResizeBound = !1
    }, Outlayer.prototype.onresize = function() {
        function delayed() {
            _this.resize()
        }
        this.resizeTimeout && clearTimeout(this.resizeTimeout);
        var _this = this;
        this.resizeTimeout = setTimeout(delayed, 100)
    }, Outlayer.prototype.resize = function() {
        var size = getSize(this.element), hasSizes = this.size && size;
        hasSizes && size.innerWidth === this.size.innerWidth || (this.layout(), delete this.resizeTimeout)
    }, Outlayer.prototype.addItems = function(elems) {
        var items = this._getItems(elems);
        if (items.length)
            return this.items = this.items.concat(items), items
    }, Outlayer.prototype.appended = function(elems) {
        var items = this.addItems(elems);
        items.length && (this.layoutItems(items, !0), this.reveal(items))
    }, Outlayer.prototype.prepended = function(elems) {
        var items = this._getItems(elems);
        if (items.length) {
            var previousItems = this.items.slice(0);
            this.items = items.concat(previousItems), this._resetLayout(), this.layoutItems(items, !0), this.reveal(items), this.layoutItems(previousItems)
        }
    }, Outlayer.prototype.reveal = function(items) {
        if (items && items.length)
            for (var i = 0, len = items.length; len > i; i++) {
                var item = items[i];
                item.reveal()
            }
    }, Outlayer.prototype.hide = function(items) {
        if (items && items.length)
            for (var i = 0, len = items.length; len > i; i++) {
                var item = items[i];
                item.hide()
            }
    }, Outlayer.prototype.getItem = function(elem) {
        for (var i = 0, len = this.items.length; len > i; i++) {
            var item = this.items[i];
            if (item.element === elem)
                return item
        }
    }, Outlayer.prototype.getItems = function(elems) {
        if (elems && elems.length) {
            for (var items = [], i = 0, len = elems.length; len > i; i++) {
                var elem = elems[i], item = this.getItem(elem);
                item && items.push(item)
            }
            return items
        }
    }, Outlayer.prototype.remove = function(elems) {
        elems = makeArray(elems);
        var removeItems = this.getItems(elems);
        this._itemsOn(removeItems, "remove", function() {
            this.emitEvent("removeComplete", [this, removeItems])
        });
        for (var i = 0, len = removeItems.length; len > i; i++) {
            var item = removeItems[i];
            item.remove();
            var index = indexOf(this.items, item);
            this.items.splice(index, 1)
        }
    }, Outlayer.prototype.destroy = function() {
        var style = this.element.style;
        style.height = "", style.position = "", style.width = "";
        for (var i = 0, len = this.items.length; len > i; i++) {
            var item = this.items[i];
            item.destroy()
        }
        this.unbindResize(), delete this.element.outlayerGUID
    }, Outlayer.data = function(elem) {
        var id = elem && elem.outlayerGUID;
        return id && instances[id]
    }, Outlayer.create = function(namespace, options) {
        function Layout() {
            Outlayer.apply(this, arguments)
        }
        return extend(Layout.prototype, Outlayer.prototype), copyOutlayerProto(Layout, "options"), copyOutlayerProto(Layout, "settings"), extend(Layout.prototype.options, options), Layout.prototype.settings.namespace = namespace, Layout.data = Outlayer.data, Layout.Item = function() {
            Item.apply(this, arguments)
        }, Layout.Item.prototype = new Outlayer.Item, Layout.prototype.settings.item = Layout.Item, docReady(function() {
            for (var dashedNamespace = toDashed(namespace), elems = document.querySelectorAll(".js-" + dashedNamespace), dataAttr = "data-" + dashedNamespace + "-options", i = 0, len = elems.length; len > i; i++) {
                var options, elem = elems[i], attr = elem.getAttribute(dataAttr);
                try {
                    options = attr && JSON.parse(attr)
                } catch (error) {
                    console && console.error("Error parsing " + dataAttr + " on " + elem.nodeName.toLowerCase() + (elem.id ? "#" + elem.id : "") + ": " + error);
                    continue
                }
                var instance = new Layout(elem, options);
                jQuery && jQuery.data(elem, namespace, instance)
            }
        }), jQuery && jQuery.bridget && jQuery.bridget(namespace, Layout), Layout
    }, Outlayer.Item = Item, window.Outlayer = Outlayer
}(window), function(window) {
    "use strict";
    function masonryDefinition(Outlayer, getSize) {
        var Masonry = Outlayer.create("masonry");
        return Masonry.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var i = this.cols;
            for (this.colYs = []; i--; )
                this.colYs.push(0);
            this.maxY = 0
        }, Masonry.prototype.measureColumns = function() {
            var container = this._getSizingContainer(), firstItem = this.items[0], firstItemElem = firstItem && firstItem.element;
            this.columnWidth || (this.columnWidth = firstItemElem ? getSize(firstItemElem).outerWidth : this.size.innerWidth), this.columnWidth += this.gutter, this._containerWidth = getSize(container).innerWidth, this.cols = Math.floor((this._containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
        }, Masonry.prototype._getSizingContainer = function() {
            return this.options.isFitWidth ? this.element.parentNode : this.element
        }, Masonry.prototype._getItemLayoutPosition = function(item) {
            item.getSize();
            var colSpan = Math.ceil(item.size.outerWidth / this.columnWidth);
            colSpan = Math.min(colSpan, this.cols);
            for (var colGroup = this._getColGroup(colSpan), minimumY = Math.min.apply(Math, colGroup), shortColIndex = indexOf(colGroup, minimumY), position = {x: this.columnWidth * shortColIndex,y: minimumY}, setHeight = minimumY + item.size.outerHeight, setSpan = this.cols + 1 - colGroup.length, i = 0; setSpan > i; i++)
                this.colYs[shortColIndex + i] = setHeight;
            return position
        }, Masonry.prototype._getColGroup = function(colSpan) {
            if (1 === colSpan)
                return this.colYs;
            for (var colGroup = [], groupCount = this.cols + 1 - colSpan, i = 0; groupCount > i; i++) {
                var groupColYs = this.colYs.slice(i, i + colSpan);
                colGroup[i] = Math.max.apply(Math, groupColYs)
            }
            return colGroup
        }, Masonry.prototype._manageStamp = function(stamp) {
            var stampSize = getSize(stamp), offset = this._getElementOffset(stamp), firstX = this.options.isOriginLeft ? offset.left : offset.right, lastX = firstX + stampSize.outerWidth, firstCol = Math.floor(firstX / this.columnWidth);
            firstCol = Math.max(0, firstCol);
            var lastCol = Math.floor(lastX / this.columnWidth);
            lastCol = Math.min(this.cols - 1, lastCol);
            for (var stampMaxY = (this.options.isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight, i = firstCol; lastCol >= i; i++)
                this.colYs[i] = Math.max(stampMaxY, this.colYs[i])
        }, Masonry.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var size = {height: this.maxY};
            return this.options.isFitWidth && (size.width = this._getContainerFitWidth()), size
        }, Masonry.prototype._getContainerFitWidth = function() {
            for (var unusedCols = 0, i = this.cols; --i && 0 === this.colYs[i]; )
                unusedCols++;
            return (this.cols - unusedCols) * this.columnWidth - this.gutter
        }, Masonry.prototype.resize = function() {
            var container = this._getSizingContainer(), size = getSize(container), hasSizes = this.size && size;
            hasSizes && size.innerWidth === this._containerWidth || (this.layout(), delete this.resizeTimeout)
        }, Masonry
    }
    var indexOf = Array.prototype.indexOf ? function(items, value) {
        return items.indexOf(value)
    } : function(items, value) {
        for (var i = 0, len = items.length; len > i; i++) {
            var item = items[i];
            if (item === value)
                return i
        }
        return -1
    };
    "function" == typeof define && define.amd ? define(["outlayer", "get-size"], masonryDefinition) : window.Masonry = masonryDefinition(window.Outlayer, window.getSize)
}(window), function(t) {
    "use strict";
    function e(t) {
        if (t) {
            if ("string" == typeof n[t])
                return t;
            t = t.charAt(0).toUpperCase() + t.slice(1);
            for (var e, o = 0, r = i.length; r > o; o++)
                if (e = i[o] + t, "string" == typeof n[e])
                    return e
        }
    }
    var i = "Webkit Moz ms Ms O".split(" "), n = document.documentElement.style;
    "function" == typeof define && define.amd ? define(function() {
        return e
    }) : t.getStyleProperty = e
}(window), function(t) {
    "use strict";
    function e(t) {
        var e = parseFloat(t), i = -1 === t.indexOf("%") && !isNaN(e);
        return i && e
    }
    function i() {
        for (var t = {width: 0,height: 0,innerWidth: 0,innerHeight: 0,outerWidth: 0,outerHeight: 0}, e = 0, i = s.length; i > e; e++) {
            var n = s[e];
            t[n] = 0
        }
        return t
    }
    function n(t) {
        function n(t) {
            if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                var n = r(t);
                if ("none" === n.display)
                    return i();
                var h = {};
                h.width = t.offsetWidth, h.height = t.offsetHeight;
                for (var p = h.isBorderBox = !(!a || !n[a] || "border-box" !== n[a]), u = 0, f = s.length; f > u; u++) {
                    var d = s[u], c = n[d], l = parseFloat(c);
                    h[d] = isNaN(l) ? 0 : l
                }
                var m = h.paddingLeft + h.paddingRight, y = h.paddingTop + h.paddingBottom, g = h.marginLeft + h.marginRight, v = h.marginTop + h.marginBottom, _ = h.borderLeftWidth + h.borderRightWidth, b = h.borderTopWidth + h.borderBottomWidth, L = p && o, E = e(n.width);
                E !== !1 && (h.width = E + (L ? 0 : m + _));
                var S = e(n.height);
                return S !== !1 && (h.height = S + (L ? 0 : y + b)), h.innerWidth = h.width - (m + _), h.innerHeight = h.height - (y + b), h.outerWidth = h.width + g, h.outerHeight = h.height + v, h
            }
        }
        var o, a = t("boxSizing");
        return function() {
            if (a) {
                var t = document.createElement("div");
                t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[a] = "border-box";
                var i = document.body || document.documentElement;
                i.appendChild(t);
                var n = r(t);
                o = 200 === e(n.width), i.removeChild(t)
            }
        }(), n
    }
    var o = document.defaultView, r = o && o.getComputedStyle ? function(t) {
        return o.getComputedStyle(t, null)
    } : function(t) {
        return t.currentStyle
    }, s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
    "function" == typeof define && define.amd ? define(["get-style-property"], n) : t.getSize = n(t.getStyleProperty)
}(window), function(t) {
    "use strict";
    var e = document.documentElement, i = function() {
    };
    e.addEventListener ? i = function(t, e, i) {
        t.addEventListener(e, i, !1)
    } : e.attachEvent && (i = function(e, i, n) {
        e[i + n] = n.handleEvent ? function() {
            var e = t.event;
            e.target = e.target || e.srcElement, n.handleEvent.call(n, e)
        } : function() {
            var i = t.event;
            i.target = i.target || i.srcElement, n.call(e, i)
        }, e.attachEvent("on" + i, e[i + n])
    });
    var n = function() {
    };
    e.removeEventListener ? n = function(t, e, i) {
        t.removeEventListener(e, i, !1)
    } : e.detachEvent && (n = function(t, e, i) {
        t.detachEvent("on" + e, t[e + i]);
        try {
            delete t[e + i]
        } catch (n) {
            t[e + i] = void 0
        }
    });
    var o = {bind: i,unbind: n};
    "function" == typeof define && define.amd ? define(o) : t.eventie = o
}(this), function(t) {
    "use strict";
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : r.push(t))
    }
    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== o.readyState;
        if (!e.isReady && !i) {
            e.isReady = !0;
            for (var n = 0, s = r.length; s > n; n++) {
                var a = r[n];
                a()
            }
        }
    }
    function n(n) {
        return n.bind(o, "DOMContentLoaded", i), n.bind(o, "readystatechange", i), n.bind(t, "load", i), e
    }
    var o = t.document, r = [];
    e.isReady = !1, "function" == typeof define && define.amd ? define(["eventie"], n) : t.docReady = n(t.eventie)
}(this), function(t) {
    "use strict";
    function e() {
    }
    function i(t, e) {
        if (o)
            return e.indexOf(t);
        for (var i = e.length; i--; )
            if (e[i] === t)
                return i;
        return -1
    }
    var n = e.prototype, o = Array.prototype.indexOf ? !0 : !1;
    n._getEvents = function() {
        return this._events || (this._events = {})
    }, n.getListeners = function(t) {
        var e, i, n = this._getEvents();
        if ("object" == typeof t) {
            e = {};
            for (i in n)
                n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i])
        } else
            e = n[t] || (n[t] = []);
        return e
    }, n.getListenersAsObject = function(t) {
        var e, i = this.getListeners(t);
        return i instanceof Array && (e = {}, e[t] = i), e || i
    }, n.addListener = function(t, e) {
        var n, o = this.getListenersAsObject(t);
        for (n in o)
            o.hasOwnProperty(n) && -1 === i(e, o[n]) && o[n].push(e);
        return this
    }, n.on = n.addListener, n.defineEvent = function(t) {
        return this.getListeners(t), this
    }, n.defineEvents = function(t) {
        for (var e = 0; t.length > e; e += 1)
            this.defineEvent(t[e]);
        return this
    }, n.removeListener = function(t, e) {
        var n, o, r = this.getListenersAsObject(t);
        for (o in r)
            r.hasOwnProperty(o) && (n = i(e, r[o]), -1 !== n && r[o].splice(n, 1));
        return this
    }, n.off = n.removeListener, n.addListeners = function(t, e) {
        return this.manipulateListeners(!1, t, e)
    }, n.removeListeners = function(t, e) {
        return this.manipulateListeners(!0, t, e)
    }, n.manipulateListeners = function(t, e, i) {
        var n, o, r = t ? this.removeListener : this.addListener, s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (n = i.length; n--; )
                r.call(this, e, i[n]);
        else
            for (n in e)
                e.hasOwnProperty(n) && (o = e[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
        return this
    }, n.removeEvent = function(t) {
        var e, i = typeof t, n = this._getEvents();
        if ("string" === i)
            delete n[t];
        else if ("object" === i)
            for (e in n)
                n.hasOwnProperty(e) && t.test(e) && delete n[e];
        else
            delete this._events;
        return this
    }, n.emitEvent = function(t, e) {
        var i, n, o, r = this.getListenersAsObject(t);
        for (n in r)
            if (r.hasOwnProperty(n))
                for (i = r[n].length; i--; )
                    o = e ? r[n][i].apply(null, e) : r[n][i](), o === !0 && this.removeListener(t, r[n][i]);
        return this
    }, n.trigger = n.emitEvent, n.emit = function(t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }, "function" == typeof define && define.amd ? define(function() {
        return e
    }) : t.EventEmitter = e
}(this), function(t) {
    "use strict";
    function e() {
    }
    function i(t) {
        function i(e) {
            e.prototype.option || (e.prototype.option = function(e) {
                t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
            })
        }
        function o(e, i) {
            t.fn[e] = function(o) {
                if ("string" == typeof o) {
                    for (var s = n.call(arguments, 1), a = 0, h = this.length; h > a; a++) {
                        var p = this[a], u = t.data(p, e);
                        if (u)
                            if (t.isFunction(u[o]) && "_" !== o.charAt(0)) {
                                var f = u[o].apply(u, s);
                                if (void 0 !== f)
                                    return f
                            } else
                                r("no such method '" + o + "' for " + e + " instance");
                        else
                            r("cannot call methods on " + e + " prior to initialization; " + "attempted to call '" + o + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var n = t.data(this, e);
                    n ? (n.option(o), n._init()) : (n = new i(this, o), t.data(this, e, n))
                })
            }
        }
        if (t) {
            var r = "undefined" == typeof console ? e : function(t) {
                console.error(t)
            };
            t.bridget = function(t, e) {
                i(e), o(t, e)
            }
        }
    }
    var n = Array.prototype.slice;
    "function" == typeof define && define.amd ? define(["jquery"], i) : i(t.jQuery)
}(window), function(t, e) {
    "use strict";
    function i(t, e) {
        return t[a](e)
    }
    function n(t) {
        if (!t.parentNode) {
            var e = document.createDocumentFragment();
            e.appendChild(t)
        }
    }
    function o(t, e) {
        n(t);
        for (var i = t.parentNode.querySelectorAll(e), o = 0, r = i.length; r > o; o++)
            if (i[o] === t)
                return !0;
        return !1
    }
    function r(t, e) {
        return n(t), i(t, e)
    }
    var s, a = function() {
        if (e.matchesSelector)
            return "matchesSelector";
        for (var t = ["webkit", "moz", "ms", "o"], i = 0, n = t.length; n > i; i++) {
            var o = t[i], r = o + "MatchesSelector";
            if (e[r])
                return r
        }
    }();
    if (a) {
        var h = document.createElement("div"), p = i(h, "div");
        s = p ? i : r
    } else
        s = o;
    "function" == typeof define && define.amd ? define(function() {
        return s
    }) : window.matchesSelector = s
}(this, Element.prototype), function(t) {
    "use strict";
    function e(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function i(t, e) {
        t && (this.element = t, this.layout = e, this.position = {x: 0,y: 0}, this._create())
    }
    var n = t.getSize, o = t.getStyleProperty, r = t.EventEmitter, s = document.defaultView, a = s && s.getComputedStyle ? function(t) {
        return s.getComputedStyle(t, null)
    } : function(t) {
        return t.currentStyle
    }, h = o("transition"), p = o("transform"), u = h && p, f = !!o("perspective"), d = {WebkitTransition: "webkitTransitionEnd",MozTransition: "transitionend",OTransition: "otransitionend",transition: "transitionend"}[h], c = ["transform", "transition", "transitionDuration", "transitionProperty"], l = function() {
        for (var t = {}, e = 0, i = c.length; i > e; e++) {
            var n = c[e], r = o(n);
            r && r !== n && (t[n] = r)
        }
        return t
    }();
    e(i.prototype, r.prototype), i.prototype._create = function() {
        this.css({position: "absolute"})
    }, i.prototype.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, i.prototype.getSize = function() {
        this.size = n(this.element)
    }, i.prototype.css = function(t) {
        var e = this.element.style;
        for (var i in t) {
            var n = l[i] || i;
            e[n] = t[i]
        }
    }, i.prototype.getPosition = function() {
        var t = a(this.element), e = this.layout.options, i = e.isOriginLeft, n = e.isOriginTop, o = parseInt(t[i ? "left" : "right"], 10), r = parseInt(t[n ? "top" : "bottom"], 10);
        o = isNaN(o) ? 0 : o, r = isNaN(r) ? 0 : r;
        var s = this.layout.size;
        o -= i ? s.paddingLeft : s.paddingRight, r -= n ? s.paddingTop : s.paddingBottom, this.position.x = o, this.position.y = r
    }, i.prototype.layoutPosition = function() {
        var t = this.layout.size, e = this.layout.options, i = {};
        e.isOriginLeft ? (i.left = this.position.x + t.paddingLeft + "px", i.right = "") : (i.right = this.position.x + t.paddingRight + "px", i.left = ""), e.isOriginTop ? (i.top = this.position.y + t.paddingTop + "px", i.bottom = "") : (i.bottom = this.position.y + t.paddingBottom + "px", i.top = ""), this.css(i), this.emitEvent("layout", [this])
    };
    var m = f ? function(t, e) {
        return "translate3d(" + t + "px, " + e + "px, 0)"
    } : function(t, e) {
        return "translate(" + t + "px, " + e + "px)"
    };
    i.prototype._transitionTo = function(t, e) {
        this.getPosition();
        var i = this.position.x, n = this.position.y, o = parseInt(t, 10), r = parseInt(e, 10), s = o === this.position.x && r === this.position.y;
        if (this.setPosition(t, e), s && !this.isTransitioning)
            return this.layoutPosition(), void 0;
        var a = t - i, h = e - n, p = {}, u = this.layout.options;
        a = u.isOriginLeft ? a : -a, h = u.isOriginTop ? h : -h, p.transform = m(a, h), this.transition({to: p,onTransitionEnd: this.layoutPosition,isCleaning: !0})
    }, i.prototype.goTo = function(t, e) {
        this.setPosition(t, e), this.layoutPosition()
    }, i.prototype.moveTo = u ? i.prototype._transitionTo : i.prototype.goTo, i.prototype.setPosition = function(t, e) {
        this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
    }, i.prototype._nonTransition = function(t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to), t.onTransitionEnd && t.onTransitionEnd.call(this)
    }, i.prototype._transition = function(t) {
        var e = this.layout.options.transitionDuration;
        if (!parseFloat(e))
            return this._nonTransition(t), void 0;
        var i = t.to, n = [];
        for (var o in i)
            n.push(o);
        var r = {};
        if (r.transitionProperty = n.join(","), r.transitionDuration = e, this.element.addEventListener(d, this, !1), (t.isCleaning || t.onTransitionEnd) && this.on("transitionEnd", function(e) {
            return t.isCleaning && e._removeStyles(i), t.onTransitionEnd && t.onTransitionEnd.call(e), !0
        }), t.from) {
            this.css(t.from);
            var s = this.element.offsetHeight;
            s = null
        }
        this.css(r), this.css(i), this.isTransitioning = !0
    }, i.prototype.transition = i.prototype[h ? "_transition" : "_nonTransition"], i.prototype.onwebkitTransitionEnd = function(t) {
        this.ontransitionend(t)
    }, i.prototype.onotransitionend = function(t) {
        this.ontransitionend(t)
    }, i.prototype.ontransitionend = function(t) {
        t.target === this.element && (this.removeTransitionStyles(), this.element.removeEventListener(d, this, !1), this.isTransitioning = !1, this.emitEvent("transitionEnd", [this]))
    }, i.prototype._removeStyles = function(t) {
        var e = {};
        for (var i in t)
            e[i] = "";
        this.css(e)
    };
    var y = {transitionProperty: "",transitionDuration: ""};
    i.prototype.removeTransitionStyles = function() {
        this.css(y)
    }, i.prototype.removeElem = function() {
        this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
    }, i.prototype.remove = h ? function() {
        var t = this;
        this.on("transitionEnd", function() {
            return t.removeElem(), !0
        }), this.hide()
    } : i.prototype.removeElem, i.prototype.reveal = function() {
        this.css({display: ""});
        var t = this.layout.options;
        this.transition({from: t.hiddenStyle,to: t.visibleStyle,isCleaning: !0})
    }, i.prototype.hide = function() {
        this.css({display: ""});
        var t = this.layout.options;
        this.transition({from: t.visibleStyle,to: t.hiddenStyle,isCleaning: !0,onTransitionEnd: function() {
                this.css({display: "none"})
            }})
    }, i.prototype.destroy = function() {
        this.css({position: "",left: "",right: "",top: "",bottom: "",transition: "",transform: ""})
    }, t.Outlayer = {Item: i}
}(window), function(t) {
    "use strict";
    function e(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function i(t) {
        return "[object Array]" === v.call(t)
    }
    function n(t) {
        var e = [];
        if (i(t))
            e = t;
        else if ("number" == typeof t.length)
            for (var n = 0, o = t.length; o > n; n++)
                e.push(t[n]);
        else
            e.push(t);
        return e
    }
    function o(t) {
        return t.replace(/(.)([A-Z])/g, function(t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    }
    function r(t, i) {
        if ("string" == typeof t && (t = l.querySelector(t)), !t || !_(t))
            return m && m.error("Bad " + this.settings.namespace + " element: " + t), void 0;
        this.element = t, this.options = e({}, this.options), e(this.options, i);
        var n = ++L;
        this.element.outlayerGUID = n, E[n] = this, this._create(), this.options.isInitLayout && this.layout()
    }
    function s(t, i) {
        t.prototype[i] = e({}, r.prototype[i])
    }
    var a = t.Outlayer, h = a.Item, p = t.docReady, u = t.EventEmitter, f = t.eventie, d = t.getSize, c = t.matchesSelector, l = t.document, m = t.console, y = t.jQuery, g = function() {
    }, v = Object.prototype.toString, _ = "object" == typeof HTMLElement ? function(t) {
        return t instanceof HTMLElement
    } : function(t) {
        return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
    }, b = Array.prototype.indexOf ? function(t, e) {
        return t.indexOf(e)
    } : function(t, e) {
        for (var i = 0, n = t.length; n > i; i++)
            if (t[i] === e)
                return i;
        return -1
    }, L = 0, E = {};
    r.prototype.settings = {namespace: "outlayer",item: a.Item}, r.prototype.options = {containerStyle: {position: "relative"},isInitLayout: !0,isOriginLeft: !0,isOriginTop: !0,isResizeBound: !0,transitionDuration: "0.4s",hiddenStyle: {opacity: 0,transform: "scale(0.001)"},visibleStyle: {opacity: 1,transform: "scale(1)"}}, e(r.prototype, u.prototype), r.prototype._create = function() {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
    }, r.prototype.reloadItems = function() {
        this.items = this._getItems(this.element.children)
    }, r.prototype._getItems = function(t) {
        for (var e = this._filterFindItemElements(t), i = this.settings.item, n = [], o = 0, r = e.length; r > o; o++) {
            var s = e[o], a = new i(s, this, this.options.itemOptions);
            n.push(a)
        }
        return n
    }, r.prototype._filterFindItemElements = function(t) {
        t = n(t);
        var e = this.options.itemSelector;
        if (!e)
            return t;
        for (var i = [], o = 0, r = t.length; r > o; o++) {
            var s = t[o];
            c(s, e) && i.push(s);
            for (var a = s.querySelectorAll(e), h = 0, p = a.length; p > h; h++)
                i.push(a[h])
        }
        return i
    }, r.prototype.getItemElements = function() {
        for (var t = [], e = 0, i = this.items.length; i > e; e++)
            t.push(this.items[e].element);
        return t
    }, r.prototype.layout = function() {
        this._resetLayout(), this._manageStamps();
        var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
        this.layoutItems(this.items, t), this._isLayoutInited = !0
    }, r.prototype._init = r.prototype.layout, r.prototype._resetLayout = function() {
        this.getSize()
    }, r.prototype.getSize = function() {
        this.size = d(this.element)
    }, r.prototype._getMeasurement = function(t, e) {
        var i, n = this.options[t];
        n ? ("string" == typeof n ? i = this.element.querySelector(n) : _(n) && (i = n), this[t] = i ? d(i)[e] : n) : this[t] = 0
    }, r.prototype.layoutItems = function(t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
    }, r.prototype._getItemsForLayout = function(t) {
        for (var e = [], i = 0, n = t.length; n > i; i++) {
            var o = t[i];
            o.isIgnored || e.push(o)
        }
        return e
    }, r.prototype._layoutItems = function(t, e) {
        if (!t || !t.length)
            return this.emitEvent("layoutComplete", [this, t]), void 0;
        this._itemsOn(t, "layout", function() {
            this.emitEvent("layoutComplete", [this, t])
        });
        for (var i = [], n = 0, o = t.length; o > n; n++) {
            var r = t[n], s = this._getItemLayoutPosition(r);
            s.item = r, s.isInstant = e, i.push(s)
        }
        this._processLayoutQueue(i)
    }, r.prototype._getItemLayoutPosition = function() {
        return {x: 0,y: 0}
    }, r.prototype._processLayoutQueue = function(t) {
        for (var e = 0, i = t.length; i > e; e++) {
            var n = t[e];
            this._positionItem(n.item, n.x, n.y, n.isInstant)
        }
    }, r.prototype._positionItem = function(t, e, i, n) {
        n ? t.goTo(e, i) : t.moveTo(e, i)
    }, r.prototype._postLayout = function() {
        var t = this._getContainerSize();
        t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
    }, r.prototype._getContainerSize = g, r.prototype._setContainerMeasure = function(t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
        }
    }, r.prototype._itemsOn = function(t, e, i) {
        function n() {
            return o++, o === r && i.call(s), !0
        }
        for (var o = 0, r = t.length, s = this, a = 0, h = t.length; h > a; a++) {
            var p = t[a];
            p.on(e, n)
        }
    }, r.prototype.ignore = function(t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }, r.prototype.unignore = function(t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }, r.prototype.stamp = function(t) {
        if (t = this._find(t)) {
            this.stamps = this.stamps.concat(t);
            for (var e = 0, i = t.length; i > e; e++) {
                var n = t[e];
                this.ignore(n)
            }
        }
    }, r.prototype.unstamp = function(t) {
        if (t = this._find(t))
            for (var e = 0, i = t.length; i > e; e++) {
                var n = t[e], o = b(this.stamps, n);
                -1 !== o && this.stamps.splice(o, 1), this.unignore(n)
            }
    }, r.prototype._find = function(t) {
        return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = n(t)) : void 0
    }, r.prototype._manageStamps = function() {
        if (this.stamps && this.stamps.length) {
            this._getBoundingRect();
            for (var t = 0, e = this.stamps.length; e > t; t++) {
                var i = this.stamps[t];
                this._manageStamp(i)
            }
        }
    }, r.prototype._getBoundingRect = function() {
        var t = this.element.getBoundingClientRect(), e = this.size;
        this._boundingRect = {left: t.left + e.paddingLeft + e.borderLeftWidth,top: t.top + e.paddingTop + e.borderTopWidth,right: t.right - (e.paddingRight + e.borderRightWidth),bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)}
    }, r.prototype._manageStamp = g, r.prototype._getElementOffset = function(t) {
        var e = t.getBoundingClientRect(), i = this._boundingRect, n = d(t), o = {left: e.left - i.left - n.marginLeft,top: e.top - i.top - n.marginTop,right: i.right - e.right - n.marginRight,bottom: i.bottom - e.bottom - n.marginBottom};
        return o
    }, r.prototype.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, r.prototype.bindResize = function() {
        this.isResizeBound || (f.bind(t, "resize", this), this.isResizeBound = !0)
    }, r.prototype.unbindResize = function() {
        f.unbind(t, "resize", this), this.isResizeBound = !1
    }, r.prototype.onresize = function() {
        function t() {
            e.resize()
        }
        this.resizeTimeout && clearTimeout(this.resizeTimeout);
        var e = this;
        this.resizeTimeout = setTimeout(t, 100)
    }, r.prototype.resize = function() {
        var t = d(this.element), e = this.size && t;
        e && t.innerWidth === this.size.innerWidth || (this.layout(), delete this.resizeTimeout)
    }, r.prototype.addItems = function(t) {
        var e = this._getItems(t);
        return e.length ? (this.items = this.items.concat(e), e) : void 0
    }, r.prototype.appended = function(t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e))
    }, r.prototype.prepended = function(t) {
        var e = this._getItems(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
        }
    }, r.prototype.reveal = function(t) {
        if (t && t.length)
            for (var e = 0, i = t.length; i > e; e++) {
                var n = t[e];
                n.reveal()
            }
    }, r.prototype.hide = function(t) {
        if (t && t.length)
            for (var e = 0, i = t.length; i > e; e++) {
                var n = t[e];
                n.hide()
            }
    }, r.prototype.getItem = function(t) {
        for (var e = 0, i = this.items.length; i > e; e++) {
            var n = this.items[e];
            if (n.element === t)
                return n
        }
    }, r.prototype.getItems = function(t) {
        if (t && t.length) {
            for (var e = [], i = 0, n = t.length; n > i; i++) {
                var o = t[i], r = this.getItem(o);
                r && e.push(r)
            }
            return e
        }
    }, r.prototype.remove = function(t) {
        t = n(t);
        var e = this.getItems(t);
        this._itemsOn(e, "remove", function() {
            this.emitEvent("removeComplete", [this, e])
        });
        for (var i = 0, o = e.length; o > i; i++) {
            var r = e[i];
            r.remove();
            var s = b(this.items, r);
            this.items.splice(s, 1)
        }
    }, r.prototype.destroy = function() {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "";
        for (var e = 0, i = this.items.length; i > e; e++) {
            var n = this.items[e];
            n.destroy()
        }
        this.unbindResize(), delete this.element.outlayerGUID
    }, r.data = function(t) {
        var e = t && t.outlayerGUID;
        return e && E[e]
    }, r.create = function(t, i) {
        function n() {
            r.apply(this, arguments)
        }
        return e(n.prototype, r.prototype), s(n, "options"), s(n, "settings"), e(n.prototype.options, i), n.prototype.settings.namespace = t, n.data = r.data, n.Item = function() {
            h.apply(this, arguments)
        }, n.Item.prototype = new r.Item, n.prototype.settings.item = n.Item, p(function() {
            for (var e = o(t), i = l.querySelectorAll(".js-" + e), r = "data-" + e + "-options", s = 0, a = i.length; a > s; s++) {
                var h, p = i[s], u = p.getAttribute(r);
                try {
                    h = u && JSON.parse(u)
                } catch (f) {
                    m && m.error("Error parsing " + r + " on " + p.nodeName.toLowerCase() + (p.id ? "#" + p.id : "") + ": " + f);
                    continue
                }
                var d = new n(p, h);
                y && y.data(p, t, d)
            }
        }), y && y.bridget && y.bridget(t, n), n
    }, r.Item = h, t.Outlayer = r
}(window), function(t) {
    "use strict";
    function e(t, e) {
        var n = t.create("masonry");
        return n.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var t = this.cols;
            for (this.colYs = []; t--; )
                this.colYs.push(0);
            this.maxY = 0
        }, n.prototype.measureColumns = function() {
            var t = this._getSizingContainer(), i = this.items[0], n = i && i.element;
            this.columnWidth || (this.columnWidth = n ? e(n).outerWidth : this.size.innerWidth), this.columnWidth += this.gutter, this._containerWidth = e(t).innerWidth, this.cols = Math.floor((this._containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
        }, n.prototype._getSizingContainer = function() {
            return this.options.isFitWidth ? this.element.parentNode : this.element
        }, n.prototype._getItemLayoutPosition = function(t) {
            t.getSize();
            var e = Math.ceil(t.size.outerWidth / this.columnWidth);
            e = Math.min(e, this.cols);
            for (var n = this._getColGroup(e), o = Math.min.apply(Math, n), r = i(n, o), s = {x: this.columnWidth * r,y: o}, a = o + t.size.outerHeight, h = this.cols + 1 - n.length, p = 0; h > p; p++)
                this.colYs[r + p] = a;
            return s
        }, n.prototype._getColGroup = function(t) {
            if (1 === t)
                return this.colYs;
            for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
                var o = this.colYs.slice(n, n + t);
                e[n] = Math.max.apply(Math, o)
            }
            return e
        }, n.prototype._manageStamp = function(t) {
            var i = e(t), n = this._getElementOffset(t), o = this.options.isOriginLeft ? n.left : n.right, r = o + i.outerWidth, s = Math.floor(o / this.columnWidth);
            s = Math.max(0, s);
            var a = Math.floor(r / this.columnWidth);
            a = Math.min(this.cols - 1, a);
            for (var h = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, p = s; a >= p; p++)
                this.colYs[p] = Math.max(h, this.colYs[p])
        }, n.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var t = {height: this.maxY};
            return this.options.isFitWidth && (t.width = this._getContainerFitWidth()), t
        }, n.prototype._getContainerFitWidth = function() {
            for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; )
                t++;
            return (this.cols - t) * this.columnWidth - this.gutter
        }, n.prototype.resize = function() {
            var t = this._getSizingContainer(), i = e(t), n = this.size && i;
            n && i.innerWidth === this._containerWidth || (this.layout(), delete this.resizeTimeout)
        }, n
    }
    var i = Array.prototype.indexOf ? function(t, e) {
        return t.indexOf(e)
    } : function(t, e) {
        for (var i = 0, n = t.length; n > i; i++) {
            var o = t[i];
            if (o === e)
                return i
        }
        return -1
    };
    "function" == typeof define && define.amd ? define(["outlayer", "get-size"], e) : t.Masonry = e(t.Outlayer, t.getSize)
}(window), window.traskLightbox = function(selector) {
    function openLightbox(e) {
        var targ = e.srcElement || e.currentTarget || e, eventName = $$("h2", targ.parentNode).innerHTML || "image clicked";
        if (dataLayer.push({eventCategory: "Images",eventAction: "View",eventLabel: eventName,event: "siteEvent"}), lightboxOpen = !0, imgURL = this.getAttribute("rel"), "true" === this.getAttribute("data-zoom")) {
            var lb = ce("div", "", {id: "lightbox"}, {}), bgi = ce("div", "", {className: "bgi"}, {}), closelb = ce("div", "", {className: "icon-close closelb"}, {});
            $$(".window").appendChild(lb), $$("#lightbox").appendChild(bgi), $$("#lightbox").appendChild(closelb), fade("in", $$("#lightbox"), 450), loadImage(), vine.bind($$(".closelb"), "click", closeLightbox), vine.bind($$(".bgi"), "click", closeLightbox)
        }
    }
    function positionImage(imgNode) {
        imgNode.className = "", imgNode.style.marginLeft = "0px", imgNode.style.marginRight = "0px", imgNode.style.marginTop = "0px", overrideClass = null, imgNode.className = "wide", imgNode.height > $$(".bgi").height() - bgiPadding && (imgNode.className = "tall", imgNode.width <= $$(".bgi").width() - bgiPadding && (overrideClass = !0)), imgNode.className = "", imgNode.height >= imgNode.width && $$(".bgi").width() > $$(".bgi").height() || overrideClass ? (imgNode.className = "tall", marginVal = ($$(".bgi").offsetWidth - bgiPadding) / 2 - imgNode.width / 2, 0 > marginVal && (marginVal = 0), imgNode.style.marginLeft = Math.floor(marginVal) + "px") : (imgNode.className = "wide", marginVal = ($$(".bgi").offsetHeight - bgiPadding) / 2 - imgNode.height / 2, 0 > marginVal && (marginVal = 0), imgNode.style.marginLeft = "auto", imgNode.style.marginRight = "auto", imgNode.style.marginTop = Math.floor(marginVal) + "px")
    }
    function displayImage() {
        $$(".bgi").appendChild(this), positionImage(this), fade("in", this, 450)
    }
    function closeLightbox() {
        var lightbox = $$("#lightbox");
        vine.unbind($$(".closelb")), vine.unbind($$(".bgi")), fade("out", lightbox, 450), lightbox && setTimeout(function() {
            lightboxOpen = !1, lightbox.parentNode.removeChild(lightbox)
        }, 450)
    }
    var imgURL, lightboxOpen, marginVal, overrideClass, bgiPadding = 60, loadImage = function() {
        var t = new Image;
        t.onload = displayImage, t.src = imgURL
    };
    if (!$$(selector).length, $$(selector).length > 1)
        for (var i = 0; i < $$(selector).length; i++)
            vine.bind($$(selector)[i], "click", openLightbox);
    else
        vine.bind($$(selector), "click", openLightbox);
    W(function() {
        lightboxOpen && positionImage($$("img", $$(".bgi")))
    })
};
