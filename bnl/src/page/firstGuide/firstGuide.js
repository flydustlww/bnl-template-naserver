/**
 * @file firstGuide 引导页面
 * @author name<yuchangshuang@baidu.com>
 */
import Vue from 'vue';
require('widget/global/global.less');
require('dep/swipe/swiper-3.4.2.min.css');
require('./firstGuide.less');
let $ = require('dep/zepto');
let util = require('widget/util/util.js');
let utilBNJS = require('widget/util/bnjs/util-bnjs.js');
require('dep/zeptoLib/touch.js');
require('dep/swipe/swiper-3.4.2.jquery.min.js');
let mScreen = require('widget/mscreen/mscreen');

let $enterLm = $('#enterLm');

let init = {
    initAll() {
        mScreen(750, 1205);
        // this.store();
        this.initEvent();
        let mySwiper = new Swiper('.swiper-container', {
            loop: true
        });
    },
    initEvent() {
        $enterLm.on('tap', function () {
            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=login", {}, 1);
        });
    },
    store() {
        let flag = 1;
        let storeFlag = utilBNJS.storage.getItem("flag");
        if (storeFlag) {
            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=login", {}, 1);
        } else {
            utilBNJS.storage.setItem("flag", flag);
        }
    }
}



/* eslint-disable */
util.ready(function() {
    init.initAll();
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('百度糯米商户联盟');
})
/* eslint-disable */
