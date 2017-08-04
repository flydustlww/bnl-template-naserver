/**
 * @file 物料详情页面
 * @author name<yuchangshuang@baidu.com>
 */
/* eslint-disable */
import Vue from 'vue';
require('widget/ratchet/ratchet.less');
require('widget/dialog/dialog.css');
require('./cardList.less');
let $ = require('dep/zepto');
let api = require('../../config/api');
let util = require('widget/util/util');
let utilBNJS = require('common/util/bnjs/util-bnjs');
let httpBnjs = require('widget/http/httpBnjs');
let urlParam = require('static/js/urlParam');
require('dep/artTemplate');
let dialog = require('widget/dialog/dialog.js');
let radiogroup = require('widget/radio/radio.js').RadioGroup;

// let curUid = 840288822,
//     curSign="8280C3B14E95B2563687631DFABB31BA",
//     curSid="840288822_201605",
//     app_version = "5.3.1",
//     bainuo_loaction = "116.280705,40.048766";
// 提测
let curUid = urlParam.getUrlParam('uid');
let curSid = urlParam.getUrlParam('sid');
let app_version = urlParam.getUrlParam('app_version');
let id = urlParam.getUrlParam('id');
let location = urlParam.getUrlParam('location');
let unbindDialogHtml = '<p >确认解除物料与您的绑定关系？解绑后，将无法获得推广佣金！</p>';
let bindDialogHtml = '<p class="dialog-item"><label>类型：</label><input type="radio" id="radio-1" name="product-radio" class="regular-radio" checked value="0"/><label for="radio-1"></label>普通'
    + '<input type="radio" id="radio-2" name="product-radio" class="regular-radio" value="1"/><label for="radio-2" ></label>到店付'
    + '<input type="radio" id="radio-3" name="product-radio" class="regular-radio" value="4"/><label for="radio-3"></label>储值卡'
    + '<p class="dialog-item"><label>团单ID：</label><input type="number" class="deal-id-text" placeholder="团单ID"></p>'
    + '<p class="dialog-item dialog-merchant-item"><label>门店ID：</label><input type="number" class="merchant-id-text" placeholder="门店ID"></p>';
let isAjaxLocked = false;
let totalDom;
let codeListDom;
let addCodeBtn;
let radioObj;
let curProduct;
let curId;
let getCodeList = function (uid, sid, app_version, location, id) {
    let param = {
        uid: uid,
        sid: sid,
        app_version: app_version,
        location: location,
        id: id
    };
    // 请求成功就处理，如果请求失败，不处理
    if (!isAjaxLocked) {
        isAjaxLocked = true;
        $.ajax({
            url: api.codelist,
            type: 'GET',
            dataType: 'json',
            data: param,
            success: function (data) {
                isAjaxLocked = false;
                if (data.errno != 0) {
                    $.dialog({
                        showTitle: false,
                        contentHtml: data.msg,
                        buttonClass: {
                            ok: 'dialog-font-color-pink'
                        }
                    });
                    return;
                }
                else {
                    if (data.data.count != 0) {
                        $.each(data.data.list, function (i, item) {
                            if (item.deal_info == '') {
                                item.deal_info = '--'; // 团单名称可能为空
                            }

                            if (item.materiel_info == '') {
                                item.materiel_info = '--'; // 团单名称可能为空
                            }

                        });
                        let html = template('codeList-item-tpl', data.data);
                        $(html).prependTo($('#codeList'));
                        $('.loadingmore').show();
                    }
                    else { // 无数据
                        let html = template('none-list-tpl', {});
                        $('#codeList').html(html);
                    }
                }
            }
        });
        httpBnjs.post({
            url: api.unbindcode,
            params: {
                b_uid: uid,                
            }
        })
    }

};
// 解绑
let unbindCode = function (uid, sid, id) {
    let param = {
        uid: uid,
        sid: sid,
        code_id: id
    };
    $.ajax({
        url: '/naserver/common/unbindcode',
        type: 'POST',
        dataType: 'json',
        data: param,
        success: function (data) {
            if (data.errno != 0) {
                let msg = data.msg;
                setTimeout(function (data) {
                    $.dialog({
                        showTitle: false,
                        contentHtml: msg,
                        buttonClass: {
                            ok: 'dialog-font-color-pink'
                        },
                        onClickOk: function () {
                            $('.solve-tap-bug').remove();
                        }
                    });
                }, 200);
                return;
            }
            else {
                window.location.reload();
            }
        }
    });

};
// 重绑 
let bindCode = function (app_version, location, uid, sid, id, deal_id, merchant_id, product) {
    let param = {
        app_version: app_version,
        location: location,
        uid: uid,
        sid: sid,
        code_id: id,
        deal_id: deal_id,
        merchant_id: merchant_id,
        // code_url : code_url,
        product: product
    };
    $.ajax({
        url: api.bindcode,
        type: 'POST',
        dataType: 'json',
        data: param,
        success: function (data) {
            if (data.errno != 0) {
                let msg = data.msg;
                setTimeout(function (data) {
                    $.dialog({
                        showTitle: false,
                        contentHtml: msg,
                        buttonClass: {
                            ok: 'dialog-font-color-pink'
                        },
                        onClickOk: function () {
                            $('.solve-tap-bug').remove();
                        }
                    });
                }, 200);
                return;
            }
            else {
                window.location.reload();
            }
        }
    });
};
// 解绑对话框
let showUnbindDialog = function () {
    $.dialog({
        type: 'confirm',
        showTitle: false,
        contentHtml: unbindDialogHtml,
        buttonClass: {
            ok: 'dialog-font-color-pink',
            cancel: 'dialog-font-color-pink'
        },
        onClickOk: function () {
            unbindCode(curUid, curSid, curId);
        }
    });
};
// 重绑对话框
let showBindDialog = function () {
    $.dialog({
        type: 'confirm',
        titleText: '物料与团单关系重新绑定',
        contentHtml: bindDialogHtml,
        // dialogClass : 'dialog-wrap-top',
        buttonClass: {
            ok: 'dialog-font-color-pink',
            cancel: 'dialog-font-color-pink'
        },
        onClickOk: function () {
            let curDealId = $('.dialog-wrap').find('.deal-id-text').val();
            let curMerchantId = $('.dialog-wrap').find('.merchant-id-text').val();
            // app_version,bainuo_loaction,uid,sign,sid,id,deal_id,merchant_id,code_url,product
            curProduct = radioObj.getValue();
            console.log('bindcode curProduct' + curProduct);
            bindCode(app_version, location, curUid, curSid, curId, curDealId, curMerchantId, curProduct);
        },
        onShow: function () {
            radioObj = new radiogroup({
                container: $('.dialog-wrap')[0],
                classname: 'regular-radio'
            });
            radioObj.on('valuechange', function () {
                if (radioObj.getValue() == 1) { // 到店付
                    $('.dialog-wrap').find('.dialog-merchant-item').show();
                }
                else {
                    $('.dialog-wrap').find('.dialog-merchant-item').find('.merchant-id-text').val('');
                    $('.dialog-wrap').find('.dialog-merchant-item').hide();
                }
            });
        }
    });
};
let getDom = function () {
    totalDom = $('.total-amount ');
    codeListDom = $('#codeList');
    addCodeBtn = $('.add-code-btn');
};
let bind = function () {
    codeListDom.on('click', function (evt) {
        let target = $(evt.target);
        let type = target.attr('type');
        curId = target.attr('itemid');
        if (type == 'unbind') { // 解绑
            showUnbindDialog();
        }

        if (type == 'bind') { // 绑定
            showBindDialog();
        }

    });
    addCodeBtn.on('click', function () { // 认领物料
        // 与NA联调
        let url = window.location.href = 'band://web?type=materials_claim&url=' + window.location.protocol + '//' + window.location.host + '/naserver/user/addcodetpl?uid=' + curUid;
        // 上线
        // window.location.href='/naserver/user/addcodetpl?uid=' + curUid;
    });

};
let initPlugins = function () {
    getCodeList(curUid, curSid, app_version, location, id);
};
// let renderHTML = function(){
//     let data = JSON.parse(window.sessionStorage.getItem("lists"));
//     if(data.count != 0){
//          $.each(data.list,function(i,item){
//              if(item.deal_info == ''){
//                  //alert(item.deal_info );
//                  item.deal_info = '--';//团单名称可能为空
//              }
//              if(item.materiel_info == ''){
//                  //alert(item.deal_info );
//                  item.materiel_info = '--';//团单名称可能为空
//              }
//          });
//          let html = template('codeList-item-tpl', data);
//          $(html).prependTo($('#codeList'));
//          $('.loadingmore').show();
//         // $('#codeList').html(html);
//     }else{//无数据
//          let html = template('none-list-tpl',{});
//          $('#codeList').html(html);
//      }
// }
let init = function () {
    initPlugins();
    // renderHTML();
    getDom();
    bind();
};
init();

/* eslint-disable */
