/**
 * @file guide 引导页面
 * @author name<liuboying@baidu.com>
 */
require('./guide.less');
var $ = require('dep/zepto');
// 确保组件页面能够正常使用BNJS方法，避免造成一些奇怪的错误发生
var BNJSReady = function (readyCallback) {
    if (readyCallback && typeof readyCallback =='function') {
        if (window.BNJS && typeof window.BNJS =='object' && BNJS._isAllReady) {
            readyCallback();

        }else {
            document.addEventListener('BNJSReady', function () {
                readyCallback();
            }, false);
        }

    }

};

var guide = function () {
    var me = this;

    BNJSReady(function () {
    	// 设置标题s
    	me.setTitle();
    	// 绑定操作
    	me.bindEvents();
    })
    

};

guide.prototype.setTitle = function() {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('百度糯米商户联盟');
};

guide.prototype.bindEvents = function() {
    var me = this;
    // 打开登录页
    $('.right').on('touchend', function (e) {
        // 打开登录页
        var url = 'BaiduNuomiMerchant://component?url=http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/merchantloginguidetpl';
        BNJS.page.start(url,{},1);
    });

};


new guide();