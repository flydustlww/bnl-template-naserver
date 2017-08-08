/**
 * @file UniconCenter 联盟中心页面
 * @author name<yuchangshuang@baidu.com>
 */

import Vue from 'vue';
import unionCenter from 'components/unionCenter';
let util = require('widget/util/util');
// sign    string  8280C3B14E95B2563687631DFABB31BA    签名

let vm = new Vue({
    el: '#app',
    render(h) {
        return h(unionCenter);
    }
});
/* eslint-disable */
util.ready(function() {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('百度糯米商户联盟');
    BNJS.ui.title.addActionButton({
        tag: '1',
        text: '帮助',
        callback: function () {
            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=help", {});
        }
    });
    /* 注册广播接收器 */
    BNJS.page.registerReceiver('com.nuomi.merchant.broadcast.PERSONALPROFILE', function (res) {
        BNJS.page.start('baidunuomimerchant://component?compid=bnl&comppage=userCenter', {}, 1);
    });
});
/* eslint-disable */
