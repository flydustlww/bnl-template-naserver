/**
 * @file firstGuide 引导页面
 * @author name<yuchangshuang@baidu.com>
 */
require('widget/global/global.less');
require('./help.less');
let utilBNJS = require('widget/util/bnjs/util-bnjs');
let $ = require('dep/zepto');
let util = require('widget/util/util.js');

/* eslint-disable */
util.ready(function() {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('百度糯米商户联盟');
})
/* eslint-disable */
