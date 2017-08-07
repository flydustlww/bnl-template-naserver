/**
 * @file Describe the file
 * @author name<yuchangshuang@baidu.com>
 */

import style from './mendianSearch.less';
import Vue from 'vue';
// import 'DeferredBNJS'
import DeferredBNJS from 'DeferredBNJS';
import mendianSearch from 'components/search';
let util = require('widget/util/util');
let dealIdText;
let addCodeBtn;
let curProduct = 1;
let isAjaxLocked = false;

let vm = new Vue({
    el: '#app',
    render(h) {
        return h(mendianSearch);
    }
});

/* eslint-disable */
util.ready(function () {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('门店查询');
    BNJS.ui.title.addActionButton({
        tag: '1',
        text: '帮助',
        callback: function () {
            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=help", {});
        }
    });
});

/* eslint-disable */
