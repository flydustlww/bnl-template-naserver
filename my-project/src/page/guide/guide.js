import style from './guide.less';

import Vue from 'vue';
import 'DeferredBNJS';
var api = require('../../config/api');
var utilBNJS = require('widget/util/bnjs/util-bnjs');
var util = require('widget/util/util');
var $ = require('dep/zepto');

/* eslint-disable */
BNJSReady(() => {
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('lby测试BNJS');

    /* 注册广播接收器 */
    BNJS.page.registerReceiver('com.nuomi.merchant.broadcast.LOGIN', function (res) {
        BNJS.ui.toast.show('PAGE_REFRESH接收器注册成功！');
        BNJS.page.start('baidunuomimerchant://component?url=compid=bnl&comppage=login', {}, 1);
    });

});
/* eslint-disable */
