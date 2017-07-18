/**
 * @file firstGuide 引导页面
 * @author name<yuchangshuang@baidu.com>
 */
import Vue from 'vue';
import 'DeferredBNJS';

require('dep/reset/reset.less');
require('dep/swipe/swiper-3.4.2.min.css');
require('./firstGuide.less');
let api = require('../../config/api');
let utilBNJS = require('widget/util/bnjs/util-bnjs');
let $ = require('dep/zepto');
let mScreen = require('widget/mscreen/mscreen');
require('dep/zeptoLib/touch.js');
require('dep/swipe/swiper-3.4.2.jquery.min.js');

let $enterLm = $('#enterLm');

let init = {
    initAll: function () {
        mScreen(750, 1205);
        // this.store();
        this.initEvent();
        let mySwiper = new Swiper('.swiper-container', {
            loop: true
        });
    },
    initEvent: function () {
        $enterLm.on('tap', function () {
            window.location.href = 'guide.html';
        });
    },
    store: function () {
        let flag = 1;
        let storeFlag = localStorage.getItem("flag");
        if (storeFlag) {
            window.location.href = 'guide.html';
        } else {
            localStorage.setItem("flag", flag);
        }
    }
}

init.initAll();

/* eslint-disable */
BNJSReady(() => {
    BNJS.ui.hideLoadingPage();
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('百度糯米商户联盟');
});
/* eslint-disable */
