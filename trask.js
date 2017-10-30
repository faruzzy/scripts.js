"use strict";
function handleMessage(e) {
    if (-1 !== e.data.indexOf('t_ready::')) {
        var frame = e.data.split('t_ready::')[1];
        frameReadyList[frame] = 'ready';
    }
}

function closeMobileMenu(menuEl) {
    if (menuEl.className = menuEl.className.replace(/\btriggered\b/, ''),
        document.getElementById('menu').className = document.getElementById('menu').className.replace(/\bmobile-show\b/, ''),
        document.getElementById('menu').className = document.getElementById('menu').className + ' mobile-hide', document.getElementById('home')) {
        for (var homeEl = document.getElementById('home'), homeItems = homeEl.getElementsByClassName('item'), i = 0; i < homeItems.length; i++) {
            homeItems[i].className = homeItems[i].className + ' menu-closed', homeItems[i].className = homeItems[i].className.replace(/\bmenu-open\b/, '');
        }
    }

    if (document.getElementById('two-column')) {
        var twoColumnEl = document.getElementById('two-column'),
            moduleListEl = twoColumnEl.getElementsByClassName('module_list')[0];

        moduleListEl.className = moduleListEl.className + ' menu-closed', moduleListEl.className = moduleListEl.className.replace(/\bmenu-open\b/, '');
    }

    if (document.getElementById('media')) {
        var mediaEl = document.getElementById('media');
        mediaEl.className = mediaEl.className + ' menu-closed', 
        mediaEl.className = mediaEl.className.replace(/\bmenu-open\b/, '');
    }

    menuEl.style.margin = '0';
}

function openMobileMenu(menuEl) {
    if (menuEl.className = menuEl.className + " triggered",
        document.getElementById('menu').className = document.getElementById('menu').className.replace(/\bmobile-hide\b/, ''),
        document.getElementById('menu').className = document.getElementById('menu').className + ' mobile-show', document.getElementById('home')) {
        for (var homeEl = document.getElementById('home'), homeItems = homeEl.getElementsByClassName('item'), i = 0; i < homeItems.length; i++) {
            homeItems[i].className = homeItems[i].className + ' menu-open', homeItems[i].className = homeItems[i].className.replace(/\bmenu-closed\b/, '');
        }
    }

    if (document.getElementById('two-column')) {
        var twoColumnEl = document.getElementById('two-column'), moduleListEl = twoColumnEl.getElementsByClassName('module_list')[0];
        moduleListEl.className = moduleListEl.className + ' menu-open', moduleListEl.className = moduleListEl.className.replace(/\bmenu-closed\b/, '')
    }

    if (document.getElementById("media")) {
        var mediaEl = document.getElementById("media");
        mediaEl.className = mediaEl.className + " menu-open", mediaEl.className = mediaEl.className.replace(/\bmenu-closed\b/, "")
    }

    menuEl.style.margin = '0 0 0 90px';
}

function clickPage(e) {
    e.srcElement && ('share' !== e.srcElement.id && 'menu-item share' !== e.srcElement.className && (document.getElementById('share').className = ''),
        'menu' !== e.srcElement.className && 'trigger' !== e.srcElement.className && 'box' !== e.srcElement.className && W() <= 1024 && closeMobileMenu(document.getElementById('mobile-menu')));
}

var traskindustries = angular.module('traskindustries', []);
traskindustries.config(['$routeProvider', '$locationProvider', function($routes) {
    $routes.when('/home', {controller: 'HomeController', templateUrl: 'views/home.html'}),
    $routes.when('/innovation', {controller: 'InnovationController', templateUrl: 'views/two-column.html'}),
    $routes.when('/genetics', {controller: 'GeneticsController', templateUrl: 'views/two-column.html'}),
    $routes.when('/media', {controller: 'MediaController', templateUrl: 'views/media.html'}),
    $routes.when('/about', {controller: 'AboutController', templateUrl: 'views/two-column.html'}),
    $routes.otherwise({redirectTo: '/home'});
}]);

var isIE8 = -1 !== navigator.userAgent.indexOf('MSIE 8'),
    isIphone = navigator.userAgent.match(/iPhone/i),
    frameDoneList = [],
    frameReadyList = [],
    infoInitArray = [],
    setupListSpace = function() {
    animateIn();

    var mAI = function(e) {
        e.className += ' active';
    },

    mAO = function(e) {
        e.className = e.className.split(' active').join('');
    },

    constructor = {
        contents: $$('.item', $$('.window', $$('.module_marquee'))),
        nav: $$('.button', $$('.pagination', $$('.module_marquee'))),
        animateInCallback: mAI,
        animateOutCallback: mAO
    },

    Marq = new traskMarquee(constructor);
    $$('.module_marquee').Marq = Marq;

    var lAI = function(e) {
        scrollTo('.module_list', e.offsetTop, 2e3, List.unBindScroll(), setTimeout(function() {
            List.bindScroll();
        }, 2400);
    },

    lAO = function() {},

    constructor = {
        contents: $$('.item', $$('.module_list')),
        scrollContext: '.module_list',
        animateInCallback: lAI,
        animateOutCallback: lAO
    },

    List = new traskList(constructor);

    List.addListener(Marq.goTo),
    Marq.addListener(List.goTo);

    for (var listInfos = $$('.infographic', $$('.module_list')), i = 0; i < listInfos.length; i++) {
        var t = listInfos[i] || listInfos;
        if (isIE8) {
            var rel = getAttr($$('iframe', $$('.item-image', t)), 'rel');
            $$('.item-image', t).removeChild($$('iframe', $$('.item-image', t)));
            var poster = m('<img src="uploads/img/' + rel + '.jpg" class="poster" />');
            $$('.item-image', t).appendChild(poster);
        } else {
            var winW = W();
            getWinSize().height;
            var tST = winW > 1023 ? t.offsetTop - getWinSize().height + $$('.module_list').offsetWidth / 2 : t.offsetTop - getWinSize().height;
            infoInitArray[i] = {el: t,top: tST}
        }
    }

    vine.bind($$('.module_list'), 'scroll', scrollListen);
    for (var listImages = $$('.image', $$('.module_list')), i = 0; i < listImages.length; i++) {
        var targ = listImages[i] ? $$('.poster', listImages[i]) : $$('.poster', listImages);
        targ.src = getAttr(targ, 'ref');
    }

    for (var listVideos = $$('.video', $$('.module_list')), i = 0; i < listVideos.length; i++)
        var parent = $$('.list_yt', listVideos[i]), targ = $$('.poster', parent);
        targ.src = getAttr(targ, 'ref'),

        vine.bind($$('.icon-play', parent), 'click', function(e) {
            var targ = e.srcElement || e.currentTarget || e, _vidID = getAttr(targ.parentNode, 'rel');
            new YTPlayerWrapper({container: $$('.container', targ.parentNode).id,vidID: _vidID}), targ.style.display = 'none';
        });
    }

    for (var preloadImageSequence = function(path, total, ext, delay) {
        for (var i = 0; total + 1 > i; i++)
            staggerLoad(path + i + ext, i * delay);
    }, staggerLoad = function(path, delay) {
        window.setTimeout(function() {
            var im = new Image();
            im.src = path;
        }, delay)
    }, listImageSeq = $$('.img_sequence', $$('.module_list')), i = 0; i < listImageSeq.length; i++) {
        var t = listImageSeq[i] || listImageSeq,
            container = $$('.list_imagesequence', t),
            sB = getAttr(container, 'rel'),
            fr = getAttr(container, 'ref'),
            iO = { fps: 10,sequenceElement: container,srcBase: sB,totalFrames: fr,spriteElement: $$(".icon", t),autoplay: !1,loop: !0 };

        preloadImageSequence(getAttr(container, 'rel'), parseInt(getAttr(container, 'ref')), '.jpg', 500);
        var sp = new imageSequenceAnimation(iO);
        container.data = sp;
        var hit = document.createElement('div');

        hit.className = 'hitarea', container.appendChild(hit), vine.bind($$('.hitarea', container), 'mouseover', function(e) {
            var targ = e.srcElement || e.currentTarget || e;
            targ.parentNode.data.start();
        }), vine.bind($$(".hitarea", container), "mouseout", function(e) {
            var targ = e.srcElement || e.currentTarget || e;
            targ.parentNode.data.pause();
        });
    }

    for (var mImageLoaded = function(e) {centerImage(e.currentTarget);}, mPosters = $$(".poster", $$(".window", $$(".module_marquee"))), i = 0; i < mPosters.length; i++) {
        var t = mPosters[i] || mPosters;
        t.onload = mImageLoaded, 
        t.src = getAttr(t, "ref");
    }

    for (var mVideos = $$(".yt_video", $$(".window", $$(".module_marquee"))), i = 0; i < mVideos.length; i++) {
        var targ = $$(".marquee_yt", mVideos[i]);
        targ.style.backgroundImage = "url('" + getAttr(targ, "ref") + "')", 
        vine.bind($$(".play", targ), "click", function(e) {
            var targ = e.srcElement || e.currentTarget || e, _vidID = getAttr(targ.parentNode, "rel");
            new YTPlayerWrapper({container: $$(".container", targ.parentNode).id,vidID: _vidID}), targ.style.display = "none"
        });
    }

    for (var mHVideos = $$(".hosted_video", $$(".window", $$(".module_marquee"))), i = 0; i < mHVideos.length; i++) {
        var t = mHVideos[i] || mHVideos, c = $$(".content", t), sB = c.getAttribute ? c.getAttribute("ref") : c.attributes.ref.value, targ = $$(".h_video_container", t);
        new HostedVideoPlayer({srcBase: sB,container: targ,autoplay: "true",loop: "true"})
    }

    document.getElementById("full-image") && (document.onkeydown = function() {
        document.getElementById("full-image").parentNode.removeChild(document.getElementById("full-image")), document.getElementById("full-image-close").style.display = "none"
    }), W(handleResize), handleResize(), scrollListen()
}, centerImage = function(e) {
    setTimeout(function() {
        e.style.left = "50%";
        var hMW = $$("#menu").offsetWidth / 2;
        e.style.marginLeft = "-" + (e.offsetWidth / 2 - hMW) + "px"
    }, 200)
}, handleResize = function() {
    for (var mPosters = $$(".poster", $$(".window", $$(".module_marquee"))), i = 0; i < mPosters.length; i++) {
        var t = mPosters[i] || mPosters;
        t.style.left = "50%";
        var hMW = $$("#menu").offsetWidth / 2;
        t.style.marginLeft = "-" + (t.offsetWidth / 2 - hMW) + "px"
    }
    if (1 == $$(".module_list").length) {
        var listW = $$(".module_list").offsetWidth;
        if (!isIE8) {
            var listInfos = $$(".infographic", $$(".module_list")), iWidth = isIphone ? 605 : 655;
            console.log("iWidth", iWidth);
            for (var scl = listW / iWidth, i = 0; i < listInfos.length; i++) {
                var t = listInfos[i] ? $$("iframe", listInfos[i]) : $$("iframe", listInfos), iHeight = parseInt(getAttr(t, "ref")), newHeight = scl * iHeight;
                t.style["-webkit-transform"] = "scale(" + scl + ")",
                t.style["-ms-transform"] = "scale(" + scl + ")",
                t.style["-moz-transform"] = "scale(" + scl + ")",
                t.style.transform = "scale(" + scl + ")",
                t.parentNode.style.height = newHeight + "px",
                t.style.width = $$(".module_list").offsetWidth / scl + "px"
            }
        }
        var listImageSeq = $$(".img_sequence", $$(".module_list")), liW = 700;
        if (W() <= 641)
            var liH = 385;
        else if (W() <= 1023)
            var liH = 365;
        else
            var liH = 433;
        for (var test = listImageSeq[0] || listImageSeq, infoscl = liW / test.offsetWidth, i = 0; i < listImageSeq.length; i++) {
            var t = listImageSeq[i] || listImageSeq;
            $$(".list_imagesequence", t).style.height = liH / infoscl + "px"
        }
    }
}, scrollListen = function() {
    for (var cS = getScrollTop(".module_list"), i = 0; i < infoInitArray.length; i++) {
        var a = $$(".graphic", infoInitArray[i].el);
        cS > infoInitArray[i].top && (frameDoneList[a.id] || (frameDoneList[a.id] = "true", frameReadyList[a.id] && a.contentWindow ? a.contentWindow.postMessage("init", "*") : delayInitIframe(a.id, a)))
    }
}, delayInitIframe = function(e, a) {
    setTimeout(function() {
        frameReadyList[e] && a && a.contentWindow ? a.contentWindow.postMessage("init", "*") : delayInitIframe(e, a)
    }, 300)
}, getAttr = function(ele, attr) {
    var result = ele.getAttribute && ele.getAttribute(attr) || null;
    if (!result)
        for (var attrs = ele.attributes, length = attrs.length, i = 0; length > i; i++)
            attrs[i].nodeName === attr && (result = attrs[i].nodeValue);
    return result
};
window.addEventListener && window.addEventListener("message", handleMessage, !1), -1 == navigator.appVersion.indexOf("MSIE 9") && window.attachEvent && window.attachEvent("onmessage", handleMessage, !1);
var animateIn = function() {
    -1 == $$("#menu").className.indexOf("inplace") && (TweenLite.to($$("#menu"), .9, {left: 0,ease: "Power4.easeOut",delay: .1}), TweenLite.to($$(".home", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .2}), TweenLite.to($$(".innovation", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .3}), TweenLite.to($$(".genetics", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .4}), TweenLite.to($$(".media", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .5}), TweenLite.to($$(".about", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .6}), TweenLite.to($$(".share", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .7}), TweenLite.to($$(".module_list"), 1.1, {right: 0,ease: Quint.easeOut,delay: .7}), TweenLite.to($$(".module_marquee"), .8, {opacity: 1,ease: Quint.easeOut,delay: 1.5}))
};
vine.bind($$("#site-container"), "click", clickPage);
var ce = function(e, html, attr, styleattr) {
    var el = document.createElement(e);
    el.innerHTML = html;
    for (var key in attr)
        el[key] = attr[key];
    for (var key in styleattr)
        el.style[key] = styleattr[key];
    return el
};

traskindustries.controller("AboutController", function($scope, $http) {
    var version = 2;
    $http.get("data/about.json?v=" + version).success(function(data) {
        $scope.list = data, $scope.orderFoo = "order", $scope.section = "about", window.setTimeout(setupListSpace, 200)
    }), $scope.status = "ready"
}),

traskindustries.controller("GeneticsController", function($scope, $http) {
    var version = 2;
    $http.get("data/genetics.json?v=" + version).success(function(data) {
        $scope.list = data, $scope.orderFoo = "order", window.setTimeout(setupListSpace, 200)
    }), $scope.status = "ready"
}),

traskindustries.controller("HomeController", function($scope, $http) {
    $$("#legal").className += " hide";
    var version = 2;

    $http.get("data/home.json?v=" + version).success(function(data) {
        $scope.list = data, $scope.orderFoo = "order", onDomReady(function() {
            window.setTimeout(setUpHomeSpace, 300)
        });
    });

    var setUpHomeSpace = function() {
        var mAI = function(e) {
            $$("video", e).currentTime && ($$("video", e).currentTime = 0), window.setTimeout(function() {
                for (var videos = $$("video", $$(".window", $$(".module_marquee"))), i = 0; i < videos.length; i++) {
                    var t = videos[i] || videos;
                    t.pause && t.pause(), t.currentTime && (t.currentTime = 0)
                }
                $$("video", e) && $$("video", e).play && $$("video", e).play()
            }, 700), e.className += " active"
        },

        mAO = function(e) {
            e.className = e.className.split(" active").join("")
        },

        constructor = {
            contents: $$(".item", $$(".window", $$(".module_marquee"))),
            nav: $$(".button", $$(".pagination", $$(".module_marquee"))),
            autoAdvance: "true",
            autoAdvanceTime: 6e3,
            animateInCallback: mAI,
            animateOutCallback: mAO
        },

        Marq = new traskMarquee(constructor);
        $$(".module_marquee").Marq = Marq;
        for (var mImageLoaded = function(e) {
            centerImage(e.currentTarget)
        }, centerImage = function(e) {
            if (e && e.offsetWidth > 0) {
                e.style.left = "50%";
                var hMW = $$("#menu").offsetWidth / 2;
                e.style.marginLeft = "-" + (e.offsetWidth / 2 - hMW) + "px"
            } else
                setTimeout(function(e) {
                    centerImage(e)
                }, 400)
        }, mPosters = $$(".poster", $$(".window", $$(".module_marquee"))), i = 0; i < mPosters.length; i++)
            mPosters[i].onload = mImageLoaded, mPosters[i].src = getAttr(mPosters[i], "ref");
        hasClass($$("mobile-menu"), "triggered") && ($$(".item", $$("#home"))[0].style.margin = "0 0 0 120px");

        var ytSel = ".yt_container",
        handleResizeHome = function() {
            for (var mPosters = $$(".poster", $$(".window", $$(".module_marquee"))), i = 0; i < mPosters.length; i++)
                centerImage(mPosters[i]);
            for (var m = $$("#menu").offsetWidth, w = getWinSize().width, tS = $$(ytSel), i = 0; i < tS.length; i++) {
                var t = tS[i] || tS;
                t.style.marginLeft = m + "px", t.style.width = w - m + "px"
            }
            for (var videos = $$("video", $$(".window", $$(".module_marquee"))), vW = 1280, vH = 720, vR = vW / vH, winDim = getWinSize(), wR = winDim.width / winDim.height, i = 0; i < videos.length; i++) {
                var t = videos[i] || videos;
                if (wR > vR) {
                    var w = winDim.width;
                    t.style.height = w / vR + "px", t.style.width = w + "px"
                } else
                    t.style.height = "100%", t.style.width = "auto"
            }
        };
        handleResizeHome(), setTimeout(handleResizeHome, 300), W(handleResizeHome);
        for (var mVideos = $$(".video", $$(".module_marquee")), i = 0; i < mVideos.length; i++) {
            var targ = $$(".marquee_yt", mVideos[i]) || $$(".marquee_yt", mVideos);
            vine.bind($$(".icon-play", targ), "click", function(e) {
                var targ = e.srcElement || e.currentTarget || e, _vidID = targ.parentNode.getAttribute ? targ.parentNode.getAttribute("rel") : targ.parentNode.attributes.rel.value;
                new YTPlayerWrapper({container: $$(".yt_container", targ.parentNode).id,vidID: _vidID,attachToDOM: "true",playingCallBack: Marq.pause}), targ.style.display = "none", $$(".poster", targ.parentNode).style.display = "none", $$(".title", targ.parentNode.parentNode.parentNode.parentNode).style.display = "none", $$(".body", targ.parentNode.parentNode.parentNode.parentNode).style.display = "none"
            })
        }
        for (var mHVideos = $$(".hosted_video", $$(".window", $$(".module_marquee"))), i = 0; i < mHVideos.length; i++) {
            var t = mHVideos[i] || mHVideos, c = $$(".content", t), sB = c.getAttribute ? c.getAttribute("ref") : c.attributes.ref.value, targ = $$(".h_video_container", t);
            W() < 1023 ? (targ.style.backgroundImage = "url(" + sB + "_m.jpg)", targ.style.backgroundRepeat = "no-repeat", targ.style["-webkit-background-size"] = "cover", targ.style["-moz-background-size"] = "cover", targ.style["-o-background-size"] = "cover", targ.style["background-size"] = "cover", targ.style["-ms-filter"] = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + sB + "_m.jpg', sizingMethod='scale');", targ.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + sB + "_m.jpg', sizingMethod='scale')") : 0 == i ? new HostedVideoPlayer({srcBase: sB,container: targ,autoplay: "true",loop: "true"}) : new HostedVideoPlayer({srcBase: sB,container: targ,autoplay: "false",loop: "true"})
        }
        
        for (var findOutHow = function(e) {
            Marq.pause();
            var menuEl = document.getElementById("mobile-menu"), 
                targ = e.srcElement || e.currentTarget || e,
                nextSection = targ.getAttribute ? targ.getAttribute("rel") : targ.attributes.rel.value;

            dataLayer.push({pageName: "/FOH/" + nextSection,event: "pageView"}),
            hasClass(menuEl, "triggered") && (document.getElementById("menu").className = document.getElementById("menu").className.replace(/\bmobile-show\b/, ""), document.getElementById("menu").className = document.getElementById("menu").className + " mobile-hide", menuEl.style.margin = "0", menuEl.className = menuEl.className.replace(/\btriggered\b/, "")), 
            document.width > 1024 ? animateSectionOut(function() {angular.element($$("#menu")).scope().switchSection(nextSection)
            }) : angular.element($$("#menu")).scope().switchSection(nextSection)
        },

        fowBtns = $$(".findouthow"), i = 0; i < fowBtns.length; i++) {
            var t = fowBtns[i] || fowBtns;
            vine.bind(t, "click", findOutHow)
        }
        var animateSectionOut = function(callback) {
            Marq.pause(), TweenLite.to($$(".module_marquee"), 1, {opacity: 0,ease: Quint.easeInOut,onComplete: callback});
            var targRight = -(.35 * getWinSize().width);
            1 == $$(".module_list").length && TweenLite.to($$(".module_list"), 1, {right: targRight,ease: Quint.easeInOut,delay: .2,onComplete: callback})
        }, animateIn = function() {
            TweenLite.to($$(".module_marquee"), .8, {opacity: 1,ease: Quint.easeOut,delay: .2}), TweenLite.to($$("#menu"), .9, {left: 0,ease: "Power4.easeOut",delay: .7}), TweenLite.to($$(".home", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .8}), TweenLite.to($$(".innovation", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: .9}), TweenLite.to($$(".genetics", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: 1}), TweenLite.to($$(".media", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: 1.1}), TweenLite.to($$(".about", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: 1.2}), TweenLite.to($$(".share", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: 1.5}), TweenLite.to($$(".legal", $$("#menu")), .5, {left: 0,ease: "Power4.easeOut",delay: 1.6})
        };
        animateIn()
    };
    $$("#legal").className = $$("#legal").className.split("hide").join(""), $scope.status = "ready"
}),

traskindustries.controller("InnovationController", function($scope, $http) {
    var version = 3;
    $http.get("data/innovation.json?v=" + version).success(function(data) {
        $scope.list = data, $scope.orderFoo = "order", window.setTimeout(setupListSpace, 200)
    }), $scope.status = "ready"
}),

traskindustries.controller("MediaController", function($scope, $http, $location) {
    function scheduleFadeIn(currentIndex) {
        setTimeout(function() {
            $$("#item_" + currentIndex).style.visibility = "visible", fade("in", $$("#item_" + currentIndex), fadeDuration)
        }, fadeDelay * currentIndex)
    }

    function fadeInItems() {
        for (var i = 0; i < $$(".item").length; i++)
            scheduleFadeIn(i)
    }

    function masonryInit() {
        var container = $$("#masonry");
        msnry = new Masonry(container, {columnWidth: ".small",itemSelector: ".item"}), imagesLoaded(container, function() {
            msnry.layout(), setTimeout(function() {
                fadeInItems(), msnry.layout(), msnry.unbindResize(), checkAutoPlay(), $$("#legal").className = $$("#legal").className.split("hide").join("")
            }, 500)
        })
    }

    function checkAutoPlay() {
        -1 != $location.$$url.indexOf("autoplay") && ytLightbox.openLightbox({currentTarget: $$(".video")})
    }

    function hoverState() {
        this.parentNode.className += " hover"
    }

    function defaultState() {
        this.parentNode.className = this.parentNode.className.replace(/\b hover\b/, "")
    }

    function bindHoverstates(selector) {
        if (!$$(selector).length, $$(selector).length > 1)
            for (var i = 0; i < $$(selector).length; i++)
                vine.bind($$(selector)[i], "mouseover", hoverState), vine.bind($$(selector)[i], "mouseout", defaultState);
        else
            vine.bind($$(selector), "mouseover", hoverState), vine.bind($$(selector), "mouseout", defaultState)
    }

    function pageResize() {
        var latestDateTime = currentDateTime = (new Date).getTime();
        windowWidth = W(), windowWidth > 1023 && (windowWidth -= 170), baseWidth = getBaseWidth(), lgWidth = numCols > 1 ? 2 * baseWidth : baseWidth, setTimeout(function() {
            finalResizeLayout(latestDateTime)
        }, 450)
    }

    function getNumCols() {
        return 700 >= windowWidth ? 1 : 1024 >= windowWidth ? 2 : 1280 >= windowWidth ? 3 : 4
    }

    function getBaseWidth() {
        return numCols = getNumCols(), Math.ceil(windowWidth / numCols)
    }

    function setItemSizes(selector, elWidth) {
        if ($$(selector).length < 1)
            return !1;
        if ($$(selector).length > 1)
            for (var i = 0; i < $$(selector).length; i++)
                $$(selector)[i].style.width = elWidth;
        else
            $$(selector).style.width = elWidth
    }

    function finalResizeLayout(dateTimeFlag) {
        currentDateTime > dateTimeFlag || (setItemSizes(".small", baseWidth + "px"), setItemSizes(".large", lgWidth + "px"), msnry && msnry.layout())
    }

    function setupMediaSpace() {
        pageResize(), masonryInit(), traskLightbox(".image"), ytLightbox.init(".video"), bindHoverstates(".hitarea"), pageResize(), W(pageResize)
    }

    var version = 2;
    $http.get("data/media.json?v=" + version).success(function(data) {
        $scope.list = data, $scope.orderFoo = "order", onDomReady(function() {
            window.setTimeout(setupMediaSpace, 200), animateIn()
        })
    });

    var msnry,
    windowWidth,
    baseWidth,
    lgWidth,
    currentDateTime,
    numCols,
    fadeDuration = 400,
    fadeDelay = 300,
    ytLightbox = {
        _inst: this,
        _vidID: null,
        _video: null,
        openLightbox: function(e) {
            var targ = e.srcElement || e.currentTarget || e;
            if (ytLightbox._vidID = targ.parentNode ? $$(".video-block", targ.parentNode).getAttribute("rel") : targ, console.log($$(".video-block", targ.parentNode)), targ.parentNode)
                var eventName = $$("h2", targ.parentNode).innerHTML || "video clicked";
            dataLayer.push({videoAction: "Play",videoName: eventName,event: "video"});
            var lb = ce("div", "", {id: "lightbox"}, {}), yt_wrap = ce("div", "", {id: "yt_lb_wrap"}, {}), yt_media = ce("div", "", {id: "yt_lb_media"}, {}), closelb = ce("div", "", {className: "icon-close closelb"}, {});
            $$(".window").appendChild(lb), $$("#lightbox").appendChild(yt_wrap), $$("#yt_lb_wrap").appendChild(yt_media), $$("#lightbox").appendChild(closelb), $$(".window").appendChild(lb), fade("in", $$("#lightbox"), 450), setTimeout(function() {
                ytLightbox.loadVideo()
            }, 450), vine.bind($$(".closelb"), "click", ytLightbox.closeLightbox)
        },
        loadVideo: function() {
            ytLightbox._video = new YTPlayerWrapper({container: "yt_lb_media",vidID: ytLightbox._vidID})
        },
        closeLightbox: function() {
            ytLightbox._video.pause();
            var lightbox = $$("#lightbox");
            vine.unbind($$(".closelb")), fade("out", lightbox, 450), lightbox && setTimeout(function() {
                ytLightbox._video.destroy(), lightbox.parentNode.removeChild(lightbox)
            }, 450)
        },
        init: function(selector) {
            if (!$$(selector).length, $$(selector).length > 1)
                for (var i = 0; i < $$(selector).length; i++)
                    vine.bind($$(selector)[i], "click", ytLightbox.openLightbox);
            else
                vine.bind($$(selector), "click", ytLightbox.openLightbox)
        }}
}); //end media controller

var menuInited = !1;

traskindustries.controller("MenuController", function($scope, $http, $location) {
    function socialInit() {
        window.___gcfg = {parsetags: "onload"}, function() {
            var po = document.createElement("script");
            po.type = "text/javascript", po.async = !0, po.src = "https://apis.google.com/js/plusone.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(po, s)
        }(), function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            d.getElementById(id) || (js = d.createElement(s), js.id = id, js.async = !0, js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=271140516272162", fjs.parentNode.insertBefore(js, fjs))
        }(document, "script", "facebook-jssdk"), window.fbAsyncInit = function() {
            FB.init({appId: "271140516272162",status: !0,cookie: !0,xfbml: !0}), FB.Event.subscribe("edge.create", function(response) {
                dataLayer.push({socialNetwork: "Facebook",socialActivity: "Like",socialTarget: response,event: "socialEvent"})
            }), FB.Event.subscribe("edge.remove", function(response) {
                dataLayer.push({socialNetwork: "Facebook",socialActivity: "Unlike",socialTarget: response,event: "socialEvent"})
            }), FB.Event.subscribe("message.send", function(response) {
                dataLayer.push({socialNetwork: "Facebook",socialActivity: "Share",socialTarget: response,event: "socialEvent"})
            })
        }, !function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            d.getElementById(id) || (js = d.createElement(s), js.id = id, js.async = !0, js.src = "//platform.twitter.com/widgets.js", fjs.parentNode.insertBefore(js, fjs))
        }(document, "script", "twitter-wjs"), twttr.ready(function(twttr) {
            twttr.events.bind("tweet", function() {
                dataLayer.push({socialNetwork: Twitter,socialActivity: "Tweet",event: "socialEvent"})
            })
        })
    }
    function renderGP() {
        return "object" != typeof gapi ? (setTimeout(renderGP, 500), void 0) : void 0
    }

    var version = 3;
    $http.get("data/menu.json?v=" + version).success(function(data) {
        $scope.list = data, $scope.location = $location, $scope.orderFoo = "order", onDomReady(function() {
            menuInited || (menuInited = !0, setUpTopNav())
        })
    });

    var nextSection, thisSection, setUpTopNav = function() {
        var top_menu_items = $$(".menu-item", $$("#menu"));
        if (top_menu_items.length < 1)
            return window.setTimeout(setUpTopNav, 400), !1;
        thisSection = $location.$$path.split("/").join("") || "home";
        for (var i = 0; i < top_menu_items.length; i++) {
            var t = top_menu_items[i] || top_menu_items, rel = t.getAttribute ? t.getAttribute("rel") : t.attributes.rel.value;
            if ("home" == rel && -1 == $location.$$path.indexOf("home") && vine.bind($$(".hitarea", t), "click", $scope.switchSection), 0 == $$(".icon", t).length && 1 == i)
                return window.setTimeout(setUpTopNav, 400), !1;
            if ($$(".icon", t).length) {
                var spO = {fps: 30,cols: 15,rows: 1,cell_width: 70,cell_height: 70,src: "img/sprite_" + rel + ".png",spriteElement: $$(".icon", t),autoplay: !1,loadCallBack: function() {
                    },animationCompleteCallback: function() {
                    }}, sp = new spriteAnimation(spO);
                -1 == $location.$$path.indexOf(rel) ? (vine.bind($$(".hitarea", t), "click", $scope.switchSection), vine.bind($$(".hitarea", t), "mouseover", menuOver), vine.bind($$(".hitarea", t), "mouseout", menuOut)) : sp.goToFrame(sp.options.cols)
            }
        }
        vine.unbind($$(".home-btn"), "click", $scope.switchSection), vine.bind($$(".home-btn"), "click", $scope.switchSection);
        for (var sob = $$(".social_ob"), i = 0; i < sob.length; i++) {
            var t = sob[i] || sob;
            vine.bind(t, "click", function(e) {
                var targ = e.srcElement || e.currentTarget || e;
                dataLayer.push({eventLabel: targ.href,event: "exitSite"})
            })
        }
    },

    menuOver = function(e) {
        var targ = e.srcElement || e.currentTarget, icon = $$(".icon", targ.parentNode);
        icon.spriteAnimation && icon.spriteAnimation.reverse("false", "true")
    },

    menuOut = function(e) {
        var targ = e.srcElement || e.currentTarget, icon = $$(".icon", targ.parentNode);
        icon.spriteAnimation && icon.spriteAnimation.reverse("true", "true")
    };

    $scope.switchSection = function(e) {
        -1 != window.location.hash.indexOf("autoplay") && (window.location.hash = window.location.hash.split("autoplay").join("")), 
        frameDoneList = [], 
        frameReadyList = [], 
        infoInitArray = [], 
        $$(".module_marquee").length > 0 && $$(".module_marquee").Marq && $$(".module_marquee").Marq.pause();
        
        var targ = e.srcElement || e.currentTarget || e;
        if (nextSection = targ == e ? e : targ.parentNode.getAttribute ? targ.parentNode.getAttribute("rel") : targ.parentNode.attributes.rel.value, nextSection == thisSection || "home" == thisSection && "" == nextSection)
            return !1;
        if ($$("." + thisSection).length > 0 && ($$("." + nextSection).className = $$("." + nextSection).className + " active", $$("." + thisSection).className = $$("." + thisSection).className.replace(/\bactive\b/, "")), $$("." + thisSection, $$("#menu")).length > 0 && $$(".hitarea", $$("." + thisSection, $$("#menu"))).length > 0) {
            var lb = $$(".hitarea", $$("." + thisSection, $$("#menu")));
            vine.bind(lb, "click", $scope.switchSection), vine.bind(lb, "mouseover", menuOver), vine.bind(lb, "mouseout", menuOut)
        }
        "home" != thisSection && $$("." + thisSection, $$("#menu")).length > 0 && $$(".icon", $$("." + thisSection, $$("#menu"))).length > 0 && $$(".icon", $$("." + thisSection, $$("#menu"))).spriteAnimation.reverse("true", "true"), targ != e && "home" != nextSection && (vine.unbind(targ, "mouseout", menuOut), vine.unbind(targ, "mouseover", menuOver)), dataLayer.push({pageName: nextSection,event: "pageView"});
        var menuEl = document.getElementById("mobile-menu");
        targ.parentNode && targ.parentNode.attributes.rel ? (hasClass(menuEl, "triggered") && (document.getElementById("menu").className = document.getElementById("menu").className.replace(/\bmobile-show\b/, ""), document.getElementById("menu").className = document.getElementById("menu").className + " mobile-hide", menuEl.style.margin = "0", menuEl.className = menuEl.className.replace(/\btriggered\b/, "")), document.width > 1024 ? animateSectionOut(goToNextSection) : goToNextSection()) : goToNextSection()
    };

    var goToNextSection = function() {
        $location.path("/" + nextSection), $scope.$apply(), thisSection = nextSection, $$("." + thisSection, $$("#menu")).length > 0 && $$(".icon", $$("." + thisSection, $$("#menu"))).spriteAnimation && $$(".icon", $$("." + thisSection, $$("#menu"))).spriteAnimation.reverse("false", "true")
    },

    animateSectionOut = function(callback) {
        TweenLite.to($$(".module_marquee"), 1, {opacity: 0,ease: Quint.easeInOut,onComplete: callback});
        var targRight = -(.35 * getWinSize().width);
        $$(".module_list") && 1 == $$(".module_list").length && TweenLite.to($$(".module_list"), 1, {right: targRight,ease: Quint.easeInOut,delay: .2,onComplete: callback}), $$("#masonry") && ($$("#legal").className += " hide", fade("out", $$("#masonry"), 450))
    };

    $scope.share = function($event) {
        $event.stopPropagation();
        var shareEl = document.getElementById("share");
        hasClass(shareEl, "triggered") ? shareEl.className = "" : (shareEl.className = "triggered", dataLayer.push({eventCategory: "Site",eventAction: "View",eventLabel: "Share Container"}))
    },

    $scope.toggle = function() {
        console.log("toggle");
        var menuEl = document.getElementById("mobile-menu");
        hasClass(menuEl, "triggered") ? closeMobileMenu(document.getElementById("mobile-menu")) : openMobileMenu(document.getElementById("mobile-menu"))
    }, $scope.status = "ready", socialInit(), setTimeout(renderGP, 1e3)
});
