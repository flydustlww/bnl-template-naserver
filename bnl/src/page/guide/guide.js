/**
 * @file guide 引导页面
 * @author name<liuboying@baidu.com>
 */
/* eslint-disable */
require('./guide.less');
var $ = require('dep/zepto');
var server = require('../../config/server').server;
var LOGIN_URL = encodeURIComponent(server + '/naserver/newapp/merchantloginguidetpl');
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
    BNJS.ui.title.setTitle('加入联盟');
    BNJS.ui.title.removeBtnAll();
};

guide.prototype.bindEvents = function() {
    var me = this;
    // 打开登录页
    $('.right').on('touchend', function (e) {
        // 打开登录页
        var url = 'BaiduNuomiMerchant://component?url=' + LOGIN_URL;
        BNJS.page.start(url,{},1);
    });

};


new guide();
/* eslint-disable */