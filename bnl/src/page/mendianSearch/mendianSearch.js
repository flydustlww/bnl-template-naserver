/**
 * @file Describe the file
 * @author name<yuchangshuang@baidu.com>
 */

import style from './mendianSearch.less';
import Vue from 'vue';
// import 'DeferredBNJS'
import DeferredBNJS from 'DeferredBNJS';
import mendianSearch from 'components/search';

let dealIdText;
let addCodeBtn;
let curProduct = 1;
let isAjaxLocked = false;
// uid int 840288822   用户uid
// sign    string  8280C3B14E95B2563687631DFABB31BA    签名

let vm = new Vue({
    el: '#app',
    render(h) {
        return h(mendianSearch);
    }
});

/* eslint-disable */
