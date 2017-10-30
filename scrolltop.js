define(['jquery', 'config'], function($, config) {
    var scrollTop = function(duration, callback) {
        var scrolltop = $(window).scrollTop(),
            maxOffsetHeight = 1500,
            duration = duration || 800,
            jqD = $.Deferred();
        duration = scrolltop > maxOffsetHeight ? duration : scrolltop * duration / maxOffsetHeight;
        $('html, body').animate({scrollTop: 0}, duration, function() {
            jqD.resolve();
            typeof callback === 'function' && callback();
        });
        return jqD.promise();
    };
    return scrollTop;
});
