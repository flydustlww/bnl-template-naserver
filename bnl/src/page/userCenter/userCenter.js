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
let utilBNJS = require('widget/util/bnjs/util-bnjs.js');
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');
let httpBnjs = require('widget/http/httpBnjs');
let server = require('../../config/server').server;
let LOGIN_URL = encodeURIComponent(server + '/naserver/newapp/merchantlogintpl');
require('widget/global/global.less');
require('./userCenter.less');
require('widget/retina/1px.less');
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
        util.ready(function() {
           _this.getData();
        });
    },
    watch: function () {
    },
    methods: {
        getData: function () {
            let that = this;
            let uid = BNJS.account.uid || 0;
            httpBnjs.get({
                url: api.myuserinfo,
                params: {
                    b_uid: uid                  
                }
            })
            .then(function(res) {
                that.userInfoOk(res);
            }, function(res) {
                BNJS.ui.showErrorPage();
            });                
        },
        userInfoOk: function(res) {
            let that = this;
            switch (res.errno) 
            {
                case 0:
                {
                    that.passport_username = res.data.passport_username ? res.data.passport_username : "--";
                    that.real_name = res.data.real_name ? res.data.real_name : "--";
                    that.mobile = res.data.mobile ? res.data.mobile : "--";
                    that.certificate_no = res.data.certificate_no ? res.data.certificate_no : "--";
                    that.city_name = res.data.city_name ? res.data.city_name : "--";
                    that.alliance_name = res.data.alliance_name ? res.data.alliance_name : "--";
                    that.is_verified = res.data.is_verified;
                    if (that.is_verified === 0) {
                        $('.user-verified').on('tap', function () {
                            let url = encodeURIComponent("https://m.baifubao.com/wap/0/wallet/0/cardlist/0");
                            BNJS.page.start("BaiduNuomiMerchant://component?url=" + url, {});       
                        })        
                    }
                    break;                   
                }
                case 2002:
                    var url = 'BaiduNuomiMerchant://component?url=' + LOGIN_URL;
                    BNJS.page.start(url, {}, 1); 
                    break;
                default:
                    BNJS.ui.showErrorPage();
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
                    var url = 'BaiduNuomiMerchant://component?url=' + LOGIN_URL;
                    BNJS.localStorage.setItem('bnl_bduss', 'invalid', function () {
                        BNJS.page.start(url, {}); 
                    }, function (res) {
                        BNJS.ui.toast.show(JSON.stringify(res));
                    });
                },
                onClickCancel: function () {
                }
            });             
        }      
    },
    components: {
    }
});

util.ready(function() {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('个人资料');
    BNJS.page.reShow(function () {
        BNJS.page.start('BaiduNuomiMerchant://component?compid=bnl&comppage=userCenter',{});
    });
    
})
/* eslint-disable */