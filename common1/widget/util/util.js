/**
 * @file helper methods
 * @author lb<nighca@live.cn>
 */
/* eslint-disable */
var $ = require('dep/zepto');

/**
 * @param {string} url, origin url
 * @param {params=} params, additional params
 * @return {string} formatted url
 */
var formatUrl = function (url, params) {
    params = params && Object.keys(params).map(function (key) {
        return [key, params[key]].map(encodeURIComponent).join('=');
    }).join('&');

    return params ? url + (url.indexOf('?') >= 0 ? '&' : '?') + params : url;
};

/**
 * Do cllback while BNJS is ready.
 *
 * @param {Function} callback, the callback method
 */
var ready = function (callback) {
    if (typeof callback !== 'function') {
        return;
    }

    if (
        window.BNJS && window.BNJS._isAllReady
    ) {
        callback(window.BNJS);
        return;
    }

    document.addEventListener('BNJSReady', function () {
        callback(window.BNJS);
    }, false);
};

// bnjs.page.start
if (__DEV__) {

    var devBNJS = function () {
        var start = BNJS.page.start;

        BNJS.page.start = function (url, params, action, direction) {
            // plain url, not schema
            if (!(/^bainuo\:/).test(url)) {
                start(url, params, action, direction);
                return;
            }

            // get params in url (schema)
            var urlParams = {};
            params = params || {};
            url.slice(url.indexOf('?') + 1).split('&').forEach(function (kv) {
                kv = kv.split('=').map(decodeURIComponent);
                urlParams[kv[0]] = kv[1];

                if (!params.hasOwnProperty(kv[0])) {
                    params[kv[0]] = kv[1];
                }

            });
            // debugger
            // no comppage given or open page in other packages
            if (!urlParams.comppage || urlParams.compid !== __COMPID__) {
                start(url, params, action, direction);
                return;
            }

            // use url instead of compid & comppage
            delete params.compid;
            delete params.comppage;

            // use page to construct relative path
            var pageUrl = location.href.replace(/\/([\w\-]+)\/\1\.html/, function () {
                // urlParams.comppage = urlParams.comppage.replace('_', '-');
                return ['/', '/', '.html'].join(urlParams.comppage);
            });

            start(formatUrl('bainuo://component', {
                url: pageUrl
            }), params, action, direction);
        };

        // 增加打印参数功能
        var addLog = BNJS.statistic.addLog;
        BNJS.statistic.addLog = function (params) {
            addLog(params);
            console.log(params);
        };
    };

    ready(function () {
        devBNJS();
    });
}

/**
 * Empty function
 */
var doNothing = function () {};

/**
 * Get type info description of given target
 *
 * @param {*}
 * @return {string} type info
 */
// var type = Object.prototype.toString.call.bind(Object.prototype.toString);
var type = function (o) {
    return Object.prototype.toString.call(o);
};

/**
 * Open a page (in the same package)
 *
 * @param {string} page, page name
 * @param {params=} params, additional params
 * @param {number} action, 规定在何处打开链接页面。 0 ： 新页面打开；1： 当前页面打开。默认0 。
 */
var openPage = function (page, params, action) {
    if (__DEV__) {
        console.log(params);
    }

    var url = formatUrl('bainuo://component', {
        compid: __COMPID__,
        comppage: page
    });

    ready(function (BNJS) {
        BNJS.page.start(url, params, action || 0);
    });
};

/**
 * Walk an object/array
 *
 * @param {Object} obj, given object/array
 * @param {Function} method, method to call while walking
 */
var forEach = function (obj, method) {
    if (type(obj) === '[object Array]') {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (method.call(this, obj[i], i) === false) {
                break;
            }

        }
        return;
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key) && method.call(this, obj[key], key) === false) {
            return;
        }

    }
};

/**
 * Walk an object/array & transform it into new target
 *
 * @param {Object|Array} obj, given object/array
 * @param {Function} method, transform method to call while walking
 * @return {Object|Array} new transformed object/array
 */
var transform = function (obj, method) {
    if (!obj) {
        return obj;
    }

    var target = new obj.constructor();
    forEach(obj, function (val, key) {
        method(target, val, key);
    });
    return target;
};

var map = function (obj, method) {
    return transform(obj, function (target, val, key) {
        target[key] = method ? method(val, key) : val;
    });
};

var filter = function (obj, method) {
    return transform(obj, function (target, val, key) {
        if (method(val, key)) {
            target[key] = val;
        }

    });
};

var clone = map;

var extend = function (target, addon, alone) {
    target = (alone ? clone(target) : target) || {};
    forEach(addon, function (val, key) {
        target[key] = val;
    });
    return target;
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {Function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {Function} superCtor Constructor function to inherit prototype from.
 */
var inherits = function (ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

/**
 * center an Element (censidered position:absolute/fixed & left: 50% & top: 50%)
 * ajust its margin-left & margin-top here
 *
 * @param {Zepto} element, the element to center
 */
var center = function (element) {
    element.css({
        'margin-left': '-' + (element.width() / 2) + 'px',
        'margin-top': '-' + (element.height() / 2) + 'px'
    });
};

/**
 * If is in given browser
 * https://github.com/g13n/ua.js/blob/master/src/ua.js
 *
 * @param {string} browser, given browser name
 * @return {boolean} if ua matches
 */
var isBrowser = function (browser) {
    var pattern = ({
        UC: /ucbrowser/i,
        QQ: /mqqbrowser/i,
        LieBao: /liebao/i
    })[browser];

    return pattern && pattern.test(navigator.userAgent);
};

/**
 * If is in given system
 * https://github.com/g13n/ua.js/blob/master/src/ua.js
 *
 * @param {string} system, given system name
 * @return {boolean} if ua matches
 */
var isSystem = function (system) {
    var pattern = ({
        Android: /android/i,
        IOS: /(ipad|iphone|ipod)/i
    })[system];

    return pattern && pattern.test(navigator.userAgent);
};

/**
 * Transform a string to protect it depending on given type
 *
 * @param {string} type, given type ('phone', ...)
 * @param {string} str, target string
 * @return {string} transformed string
 */
var protect = function (type, str) {
    if (str === null || str === undefined) {
        return '';
    }

    str = str + '';

    switch (type) {
        case 'phone':
            str = str.slice(0, 3) + '****' + str.slice(-4);
            break;
        default:
    }

    return str;
};

/**
 * Generate formatted text (by variable substitution)
 * 注意：这个不是模板引擎！不要用这个生成HTML代码！
 *
 * @param {string} template, template text ('a${x}c')
 * @param {Object} vars, vatiables ({x:'b'})
 * @return {string} formatted text ('abc')
 */
var format = function (template, vars) {
    return template.replace(/\$\{([^\{\}]*)\}/g, function (_, name) {
        var value = vars[name.trim()];
        return value == null ? '' : value + '';
    });
};

/**
 * Make a string with given length (filled up with 0)
 *
 * @param {string|number} source, source string / number
 * @param {number} len, given length
 * @return {string} result string
 */
var toLen = function (source, len) {
    return (Array.prototype.join.call({
        length: len + 1
    }, '0') + source).slice(-len);
};

/**
 * Format date
 *
 * @param {string} template, template text ('$Y-$M-$d $H:$m:$s')
 * @param {Date|number|string=} date, the given date (use now as default)
 * @return {string} formatted text ('2015-06-24 13:52:31')
 */
var formatDate = function (template, date) {
    if (!date) {
        return '';
    }

    template = template.replace(/\$([a-zA-Z])/g, function (_, key) {
        return '${' + key + '}';
    });
    date = new Date(date);
    return format(template, {
        Y: toLen(date.getFullYear(), 4),
        y: toLen(date.getFullYear(), 2),
        M: toLen(date.getMonth() + 1, 2),
        d: toLen(date.getDate(), 2),
        H: toLen(date.getHours(), 2),
        m: toLen(date.getMinutes(), 2),
        s: toLen(date.getSeconds(), 2)
    });
};

/**
 * If any member of given list exists in target array
 *
 * @param {Array} target, target array
 * @param {Array} list, given list
 * @return {boolean} If any member of given list exists in target array
 */
var hasAny = function (target, list) {
    for (var i = 0, l = list.length; i < l; i++) {
        if (target.indexOf(list[i]) >= 0) {
            return true;
        }

    }
    return false;
};

/**
 * Make method result-cachable
 *
 * @param {Function} getter, given method
 * @return {Function} cachable method
 */
var cachable = function (getter) {
    var storage = {};

    var get = function (key, refresh) {
        storage[key] = (refresh || !(storage.hasOwnProperty(key))) ? getter(key, refresh) : storage[key];
        return storage[key];
    };

    var clear = function () {
        storage = {};
    };

    return extend(get, {
        clear: clear
    });
};

/**
 * make the array items unique
 * @param  {Array} arr array
 * @return {Array}     new unique item array
 */
var unique = function (arr) {

    if (type(arr) !== '[object Array]' || arr.length === 0) {
        return arr;
    }

    var o = {};
    var r = [];

    arr.forEach(function (v) {
        if (!o[v]) {
            r.push(v);
            o[v] = 1;
        }

    });

    o = null;

    return r;
};

var featureTest = function (property, value) {
    var prop = property + ':';
    var style = document.createElement('div').style;
    style.cssText = prop + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + prop) + value + ';';
    return !!style[property];
};

/**
 * 数字字母隔指定长度就添加一个空格
 * @param {string} str   数字字母字符串
 * @param {number} number 指定的长度
 */
var addSpace = function (str, number) {
    if (typeof str !== 'string' || !str) {
        return;
    }

    var reg = new RegExp('[a-zA-Z0-9]{' + number + '}', 'ig');

    return str.replace(reg, function (a) {
        return a + ' ';
    });
};

// 重排
var reflow = function ($ele, options) {
    options = options || {};
    $ele.hide();
    setTimeout(function () {
        $ele.show();
    }, options.interval || 500);
};

module.exports = {
    unique: unique,
    doNothing: doNothing,
    type: type,
    forEach: forEach,
    transform: transform,
    map: map,
    filter: filter,
    clone: clone,
    extend: extend,
    inherits: inherits,
    center: center,
    isBrowser: isBrowser,
    isSystem: isSystem,
    protect: protect,
    format: format,
    openPage: openPage,
    formatUrl: formatUrl,
    toLen: toLen,
    formatDate: formatDate,
    hasAny: hasAny,
    ready: ready,
    cachable: cachable,
    featureTest: featureTest,
    addSpace: addSpace,
    reflow: reflow
};
/* eslint-disable */