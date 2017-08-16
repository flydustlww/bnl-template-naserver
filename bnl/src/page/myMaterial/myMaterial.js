/**
 * @file Describe the file
 * @author name<yuchangshuang@baidu.com>
 */
/* eslint-disable */
import style from './myMaterial.less';
import Vue from 'vue';
let $ = require('dep/zepto');
let api = require('../../config/api');
let util = require('widget/util/util');
let utilBNJS = require('widget/util/bnjs/util-bnjs');
let httpBnjs = require('widget/http/httpBnjs');
let Baidu = require('dep/baiduTemplate');
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');
let FastClick  = require('dep/fastclick/index.js');

let server = require('../../config/server').server;
let merchantlogin = encodeURIComponent(server + '/naserver/newapp/merchantlogintpl');
let accessParam = {};
// 物料认领按钮`
let material_button = $('.claim-button');

// 物料认领弹窗
let dialogTpl = require('./view/dialog.tpl');
// 加载list模板
let tpl = require('./view/materialItems.tpl');

FastClick.attach(document.body, {});
/**
 * 获取物料信息，渲染物料列表
 * 
 */
let materialItemView = {
    pageData: {},
    init: function () {
        let me = this;
        me.load();
        // 下拉刷新
        BNJS.ui.nativeInterfere({
            pullDown: true,     // 是否要开启下拉刷新功能
            pullDownCallback: function () {

                setTimeout(function () {
                    BNJS.ui.closePullAction('pulldown');
                }, 2000);
            }  

        });
        $('.items-wrapper').on('click', '.material-item-link', function(e) {
            let data_id = $(this).data('id');
            let params = {
                id: data_id
            };
            BNJS.page.start('BaiduNuomiMerchant://component?compid=bnl&comppage=cardList', params);
        })
    },
    load: function () {
        let me = this;
        httpBnjs.get({
            url: api.codelist,
            params: {}
        })
        .then(function(res) {
            let data = res;
            // 如果返回错误弹窗
            if (data.errno != 0) {
                if (resp.errno === 2002) {
                    $.dialog({
                        showTitle : false,
                        contentHtml : resp.msg,
                        buttonClass : {
                            ok : 'dialog-font-color-pink'
                        },
                        onClickOk: function() {
                            BNJS.page.start("BaiduNuomiMerchant://component?url=" + merchantlogin, {}, 1);
                        }
                    });
                } else {
                    $.dialog({
                        showTitle: false,
                        contentHtml: data.msg,
                        buttonClass: {
                            ok: 'dialog-font-color-pink'
                        }
                    });
                }
            }
            else {
                me.render(data.data.list);
            }                
        }, function(res) {
            BNJS.ui.showErrorPage();
        });   
    },
    render: function (list) {
        // url待与rd传参对
        var HTML = Baidu.template(tpl, {
            item: list
        });
        $('section').html(HTML);
    }
};

/**
 * 监听物料绑定按钮
 */

let bindButton = {
    init: function () {
        let _this = this;
        material_button.on('tap', function (ev) {
            httpBnjs.get({
                url: api.memberMerchant,
                params: {}
            })
            .then(function(resp) {
                // 弹窗HTML
                if (resp.data.alliance_name) {
                    let res = resp.data;
                    let html = Baidu.template(dialogTpl, {
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
                            _this.bindMaterial(res.merchant_id);
                        },
                        onClickCancel: function () {
                            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=mendianSearch", {}, 1);
                        }
                    });                    
                }
            }, function(res) {
                BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=mendianSearch", {}, 1);
            });
        });
    },
    bindMaterial:function(merchant_id){

        var _this = this;
        util.ready(function() {
            BNJS.hardware.scanQRCode(function(res) {
                // 扫码成功再请求bindcode fixbug 1570
                    let url = res.data.content;
                    let result = util.parseQueryString(url);
                    let code_id = result.id;
                    httpBnjs.post({
                        url: api.bindcode,
                        params: {
                            code_id: code_id,
                            product: 5,
                            merchant_id: merchant_id                      
                        }
                    })                
                    .then(function(resp){
                        if (resp.errno === 2002) {
                            $.dialog({
                                showTitle : false,
                                contentHtml : resp.msg,
                                buttonClass : {
                                    ok : 'dialog-font-color-pink'
                                },
                                onClickOk: function() {
                                    BNJS.page.start("BaiduNuomiMerchant://component?url=" + merchantlogin, {}, 1);
                                }
                            });
                        } else  if (resp.errno === 0){
                            $.dialog({
                                showTitle : false,
                                contentHtml : "认领成功",
                                buttonClass : {
                                    ok : 'dialog-font-color-pink'
                                },
                                onClickOk: function() {
                                    BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=myMaterial", {}, 1);
                                }
                            });
                        } else {
                            $.dialog({
                                showTitle : false,
                                contentHtml : resp.msg,
                                buttonClass : {
                                    ok : 'dialog-font-color-pink'
                                },
                                onClickOk: function() {
                                    BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=myMaterial", {}, 1);
                                }
                            });                        
                        }
                    }, function(res) {
                        BNJS.ui.toast.show(res.msg)
                    });                
                    
            })
        })

    }
};

let init = function () {
    materialItemView.init();
    bindButton.init();
};

util.ready(function() {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('我的物料');
    BNJS.page.setPageId('myMaterial');
    init();
})

/* eslint-disable */