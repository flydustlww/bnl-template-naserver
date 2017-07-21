/**
 * @file firstGuide 引导页面
 * @author name<yuchangshuang@baidu.com>
 */
import Vue from 'vue';
import 'DeferredBNJS';

require('widget/global/global.less');
require('./help.less');
let api = require('../../config/api');
let utilBNJS = require('widget/util/bnjs/util-bnjs');
let $ = require('dep/zepto');

let init = {
    initAll() {
        this.initEvent();
    },
    initEvent() {
    }
};

init.initAll();

/* eslint-disable */
BNJSReady(() => {
    BNJS.ui.hideLoadingPage();
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('百度糯米商户联盟');
});
/* eslint-disable */
