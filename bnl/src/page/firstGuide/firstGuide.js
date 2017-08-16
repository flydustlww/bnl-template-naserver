/**
 * @file firstGuide 引导页面
 * @author name<yuchangshuang@baidu.com>
 */
/* eslint-disable */
import Vue from 'vue';
require('widget/global/global.less');
require('dep/swipe/swiper-3.4.2.min.css');
require('./firstGuide.less');
let $ = require('dep/zepto');
let util = require('widget/util/util.js');

require('dep/zeptoLib/touch.js');
require('dep/swipe/swiper-3.4.2.jquery.min.js');
let mScreen = require('widget/mscreen/mscreen');
let FastClick  = require('dep/fastclick/index.js');
let $enterLm = $('#enterLm');
let server = require('../../config/server').server;
let LOGIN_URL = encodeURIComponent(server + '/naserver/newapp/merchantlogintpl');
let init = {
    initAll() {
        mScreen(750, 1205);
        this.store();
        this.initEvent();
    },
    initEvent() {
        $enterLm.on('click', function () {
            var url = 'BaiduNuomiMerchant://component?compid=bnl&comppage=guide';
            BNJS.page.start(url,{},1)
        });
    },
    store() {
        let url = 'BaiduNuomiMerchant://component?url=' + LOGIN_URL;
        // IOS getItem为空值室也会走失败逻辑,因此在取到空值时需要在失败逻辑中setItem
        BNJS.localStorage.getItem('bnl_flag', function(res){
            // 是否展示过轮播图
            if (res.data == "") {
               // 新用户则
               BNJS.localStorage.setItem('bnl_flag', 'ok', function () {

                    let mySwiper = new Swiper('.swiper-container', {
                        loop: true
                    });
               });
                
            } 
            else{
                BNJS.page.start('BaiduNuomiMerchant://component?compid=bnl&comppage=unionCenter',{},1);
            }
                    
        }, function(res){

             // add for bug 1581
             BNJS.localStorage.setItem('bnl_flag', 'ok', function() {
                // 轮播
                let mySwiper = new Swiper('.swiper-container', {
                    loop: true
                });

             });
           
        }, '2.7');

    }
}
    
util.ready(function() {
    FastClick.attach(document.body);
    init.initAll();
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('百度糯米商户联盟');
    BNJS.ui.title.removeBtnAll();
})
/* eslint-disable */
