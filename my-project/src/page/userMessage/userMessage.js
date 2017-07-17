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
require('dep/zeptoLib/touch.js');
require('dep/swipe/swiper-3.4.2.jquery.min.js');


BNJSReady(() => {
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('个人信息页');

});
