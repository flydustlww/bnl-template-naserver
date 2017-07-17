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
let util = require('widget/util/util');
let $ = require('dep/zepto');
let mScreen = require('widget/mscreen/mscreen');
require('dep/zeptoLib/touch.js');
require('dep/swipe/swiper-3.4.2.jquery.min.js');


let slider = document.getElementById('slider');
let pointer = document.getElementsByTagName('ul')[0];
let $enterLm = $('#enterLm');

/* eslint-disable */
BNJSReady(() => {
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('百度糯米商户联盟');
    mScreen(750, 1205);
    let mySwiper = new Swiper('.swiper-container', {
        loop: true
    });
    
    $enterLm.on('tap', function() {
        window.location.href = 'guide.html';
    });
});
/* eslint-disable */
