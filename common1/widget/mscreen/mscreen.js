/**
 * @file 整屏方案
 * @Author   yuchangshuang@baidu.com
 * @DateTime 2016-11-23T16:14:19+0800
 * @param    {[number]}                 options.W   [设计图宽]    [必选]
 * @param    {[number]}                 options.H   [设计图高]    [必选]
 * @param    {[object]}                 options.obj   [包裹元素]  [可选]
 * @param    {[string]}                 options.topH   [包裹元素距离顶部距离，缺省默认上下居中] [可选]
 */
var doc = window.document;
var docEl = doc.documentElement;
var newW = 0;
var newH = 0;
var tid = null;
var that;
var newClient = function (opts) {
    var clientW = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth; // 兼容小米note3
    var clientH = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
    var percentDesign = opts.W / opts.H;
    var percentClient = clientW / clientH;
    // 如果是宽度不够，左右居中
    if (percentDesign < percentClient) {
        newW = percentDesign * clientH;
        newH = clientH;
        document.documentElement.style.fontSize = newW + 'px';
    }
    else {
        newW = clientW;
        newH = clientW / percentDesign;
        document.documentElement.style.fontSize = clientW + 'px';
    }

    if (opts.obj) {
        opts.obj.style.width = newW + 'px';
        opts.obj.style.height = newH + 'px';
        opts.obj.style.position = 'absolute';
        opts.obj.style.left = '50%';

        if (opts.topH != '50%') {
            opts.obj.style.top = opts.topH;
            opts.obj.style.transform = 'translate3d(-50%, 0, 0)';
            opts.obj.style.webkitTransform = 'translate3d(-50%, 0, 0)';
        }
        else {
            opts.obj.style.top = '50%';
            opts.obj.style.transform = 'translate3d(-50%, -50%, 0)';
            opts.obj.style.webkitTransform = 'translate3d(-50%, -50%, 0)';
        }
    }

    if (clientW >= 414) {
        docEl.setAttribute('data-fontscale', 2);
    }
    else {
        docEl.setAttribute('data-fontscale', 1);
    }
};

module.exports = function (options) {
    var opts = options || {};
    opts.W = options.W === undefined ? 640 : Number(options.W);
    opts.H = options.H === undefined ? 960 : Number(options.H);
    opts.obj = options.obj || null;
    opts.topH = options.topH || '50%';
    opts.cancelResize = options.cancelResize || false;
    if (!opts.cancelResize) {
        window.addEventListener('resize', function () {
            clearTimeout(tid);
            tid = setTimeout(function () {
                newClient(opts);
            }, 300);
        }, false);
    }

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(function () {
                newClient(opts);
            }, 300);
        }

    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = '12px';
    }
    else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = '12px';
        }, false);
    }

    newClient(opts);
    return;

};
