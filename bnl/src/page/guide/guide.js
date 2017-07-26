/**
 * @file 引导登录页
 * @author liuboying <liuboying@baidu.com>
 * @date 2016-08-30
 */

/* eslint-disable */
require('./guide.less');
var $ = require('dep/zepto');
var smsLogin = require('./smsLogin.js');
var urlParam = require('static/js/urlParam');
var util = require('widget/util/util');

var login = function () {
    // 登录提示页
    this.pageOne = $('#first-page');
    // 登录页
    this.pageTwo = $('#second-page');
    // 帮助页
    this.help = 'page/help.html';
    // BNJS操作
    this.BnjsOperation();
    // 绑定操作
    this.bindEvents();

};

login.prototype.bindEvents = function () {
    var me = this;
    // 打开登录页
    $('.right').on('touchend', function (e) {
        // 登录提示页隐藏
        me.pageTwo.show();
        // 登录页展示
        me.pageOne.hide();
        // 登录成功回调
        me.smsLogin();

    })
};

login.prototype.BnjsOperation = function () {
    var me = this;

    util.ready(function (argument) {
        console.log('BNJSReady');
        //
        BNJS.ui.title.addActionButton({
            tag: '1',
            text: '帮助',
            callback: function () {
                window.location.href = me.help;
            }

        });

        // 注册广播接收器
        BNJS.page.registerReceiver('com.nuomi.merchant.broadcast.LOGIN', function (res) {
           BNJS.page.start('baidunuomimerchant://component?url=compid=bnl&comppage=login', {}, 1);
        });
    })
};

login.prototype.smsLogin = function () {
    smsLogin({
        success: function (bdusign) {
            // pass登录成功后cb
            //window.location.href = location.origin + 'page/unionCenter.html';
        }
    }, urlParam.getUrlParam('rdtest') == 1);
}

new login();

/* eslint-disable */
