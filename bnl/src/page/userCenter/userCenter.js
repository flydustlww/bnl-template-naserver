/**
 * @file Describe the file
 * @author name<yuchangshuang@baidu.com>
 */
/* eslint-disable */
import Vue from 'vue';
// import 'DeferredBNJS'
import DeferredBNJS from 'DeferredBNJS';
let $ = require('dep/zepto');
let api = require('../../config/api');
// let utilBNJS = require('common/util/bnjs/util-bnjs');
let util = require('widget/util/util');

// 为了兼容该死的华为荣誉6
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');
require('widget/global/global.less');
require('./userCenter.less');

// 初始化页面级的Vue实例
let vm = new Vue({
    el: '#app',
    data: {
        passport_username: "",
        real_name: "",
        mobile: "",
        certificate_no: "",
        city_name: "",
        is_verified: 0
    },
    created: function () {
        this.getData();
    },
    watch: function () {
    },
    methods: {
        getData: function () {
            let that = this;
            $.ajax({
                url: api.myaccount,
                type: 'GET',
                dataType: 'json',
                data: '',
                success: function(res){
                    if (res.errno == 0) {
                        that.passport_username = res.data.passport_username;
                        that.real_name = res.data.real_name;
                        that.mobile = res.data.mobile;
                        that.certificate_no = res.data.certificate_no;
                        that.city_name = res.data.city_name;
                        that.is_verified = res.data.is_verified;
                        console.log(that.data);
                    }
                },
                error: function(res){
                    $.dialog({
                        showTitle : false,
                        contentHtml : res.msg||'出错了!',
                        buttonClass : {
                            ok : 'dialog-font-color-blue'
                        }
                    });                    
                }
            })
        }         
    },
    components: {
    },
    ready() {}
});

BNJSReady(() => {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('我的物料');
});
/* eslint-disable */