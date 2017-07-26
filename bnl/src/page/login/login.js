/**
 * @file 登录页
 * @author liuboying <liuboying@baidu.com>
 * @date 2016-08-30
 */

require('./login.less');
var $ = require('dep/zepto');
var smsLogin = require('./smsLogin.js');
var urlParam = require('static/js/urlParam');
var util = require('widget/util/util');

var login = function () {
    // 帮助页
    this.help = 'page/help.html';
    // 登录操作
    this.smsLogin();
    // 绑定操作
    this.bindEvents();

};

login.prototype.smsLogin = function () {
    smsLogin({
        success: function (bdusign) {
            // pass登录成功后cb
            //window.location.href = location.origin + 'page/unionCenter.html';
        }
    }, urlParam.getUrlParam('rdtest') == 1);
}

login.prototype.bindEvents = function () {
    $('.footer').on('click', function() {
        var jumpUrl = encodeURIComponent(location.origin + 'page/unionCenter.html');
        window.location.href = 'http://wappass.baidu.com?tpl=nuomi&u=' + jumpUrl;
    })
}
new login();