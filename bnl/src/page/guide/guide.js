/**
 * @file guide 引导页面
 * @author name<liuboying@baidu.com>
 */
require('./guide.less');
var utilBNJS = require('widget/util/bnjs/util-bnjs.js');

var guide = function () {

    utilBNJS.ready(function () {
    	// 设置标题
    	this.setTitle();
    	// 绑定操作
    	this.bindEvents();
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