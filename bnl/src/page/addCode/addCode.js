/**
* @file 介绍当前文件的说明 
* @author name<yuchangshuang@baidu.com> 
*/
/* eslint-disable */
require('widget/radio/radio.css');
require('widget/ratchet/ratchet.less');
require('widget/dialog/dialog.css');
require('./addCode.less');
var $ = require('dep/zepto');
require('dep/artTemplate');
var api = require('../../config/api');
var util = require('widget/util/util');
var utilBNJS = require('widget/util/bnjs/util-bnjs');
var httpBnjs = require('widget/http/httpBnjs');
var Promise = require('widget/util/es6-promise.js').Promise;
var dialog = require('widget/dialog/dialog.js');
var radiogroup = require('widget/radio/radio.js').RadioGroup;

// var urlParam = require('template-naserver:widget/common/urlParam.js');

var init = function () {
    // 原先是从url传过来的
    var curUid = "";
    let b_uid = typeof (BNJS.account.uid) === "number" ? BNJS.account.uid : 0;
    var dealIdText;
    var merchantIdText;
    var addCodeBtn;
    var curProduct = 1;
    var radioObj;
    var merchantItem;
    var isAjaxLocked = false;
    var checkCode = function (uid, deal_id, merchantId, product) {
        var naProduct;
        if (product == 3 && deal_id == '') {
            $.dialog({
                showTitle: false,
                contentHtml: '您录入的为到店付团单，请录入门店ID！',
                buttonClass: {
                    ok: 'dialog-font-color-pink'
                }
            });
            return;
        }
        var param = {
            uid: uid,
            deal_id: deal_id,
            merchart_id: merchantId,
            product: product
        };
        if (!isAjaxLocked) {
            isAjaxLocked = true;
            // $.ajax({
            //     url : '/naserver/user/productcode',
            //     type : 'POST',
            //     dataType : 'json',
            //     data : param,
            //     success : function(data){
            //         isAjaxLocked = false;
            //         /* var data = {
            //             errno : '0',
            //             msg : 'success',
            //             data : {
            //                 deal_url : 'http://t10sc.nuomi.com/wap/goods/detail?tiny_url=2ooa91gm&from=bainuolian&bnl_token=840288822&city_id=100010000&merchant_id=9899408&merchant_name=%E5%B0%8F%E7%B1%B3%E9%B8%A1%E6%8E%92',
            //                 dimension_info : 'bainuo://component?compid=t10pay&comppage=order&tiny_url=2ooa91gm&from=bainuolian&bnl_token=840288822&city_id=100010000&merchant_id=9899408&merchant_name=%E5%B0%8F%E7%B1%B3%E9%B8%A1%E6%8E%92',
            //                 deal_name : '悦庭人人海鲜到店付',
            //                 deal_price : '¥85'
            //             }
            //         };*/
            //         if(param.product == 1){//普通团单
            //             naProduct = 0;
            //         }
            //         if(param.product == 3){//到店付
            //             naProduct = 1;
            //         }
            //         if(param.product == 2){//储值卡
            //             naProduct = 4;
            //         }
            //         if(data.errno == 0){
            //             var url;
            //             var deal_name = data.data.deal_name;
            //             if(param.merchart_id == ''){
            //                 url = 'band://web?type=materials_binding&deal_id='+param.deal_id+'&deal_name='+deal_name+'&deal_statu=在线'+'&product='+naProduct;
            //             }else{
            //                 url = 'band://web?type=materials_binding&deal_id='+param.deal_id+'&deal_name='+deal_name+'&deal_statu=在线&merchant_id='+param.merchart_id+'&product='+naProduct;
            //             }
            //             // console.log(url);
            //             window.location.href = url;
            //         }else{
            //             $.dialog({
            //                 showTitle : false,
            //                 contentHtml : data.msg,
            //                 buttonClass : {
            //                     ok : 'dialog-font-color-pink'
            //                 }
            //             });
            //             return;
            //         }
            //     }
            // });
        }
    }
    var getDom = function () {
        dealIdText = $('.deal-id-text');
        merchantIdText = $('.merchant-id-text');
        addCodeBtn = $('.add-code-btn');
        merchantItem = $('.merchant-item');
    }
    var bind = function () {
        addCodeBtn.on('click', function () {
            var curDealId = dealIdText.val();
            var curMerchantId = merchantIdText.val();
            //uid,sign,deal_id,merchant_id,product
            checkCode(curUid, curDealId, curMerchantId, curProduct);
        });
        radioObj.on('valuechange', function () {
            curProduct = radioObj.getValue();
            if (radioObj.getValue() == 3) {//到店付
                merchantItem.show();
            } else {
                merchantIdText.val('');
                merchantItem.hide();
            }
        });
    }
    var initPlugins = function () {
        radioObj = new radiogroup({
            container: $('.content')[0],
            classname: 'regular-radio'
        });
    }
    initPlugins();
    getDom();
    bind();
}
uitl.ready(function () {
    init();
})
/* eslint-disable */