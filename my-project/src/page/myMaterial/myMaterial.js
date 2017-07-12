/**
 * @file Describe the file
 * @author name<yuchangshuang@baidu.com>
 */
/* eslint-disable */
import style from './myMaterial.less';
import Vue from 'vue';
// import 'DeferredBNJS'
let $ = require('dep/zepto');
let api = require('../../config/api');
// let utilBNJS = require('common/util/bnjs/util-bnjs');

let util = require('widget/util/util');
let urlParam = require('static/js/urlParam');
let Baidu = require('dep/baiduTemplate');
import DeferredBNJS from 'DeferredBNJS';
// 为了兼容该死的华为荣誉6
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');

// uid和sid从server取 app_version和location没有用了
let curUid = urlParam.getUrlParam('uid');
let curSid = urlParam.getUrlParam('sid');

// 物料认领按钮`
let material_button = $('.claim-button');

// 物料认领弹窗
let dialogTpl = require('./view/dialog.tpl');
// 加载list模板
var tpl = require('./view/materialItems.tpl');

// 初始化页面级的Vue实例
let vm = new Vue({
    el: 'body',
    data: {
        bannerList: [],
        dealList: []
    },
    components: {
    },
    ready() {}
});

/**
 * 获取物料信息，渲染物料列表
 * 
 */
let materialItemView = {
    pageData: {},
    init: function () {
        let me = this;
        // 设置页面标题
        BNJSReady(() => {
            BNJS.ui.title.setTitle('我的物料');
            // DeferredBNJS.ui.title.setTitle('test');
        });

        // util.ready(function () {

        // });
        // BNJS.ui.title.setTitle('我的物料');
        me.load();

    },
    load: function () {
        let me = this;
        var params = {
            uid: curUid,
            sid: curSid
        };
        $.ajax({
            url: api.codelist,
            type: 'GET',
            dataType: 'json',
            data: params,
            success: function (data) {
                // 如果返回错误弹窗
                if (data.errno != 0) {
                    $.dialog({
                        showTitle: false,
                        contentHtml: data.msg,
                        buttonClass: {
                            ok: 'dialog-font-color-pink'
                        }
                    });
                }
                else {
                    me.render(data.data.list);
                }
            },
            error: function () {
                // this.fail();
            }
        });
    },
    render: function (list) {
        // url待与rd传参对
        var HTML = Baidu.template(tpl, {
            item: list,
            url: 'band://web?type=material_claim&url=' + window.location.protocol + '//' + window.location.host + '/naserver/user/cardlisttpl' + '?uid=' + curUid + '&sid=' + curSid
        });
        $('section').html(HTML);
    }
};

/**
 * bindDialogHtml 弹窗异步请求
 * @param {object} resolve 
 * @param {object} reject 
 */
let bindDialogHtml = function (resolve, reject) {
    let html = '';
    $.ajax({
        url: api.memberMerchant,
        type: 'GET',
        data: {
            passport_uid: curUid
        },
        dataType: 'json',
        success: function (res) {
            if (res.data.alliance_name) {
                resolve(res.data);
            }
            else {
                reject();
            }
        },
        error: function () {
            reject();
        }
    });
};

/**
 * 监听物料绑定按钮
 */

let bindButton = {
    init: function () {
        material_button.on('tap', function (ev) {
            new Promise(bindDialogHtml).then(function (res) {
                // 弹窗HTML
                var html = Baidu.template(dialogTpl, {
                    title: '是否绑定此门店?',
                    name: res.alliance_name,
                    id: res.merchant_id
                });
                // 弹窗方法
                $.dialog({
                    type: 'confirm',
                    showTitle: false,
                    contentHtml: html,
                    buttonText: {
                        ok: '立即绑定',
                        cancel: '换门店绑定'
                    },
                    buttonClass: {
                        ok: 'dialog-font-color-pink',
                        cancel: 'dialog-btn-cancel'
                    },
                    res: res,
                    onClickOk: function () {
                        window.location.href = 'band://web?type=materials_binding&deal_id=' + this.res.merchant_id + '&deal_name=' + this.res.alliance_name + '&deal_statu=在线&merchant_id=' + this.res.merchant_id + '&product=5';
                    },
                    onClickCancel: function () {
                        window.location.href = 'band://web?type=query_store&url=' + window.location.protocol + '//' + window.location.host + '/naserver/user/mendiansearch?uid=' + curUid;
                    }
                });
            }, function () {
                window.location.href = '/naserver/user/mendiansearch?uid=' + curUid;
            });
        });
    }
};

let init = function () {
    materialItemView.init();
    bindButton.init();
};

// util.ready(function () {
init();
// });
/* eslint-disable */