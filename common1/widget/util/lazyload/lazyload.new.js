/**
 * @file 图片lazyload功能
 * @author nighca<nighca@live.cn>
 */
/* eslint-disable */
define(function (require, exports, module) {
    var onscroll = require('common/util/onscroll/onscroll');
    var isBackground = false;

    /**
     * check if element is in view
     *
     * @param {Element} element, the element
     * @param {Function} threshold, the threshold
     * @return {boolean} is in view
     */
    var inView = function (element, threshold) {
        var viewTop = 0;
        var viewBottom = window.innerHeight;

        var boundingRect = element.getBoundingClientRect();
        var elemTop = boundingRect.top - threshold;
        var elemBottom = boundingRect.top + Math.round(boundingRect.height) + threshold;

        return (viewTop <= elemTop && elemTop <= viewBottom)
            || (viewTop <= elemBottom && elemBottom <= viewBottom)
            || (elemTop <= viewTop && elemBottom >= viewBottom);
    };

    /**
     * load image with given src
     *
     * @param {Element} element, the <img> element
     * @param {string} src, the image src
     */
    var loadImage = function (element, src) {
        element.lazyload = 'loading';

        if (isBackground) {
            element.style.cssText += 'background-image: url(' + src + ');';
        }
        else {
            element.setAttribute('src', src);
        }

        element.lazyload = 'loaded';
        if (!isBackground) {
            element.style.cssText += 'visibility: hidden;';
            element.onload = function () {
                element.style.cssText += 'visibility: visible;';
            };
            element.onerror = function () {};
        }

    };

    var LazyloadImg = {
        elements: null,
        options: null,
        updateImg: function () {
            this.elements = this.options.context.querySelectorAll(this.selector);
        },
        onViewportChange: function () {
            var options = this.options;

            var elements = this.elements;

            var threshold = options.threshold || 0;
            var srcAttribute = 'data-' + (options.dataAttribute || 'src');
            var supportAsync = options.supportAsync || false;
            var context = this.context = options.context || document.body;

            isBackground = options.dataAttribute === 'background';

            for (var i = 0, l = elements.length, element; i < l; i++) {
                element = elements[i];
                if (
                    !element.lazyload
                    && element.hasAttribute(srcAttribute)
                    && inView(element, threshold)
                ) {
                    loadImage(element, element.getAttribute(srcAttribute));
                }

            }
        },
        optionsPreProcess: function () {
            var options = this.options;
            options.threshold = options.threshold || 0;
            var srcAttribute = 'data-' + (options.dataAttribute || 'src');
            var supportAsync = options.supportAsync || false;
            var context = this.context = options.context || document.body;

        },

        /**
         * init a set of lazyload <img>s
         *
         * @param {string} selector, selector for target <img> element
         * @param {Object} options, options for lazyload
         */
        init: function (selector, options) {
            this.options = options;

            this.updateImg();

            onscroll.add(this.onViewportChange);
            document.addEventListener('DOMContentLoaded', onViewportChange);
            window.addEventListener('orientationchange', onViewportChange);
        }
    };

    /**
     * register a set of elements
     *
     * @param {string} selector, selector for target elements
     * @param {Object} options, options for lazyload
     * @param {Function} callback, handler for in/out view
     */
    var register = function (selector, options, callback) {
        var elements;
        var threshold = options.threshold || 0;
        var supportAsync = options.supportAsync || false;
        var context = options.context || document.body;

        if (!supportAsync) {
            elements = context.querySelectorAll(selector);
        }

        var onViewportChange = function () {
            if (supportAsync) {
                elements = context.querySelectorAll(selector);
            }

            for (var i = 0, l = elements.length, element; i < l; i++) {
                element = elements[i];

                if (
                    !element.inView
                    && inView(element, threshold)
                ) {
                    element.inView = true;
                    callback.call(element, true);
                }

                if (
                    element.inView
                    && !inView(element, threshold)
                ) {
                    element.inView = false;
                    callback.call(element, false);
                }

            }
        };

        onscroll.add(onViewportChange);
        document.addEventListener('DOMContentLoaded', onViewportChange);
        window.addEventListener('orientationchange', onViewportChange);
        onViewportChange();
    };

    module.exports = {
        init: init,
        register: register
    };

    var lazyloadImg = Object.create(LazyloadImg);

    exports.init = function (selector, options) {
        lazyloadImg.init(selector, options);
    };

    exports.updateImg = function () {
        lazyloadImg.updateImg();
    };
});
/* eslint-disable */