/**
 * @file
 */
/* eslint-disable */
/*
        监听contentEl的滑动事件，当浏览器滑动到距离页面底部distance时，触发callback.
       */
var add = new addMore();
function swipeUp(containerEl, distance, callback) {
    var listener = function () {
        hasArrivedBottom(function () {
            callback && callback();
        }, distance || 10);
    };

    var hasArrivedBottom = function (callback, distance) {
        var bodyHeight = getBodyHeight();
        var viewHeight = getViewHeight();
        var scrollTop = getScrollTop();
        distance = distance || 10;

        // console.log(bodyHeight, viewHeight, scrollTop, distance);

        if (bodyHeight - scrollTop - viewHeight < distance) {
            callback && callback();
        }

    };

    var getBodyHeight = function () {
        var body = document.body;
        var html = document.documentElement;

        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    };

    var getViewHeight = function () {
        return window.innerHeight;
    };

    var getScrollTop = function () {
        return document.body.scrollTop;
    };

    containerEl.removeEventListener('touchmove', listener, false);
    containerEl.addEventListener('touchmove', listener, false);
}
function swipeLoad(options) {
    var opts = $.extend({}, options);

    var _me = opts.container;
    console.log(_me);
    var _swipeDownTimer = null;
    var swipeDownDistance = opts.swipedowndis;
    var swipeDownFn = opts.swipedownfun;
    var swipeUpDistance = opts.swipeupdis;
    var swipeUpFn = opts.swipeupfun;
    var _swipeDownDelay = 30;
    var _start = 0;
    var _end = 0;

    var getBodyHeight = function () {
        var body = document.body;
        var html = document.documentElement;
        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    };
    var getScrollTop = function () {
        return document.body.scrollTop;
    };
    var getViewHeight = function () {
        return window.innerHeight;
    };
    var hasArrivedBottom = function (callback, distance) {
        var bodyHeight = getBodyHeight();
        var viewHeight = getViewHeight();
        var scrollTop = getScrollTop();
        distance = distance || 10;
        if (bodyHeight - scrollTop - viewHeight < distance) {
            callback && callback();
        }

    };
    var hasArrivedTop = function (callback, distance) {
        var scrollTop = getScrollTop();
        if (scrollTop <= distance) {
            callback && callback();
        }

    };

    var touchstart = function (event) {
        // alert("touchstart");
        if (!event.touches) {
            event.touches = event.originalEvent.touches;
        }

        if (!event.touches.length) {
            return;
        }

        var touch = event.touches[0];
        _start = touch.pageY;
        console.log(event.touches);
        console.log('touchstart', _start);
    };
    var touchmove = function (event) {
        // alert("touchmove");
        if (!event.touches) {
            event.touches = event.originalEvent.touches;
        }

        if (!event.touches.length) {
            return;
        }

        var touch = event.touches[0];
        _end = (_start - touch.pageY);
    };
    var touchend = function () {
        // alert("end");
        if (_end < 0) { // 下滑
            clearTimeout(_swipeDownTimer);
            _swipeDownTimer = setTimeout(function () {
                hasArrivedTop(function () {
                    swipeDownFn && swipeDownFn();
                }, swipeDownDistance);
            }, _swipeDownDelay);
        }
        else { // 上拉 
            console.log(222);
            hasArrivedBottom(function () {
                console.log(111);
                add.addDiv(); // 显示加载更多div
                swipeUpFn && swipeUpFn();
                add.removeDiv();
            }, swipeUpDistance || 10);
        }
    };
    _me.addEventListener('touchstart', touchstart, false);
    _me.addEventListener('touchmove', touchmove, false);
    _me.addEventListener('touchend', touchend, false);
}

function addMore() {
    // $(window).trigger('disableLoad');
}
addMore.prototype.noMoreDiv = function () {
    if ($('.loadingmore').length > 0) {
        //  this.removeDiv(); 
        $('.loadingmore').html('没有更多了');
    }

    $('.loadingmore').prev().find('.collapse').remove();
};

addMore.prototype.removeDiv = function () {
    $('.loadingmore').remove();
};

addMore.prototype.addDiv = function () {
    if ($('.loadingmore').length > 0) {
        return;
    }

    var loadingmore = $('<div class="loadingmore" data-elems="loadingmore">加载中...</div>');
    loadingmore.appendTo('.content');

};

exports.swipeLoad = swipeLoad;
/* eslint-disable */