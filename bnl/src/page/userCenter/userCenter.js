/**
 * @file Describe the file
 * @author name<yuchangshuang@baidu.com>
 */
/* eslint-disable */
import Vue from 'vue';
let $ = require('dep/zepto');
require('dep/zeptoLib/touch.js');
let api = require('../../config/api');
let util = require('widget/util/util');

// 为了兼容该死的华为荣誉6
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');
require('widget/global/global.less');
require('./userCenter.less');

// 初始化页面级的Vue实例
let vm = new Vue({
    el: '#app',
    template: require('./userCenter.tpl'),
    data: {
        token: "",
        passport_username: "--",
        real_name: "--",
        mobile: "--",
        certificate_no: "--",
        city_name: "--",
        is_verified: 0,
        alliance_name: "--"
    },
    created: function () {
        var _this = this;
        util.ready(function(BNJS) {
            _this.getData(BNJS);
        })
    },
    watch: function () {
    },
    methods: {
        getData: function () {
            let that = this;
            let uid = BNJS.account.uid || "";
            let pN = new Promise(function (resolve, reject) {
                $.ajax({
                    url: api.gettoken,
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        that.token = res.data;
                        resolve();
                    },
                    error: function (res) {
                        console.log(res);
                        reject(res);
                    }
                });
            }).then(resp => httpAjax(api.myuserinfo, {
                access_token: that.token,
                b_uid: uid
            })).catch(function(res) {
                BNJS.ui.showErrorPage("拼命加载中"); 
            }).then(res => {
                if (res.errno === 0) {
                    that.passport_username = res.data.passport_username ? res.data.passport_username : "--";
                    that.real_name = res.data.real_name ? res.data.real_name : "--";
                    that.mobile = res.data.mobile ? res.data.mobile : "--";
                    that.certificate_no = res.data.certificate_no ? res.data.certificate_no : "--";
                    that.city_name = res.data.city_name ? res.data.city_name : "--";
                    that.alliance_name = res.data.alliance_name ? res.data.alliance_name : "--";
                    that.is_verified = res.data.is_verified;
                    if (that.is_verified === 0) {
                        $('.user-verified').on('tap', function () {
                            window.location.href = "https://m.baifubao.com/wap/0/wallet/0/cardlist/0";        
                        })        
                    }
                } else if (res.errno === 2002) {
                    window.location.href = "login.html";
                } else {
                    BNJS.ui.showErrorPage("拼命加载中");
                }
            }).catch(function() {
                BNJS.ui.showErrorPage("拼命加载中");
            })

            function httpAjax(url, data) {
                var p = new Promise(function (resolve, reject) {
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: "json",
                        data: {
                            b_uid: data.b_uid,
                            access_token: data.access_token
                        },
                        success: function (resp) {
                            resolve(resp);
                        },
                        error: function (resp) {
                            reject(resp);
                        }
                    });
                });
                return p;
            }
        },
        loginClick: function() {
             $.dialog({
                type: 'confirm',
                showTitle: false,
                dialogClass: 'addUnion',
                contentHtml: "您真的想要退出登录嘛！",
                buttonText: {
                    ok: '重新登录',
                    cancel: '稍后再说'
                },
                buttonClass: {
                    ok: 'dialog-font-color-blue',
                    cancel: 'dialog-btn-cancel'
                },
                onClickOk: function () {
                    window.location.href = "login.html";
                },
                onClickCancel: function () {
                }
            });             
        }      
    },
    components: {
    }
});

util.ready(function(BNJS) {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('个人中心');
})
/* eslint-disable */