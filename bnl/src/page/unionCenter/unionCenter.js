/**
 * @file UniconCenter 联盟中心页面
 * @author name<yuchangshuang@baidu.com>
 */

import Vue from 'vue';
import DeferredBNJS from 'DeferredBNJS';
import unionCenter from 'components/unionCenter';

// sign    string  8280C3B14E95B2563687631DFABB31BA    签名

let vm = new Vue({
    el: '#app',
    render(h) {
        return h(unionCenter);
    }
});
/* eslint-disable */
BNJSReady(() => {
    BNJS.ui.hideLoadingPage();
    /* 注册广播接收器 */
    BNJS.page.registerReceiver('com.nuomi.merchant.broadcast.PERSONALPROFILE', function (res) {
        BNJS.ui.toast.show('个人信息页');
        BNJS.page.start('baidunuomimerchant://component?url=compid=bnl&comppage=userMessage', {}, 1);
    });
});
/* eslint-disable */
