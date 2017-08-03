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

let vm = new Vue({
    el: '#app',
    render(h) {
        return h(mendianSearch);
    }
});

/* eslint-disable */
