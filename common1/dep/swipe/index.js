/**
 * @file    图片轮播组件，由开源代码 swipe 源码优化而来（仅兼容手机端）
 * @options
 *      startSlide      开始的 DOM 索引，默认 0
 *      continuous      是否连续播放，默认 true
 *      speed           动画播放时间（ms)，默认300
 *      auto            自动播放间隔
 *      callback        每播放完一个 DOM 的回调函数，参数 index(当前 DOM 的索引), element(当前 DOM)
 *      pointers        下面小圆点，指示当前是第几个DOM
 * @see     https://github.com/bradbirdsall/Swipe
 * @date    2014/03/24
 */

var remove = function (node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
};

module.exports = function (container, options) {
    "use strict";
    options = options || {};

    // transform在部分手机上会对z-index有影响，可以针对手机选择是否使用transform
    // https://www.douban.com/note/343402554/
    var useTransform = options.useTransform = options.hasOwnProperty('useTransform') ? options.useTransform : true;

    if (!container || !container.nodeType || container.children.length === 0) return;

    // 查看浏览器对 touch 和 transition 的支持度
    var browser = {
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function (temp) {
            var props = ['transitionProperty', 'WebkitTransition'];
            for (var i in props)
                if (temp.style[props[i]] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };

    // 这种场景下，图片不进行轮播
    if (!browser.touch || !browser.transitions || container.children.length === 1) {
        container.style.visibility = 'visible';
        return;
    }

    var offloadFn = function (fn) {
        setTimeout(fn, 0)
    }; // offload a functions execution

    var slides,
        slidePos,
        width,
        length,
        hasTwoSlides = false,
        pointers,
        index = parseInt(options.startSlide, 10) || 0,
        speed = options.speed || 300;

    options.continuous = options.continuous !== undefined ? options.continuous : true;

    // addElement pointers
    (function () {
        if (options.pointers) {
            var len = container.children.length,
                i = len;
            pointers = options.pointers;

            while (i--) {
                var dot = document.createElement('i');
                if (len - i - 1 === index) dot.className = 'active';
                pointers.appendChild(dot);
            }
        }
    })();

    function point(index) {
        var l = pointers.children.length;
        index = index % l;
        while (l--) {
            pointers.children[l].className = l === index ? 'active' : '';
        }
    }

    function setup() {
        slides = container.children;
        length = slides.length;

        if (!length) {
            remove(container.parentNode);
            return;
        }

        if (options.continuous && length < 3) {
            var fakes = [];
            for (var i = 0, l = slides.length; i < l; i++) {
                fakes[i] = slides[i].cloneNode(true);
                fakes[i].setAttribute('data-fake', 'true');
                container.appendChild(fakes[i]);
            }
            slides = container.children;
            length = slides.length;
            hasTwoSlides = true;
        }

        slidePos = new Array(length);

        width = container.getBoundingClientRect().width || container.offsetWidth;

        var pos = length;
        while (pos--) {
            var item = slides[pos];
            item.setAttribute('data-index', pos);
            move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
        }

        // reposition elements before and after index
        if (options.continuous) {
            index === 0 && move(circle(index - 1), -width, 0);
            index === length && move(circle(index + 1), width, 0);
        }

        container.style.visibility = 'visible';

        slide(0);
    }

    function prev() {
        if (options.continuous) slide(index - 1);
        else if (index) slide(index - 1); //处理边界溢出情况，index === 0 
    }

    function next() {
        if (options.continuous) slide(index + 1);
        else if (index < slides.length - 1) slide(index + 1);
    }

    function circle(index) {
        // a simple positive modulo using slides.length
        return (slides.length + (index % slides.length)) % slides.length;
    }

    function slide(to, slideSpeed) {
        if (index == to) return;

        var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

        // get the actual position of the slide
        if (options.continuous) {
            var natural_direction = direction;
            direction = -slidePos[circle(to)] / width;

            // if going forward but to < index, use to = slides.length + to
            // if going backward but to > index, use to = -slides.length + to
            if (direction !== natural_direction) to = -direction * slides.length + to;
        }

        var diff = Math.abs(index - to) - 1;

        // move all the slides between index and to in the right direction
        while (diff--) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);

        to = circle(to);

        move(index, width * direction, slideSpeed || speed);
        move(to, 0, slideSpeed || speed);

        if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

        index = to;
        point(index);
        offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function move(index, dist, speed) {
        translate(index, dist, speed);
        slidePos[index] = dist;
    }

    function translate(index, dist, speed) {
        var slide = slides[index],
            style = slide && slide.style;

        if (!style) return;

        style.webkitTransitionDuration =
            style.transitionDuration = speed + 'ms';
        if (useTransform) {
            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.transform = 'translateX(' + dist + 'px)';
        } else {
            style.left = dist + 'px';
        }
    }

    // setup auto slideshow
    var delay = options.auto || 0;
    var interval;

    function begin() {
        interval = setTimeout(next, delay);
    }

    function stop() {
        delay = 0;
        clearTimeout(interval);
    }

    setup();
    if (delay) begin();

    // setup initial vars
    var start = {},
        delta = {},
        isScrolling,
        events;

    events = {
        handleEvent: function (e) {
            switch (e.type) {
                case 'touchstart':
                    this.start(e);
                    break;
                case 'touchmove':
                    this.move(e);
                    break;
                case 'touchend':
                    offloadFn(this.end(e));
                    break;
                case 'resize':
                    offloadFn(setup.call());
                    break;
                case 'webkitTransitionEnd':
                case 'transitionend':
                    offloadFn(this.transitionEnd(event));
                    break;
            }
        },

        start: function (e) {
            var touches = e.touches[0];
            // measure start values
            start = {
                // get initial touch coords
                x: touches.pageX,
                y: touches.pageY,
                // store time to determine touch duration
                time: +new Date()
            };

            // used for testing first move event
            isScrolling = undefined;

            // reset delta and end measurements
            delta = {};
            // e.preventDefault();

            // attach touchmove and touchend listeners
            container.addEventListener('touchmove', this, false);
            container.addEventListener('touchend', this, false);
        },

        move: function (e) {
            // ensure swiping with one touch and not pinching
            if (e.touches.length > 1 || e.scale && e.scale !== 1) return;

            var touches = e.touches[0];

            // measure change in x and y
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            };
            // determine if scrolling test has run - one time test
            if (typeof isScrolling == 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
            }

            // if user is not trying to scroll vertically
            if (!isScrolling) {
                // stop slideshow
                e.preventDefault(); // 防止滚动屏幕
                stop();

                // increase resistance if first or last slide
                if (options.continuous) { // we don't add resistance at the end
                    translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
                } else {
                    delta.x =
                        delta.x /
                        ((!index && delta.x > 0 // if first slide and sliding left
                                || index == slides.length - 1 // or if last slide and sliding right
                                && delta.x < 0 // and if sliding at all
                            ) ?
                            (Math.abs(delta.x) / width + 1) // determine resistance level
                            : 1); // no resistance if false
                    // translate 1:1
                    translate(index - 1, delta.x + slidePos[index - 1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index + 1, delta.x + slidePos[index + 1], 0);
                }
            }
        },

        end: function (e) {
            // measure duration
            var duration = +new Date() - start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250 // if slide duration is less than 250ms
                && Math.abs(delta.x) > 20 // and if slide amt is greater than 20px
                || Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

            // determine if slide attempt is past start and end
            var isPastBounds = !index && delta.x > 0 // if first slide and slide amt is greater than 0
                || index == slides.length - 1 && delta.x < 0; // or if last slide and slide amt is less than 0

            if (options.continuous) isPastBounds = false;

            // determine direction of swipe (true:right, false:left)
            var direction = delta.x < 0;

            // if not scrolling vertically
            if (!isScrolling) {
                if (isValidSlide && !isPastBounds) {
                    if (direction) {

                        if (options.continuous) { // we need to get the next in this direction in place
                            move(circle(index - 1), -width, 0);
                            move(circle(index + 2), width, 0);
                        } else {
                            move(index - 1, -width, 0);
                        }

                        move(index, slidePos[index] - width, speed);
                        move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                        index = circle(index + 1);

                    } else {
                        if (options.continuous) { // we need to get the next in this direction in place
                            move(circle(index + 1), width, 0);
                            move(circle(index - 2), -width, 0);
                        } else {
                            move(index + 1, width, 0);
                        }

                        move(index, slidePos[index] + width, speed);
                        move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                        index = circle(index - 1);
                    }

                    point(index);
                    options.callback && options.callback(index, slides[index]);
                } else {
                    if (options.continuous) {
                        move(circle(index - 1), -width, speed);
                        move(index, 0, speed);
                        move(circle(index + 1), width, speed);
                    } else {
                        move(index - 1, -width, speed);
                        move(index, 0, speed);
                        move(index + 1, width, speed);
                    }
                }
            }

            // kill touchmove and touchend event listeners until touchstart called again
            container.removeEventListener('touchmove', events, false);
            container.removeEventListener('touchend', events, false);
        },

        transitionEnd: function (e) {
            if (parseInt(e.target.getAttribute('data-index'), 10) == index) {
                // if (delay) begin();
                if (options.auto) {
                    clearTimeout(interval);
                    interval = setTimeout(next, options.auto);
                }
                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
            }
        }
    };

    container.addEventListener('touchstart', events, false);
    window.addEventListener('resize', events, false);
    container.addEventListener('webkitTransitionEnd', events, false);
    container.addEventListener('transitionend', events, false);

    return {
        next: function () {
            stop();
            next();
        },
        prev: function () {
            stop();
            prev();
        },
        slide: function (to, speed) {
            stop();
            slide(to, speed);
        },
        pos: function () {
            return index;
        },
        len: function () {
            return hasTwoSlides ? 2 : slides.length;
        }
    }
};
