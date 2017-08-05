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
let util = require('widget/util/util');
let utilBNJS = require('widget/util/bnjs/util-bnjs');
let httpBnjs = require('widget/http/httpBnjs');
let Baidu = require('dep/baiduTemplate');
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');

let accessParam = {};
// 物料认领按钮`
let material_button = $('.claim-button');

// 物料认领弹窗
let dialogTpl = require('./view/dialog.tpl');
// 加载list模板
let tpl = require('./view/materialItems.tpl');

/**
 * 获取物料信息，渲染物料列表
 * 
 */
let materialItemView = {
    pageData: {},
    init: function () {
        let me = this;
        me.load();
        $(document).on('tap', '.material-item-link', function(e) {
            let id = $(this).data('id');
            BNJS.page.start('BaiduNuomiMerchant://component?compid=bnl&comppage=cardList', {id: id});
        })
    },
    load: function () {
        let me = this;
        accessParam.bduss = bdussStroage;  
        httpBnjs.get({
            url: api.codelist,
            params: {
                b_uid: uid,
                bduss: bdussStroage                        
            }
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
                            BNJS.page.start('BaiduNuomiMerchant://component?url=http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/merchantlogintpl', {});
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
                params: {
                    b_uid: uid,
                    bduss: bdussStroage                        
                }
            })
            .then(function(resp) {
                // 弹窗HTML
                let html = Baidu.template(dialogTpl, {
                    title: '是否绑定此门店?',
                    name: res.alliance_name,
                    id: res.merchant_id
                });
                if (resp.data.alliance_name) {
                    let res = resp.data;
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
                            // window.location.href = 'band://web?type=materials_binding&deal_id=' + this.res.merchant_id + '&deal_name=' + this.res.alliance_name + '&deal_statu=在线&merchant_id=' + this.res.merchant_id + '&product=5';
                            _this.bindMaterial();
                        },
                        onClickCancel: function () {
                            // window.location.href = 'band://web?type=query_store&url=' + window.location.protocol + '//' + window.location.host + '/naserver/user/mendiansearch?uid=';
                            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=mendianSearch", {}, 1);
                        }
                    });                    
                }
            }, function(res) {
                BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=mendianSearch", {}, 1);
            });
        });
    },
    bindMaterial:function(){
        var _this = this;
        util.ready(function() {
            BNJS.hardware.scanQRCode(function(res) {
                let url = res.data.content;
                let result = util.parseQueryString(url);
                let code_id = result.id;
                httpBnjs.get({
                    url: api.bindcode,
                    params: {
                        code_id: code_id,
                        product: 5                      
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
                                BNJS.page.start("BaiduNuomiMerchant://component?url=http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/merchantlogintpl", {});
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
                            }
                        });
                    }    
                }, function(res) {
                    
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
    init();
    BNJS.ui.title.setTitle('我的物料');
})
/* eslint-disable */