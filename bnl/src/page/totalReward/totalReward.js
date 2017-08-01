/**
 * @file Describe the file 
 * 累计佣金:BaiduNuomiMerchant://component?compid=bnl&comppage=totalReward
 * @author name<liuboying@baidu.com>
 */
require('dep/zepto');
require('dep/artTemplate');
require('widget/ratchet/ratchet');
require('./totalReward.less');

var formatMoney = require('static/js/formatMoney');
var api = require('../../config/api');
var dialog = require('widget/dialog/dialog.js');
var Baidu = require('dep/baiduTemplate');
var rewardListTpl = require('./view/totalRewardList.tpl');

// 确保组件页面能够正常使用BNJS方法，避免造成一些奇怪的错误发生
var BNJSReady = function (readyCallback) {
    if (readyCallback && typeof readyCallback =='function') {
        if (window.BNJS && typeof window.BNJS =='object' && BNJS._isAllReady) {
            readyCallback();

        }else {
            document.addEventListener('BNJSReady', function () {
                readyCallback();
            }, false);
        }
    }
};

var totalReward = function () {
    // class-map
    this.classMap = {
        3: 'item-status-gray',
        5: 'item-status-gray',
        7: 'item-status-gray',
        4: 'item-status-green',
        6: 'item-status-pink'
    };
    // 佣金详情页面urk
    this.rewardDetailUrl = 'BaiduNuomiMerchant://component?compid=bnl&comppage=promoteDetail';   
    // 是否允许请求接口
    this.isAjaxLocked = false;
    // 是否首次进入页面
    this.isInit = true;
    // 是否允许滚动
    this.isEnableScroll = true;
    // 加载数据
    // BNJSReady(function () {
    //     BNJS.ui.hideLoadingPage();
    //     BNJS.localStorage.getItem('bnl_bduss', function(bduss){
    //         console.log('bduss===='+bduss);
            this.getBillList(0, 'refresh', 'bduss');
        // })      
    // })
    

};

totalReward.prototype.getBillList = function (xid, act, bnl_bduss) {

    var me = this;

    if (!me.isAjaxLocked) {
        me.isAjaxLocked = true;
        $.ajax({
            url: api.newbilllist,
            type: 'GET',
            dataType: 'json',
            data: {
                xid: xid,
                act: act,
                bduss: bnl_bduss
            },
            success: function (res) {
                if (res.errno != 0) {
                    $.dialog({  
                        showTitle : false,
                        contentHtml : res.msg,
                        buttonClass : {
                            ok : 'dialog-font-color-white'
                        }           
                    });
                }
                if (res.data.bill_list.length != 0) {
                    me.renderHTML(res);
                }
                else{
                    $('#none-list-tpl').show();              
                }
                me.isAjaxLocked = false;
                me.isInit = false;
                $(window).trigger('enableLoad');
            }
        });

    }
}

totalReward.prototype.bindEvents = function () {
    var me = this;
    // 上滑
    $('.content').on('scroll', function (e) {
        isInit = false;
        me.check();
    });
    // 佣金详情
    $('.navigate-right').on('click', function (e) {
        var target = $(e.target);
        var bill_id = $(target[0]).data('billid');
        var time = $(target[0]).data('time');
        var commission = $(target[0]).data('commission');
        var status = $(target[0]).data('status');
        var status_str = $(target[0]).data('statusstr');
        var billcycle = $(target[0]).data('billcycle');

        if (billcycle=== 1) {
            var params = {
                bill_id: bill_id,
                time: time,
                commission: commission,
                status: status,
                status_str: status_str
            }
        }
        else if (billcycle=== 2) {
            var params = {
                bill_id: bill_id,
                time: time.split('-')[0],
                commission: commission,
                status: status,
                status_str: status_str
            }
        }
        else{
            var params = {
                bill_id: bill_id,
                time: time
            }
        }

        BNJSReady(function () {
            BNJS.ui.hideLoadingPage();        
            BNJS.page.start(me.rewardDetailUrl, params, 1)
        })
    })
}
totalReward.prototype.check = function () {
    var me = this;
    if (me.isEnableScroll) {
        var scrollHeight;
        var scrollPosition;
        var bodyHeight = $('#bill-list').height();
        var viewHeight = window.innerHeight;
        var scrollTop = $('.content').scrollTop();
        if (bodyHeight - scrollTop - viewHeight < 10) {
            me.addDiv();
            $(window).trigger('disableLoad');
            me.getBillList(me.getLastXid(), 'loadmore', me.bnl_bduss);
        }
    }

    $(window).bind('enableLoad', function () {
        me.isEnableScroll = true;
    });
    $(window).bind('disableLoad', function () {
        me.isEnableScroll = false;
    });
}
// 获取当前list最后一条
totalReward.prototype.getLastXid = function () {
    var xid = $('#bill-list').find('li').find('a').last().attr('xid');
    return xid;
}
// 没有更多了
totalReward.prototype.noMoreDiv = function () {
    if ($('.loadingmore').length > 0) {
        return;
    }

    var loadingmore = $('<div class="loadingmore" data-elems="loadingmore">加载中...</div>');
    loadingmore.appendTo('.content');
}
// 加载中
totalReward.prototype.addDiv = function () {
    if ($('.loadingmore').length > 0) {
        return;
    }
    var loadingmore = $('<div class="loadingmore" data-elems="loadingmore">加载中...</div>');
    loadingmore.appendTo('.content');
}
// 
totalReward.prototype.renderHTML = function (res) {
    var me = this;

    $.each(res.data.bill_list, function (i, item) {

        item.formatmoney = formatMoney.formatMoney(item.commission);
        item.classname = me.classMap[item.status + ''];
    });

    var HTML = Baidu.template(rewardListTpl, {
        item: res.data.bill_list,
        total_commission: '￥' + formatMoney.formatMoney(res.data.total_commission)
    })

    $('.content').html(HTML);
    me.bindEvents();
}

new totalReward();

