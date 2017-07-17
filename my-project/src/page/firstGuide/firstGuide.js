/**
 * @file firstGuide 引导页面
 * @author name<yuchangshuang@baidu.com>
 */

require('dep/reset/reset.less');
require('dep/swipe/swiper-3.4.2.min.css');

import style from './firstGuide.less';
import Vue from 'vue';
import 'DeferredBNJS';

let api = require('../../config/api');
let utilBNJS = require('widget/util/bnjs/util-bnjs');
let util = require('widget/util/util');
let $ = require('dep/zepto');
let mscreen = require('widget/mscreen/mscreen');
require('dep/zeptoLib/touch.js');
require('dep/swipe/swiper-3.4.2.jquery.min.js');


let slider = document.getElementById('slider');
let pointer = document.getElementsByTagName('ul')[0];
let $enterLm = $('#enterLm');

BNJSReady(() => {
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('百度糯米商户联盟');
    mscreen(750, 1205);
    let mySwiper = new Swiper('.swiper-container', {
        loop: true
    });
    
    $enterLm.on('tap', function() {
        window.location.href = 'guide.html';
    })

});
