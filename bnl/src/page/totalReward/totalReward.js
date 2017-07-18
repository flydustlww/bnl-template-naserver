require('./totalReward.less');
require('dep/zepto');
require('dep/artTemplate');

require('./css/scroll.css');
require('widget/ratchet/ratchet');
require('./css/reward.css');

var urlParam = require('static/js/urlParam');
var formatMoney = require('static/js/formatMoney');

// mock数据
var api = require('../../config/api');

var classMap = {
    3: 'item-status-gray',
    5: 'item-status-gray',
    7: 'item-status-gray',
    4: 'item-status-green',
    6: 'item-status-pink'
};
var isAjaxLocked = false;
var isInit;
var isEnableScroll = true;
var scroll = new Scroll();
var add = new addMore();
// 滚动
function Scroll() {
    isEnableScroll = true;
}
Scroll.prototype.check = function () {
    if (isEnableScroll) {
        var scrollHeight;
        var scrollPosition;
        var bodyHeight = $('#bill-list').height();
        var viewHeight = window.innerHeight;
        var scrollTop = $('.content').scrollTop();
        if (bodyHeight - scrollTop - viewHeight < 10) {
            add.addDiv(); // 显示加载更多div
            $(window).trigger('disableLoad'); // 显示加载中的过程中不允许scroll
            getBillList(urlParam.getUrlParam('sid'), getLastXid(), urlParam.getUrlParam('app_version'), 'loadmore');
        }
    }

    $(window).bind('enableLoad', function () {
        isEnableScroll = true;
    });
    $(window).bind('disableLoad', function () {
        isEnableScroll = false;
    });
};
// 加载更多
function addMore() {
}
addMore.prototype.noMoreDiv = function () {
    if ($('.loadingmore').length > 0) {
        //  this.removeDiv(); 
        $('.loadingmore').html('没有更多了');
    }

    $('.loadingmore').prev().find('.collapse').remove();
};
addMore.prototype.removeDiv = function () {
    $('.loadingmore').remove();
};
addMore.prototype.addDiv = function () {
    if ($('.loadingmore').length > 0) {
        return;
    }

    var loadingmore = $('<div class="loadingmore" data-elems="loadingmore">加载中...</div>');
    loadingmore.appendTo('.content');
};

var getBillList = function (sid, xid, app_version, act) {
    var postdata = {
        sid: sid,
        xid: xid ? xid : 0,
        app_version: app_version,
        act: act
    };
    if (!isAjaxLocked) {
        isAjaxLocked = true;
        $.ajax({
            url: api.newbilllist, // "/naserver/user/newbilllist",
            type: 'GET',
            dataType: 'json',
            data: postdata,
            success: function (data) {

                if (data.errno != 0) {
                    alert(data.msg);
                    return;
                }

                if (data.data.bill_list.length != 0) {
                    add.removeDiv();
                    $('.content-title').show();
                    var totalAmount = '￥' + formatMoney.formatMoney(data.data.total_commission);
                    $('.total-amount').html(totalAmount);
                    $.each(data.data.bill_list, function (i, item) {
                        var date = new Date(item.date);
                        if (item.bill_cycle == 1 || item.bill_cycle == 2) { // yue，月账单  提测
                            if (item.bill_cycle == 1) {
                                item.href = '/page/promoteDetail.html?bill_id=' + item.bill_id + '&time=' + item.date
                                + '&bill_id=' + item.bill_id + '&commission=' + item.commission + '&date=' + item.date + '&status=' + item.status + '&status_str=' + item.status_str;
                            }

                            if (item.bill_cycle == 2) {
                                item.href = '/page/promoteDetail.html?bill_id=' + item.bill_id + '&time=' + item.date
                                + '&bill_id=' + item.bill_id + '&commission=' + item.commission + '&date=' + (item.date).split('-')[0] + '&status=' + item.status + '&status_str=' + item.status_str;
                            }
                        }
                        else {
                            item.href = '/page/promoteDetail.html?bill_id=' + item.bill_id + '&time=' + item.date;
                        }
                        item.formatmoney = formatMoney.formatMoney(item.commission);
                        item.classname = classMap[item.status + ''];
                    });
                    var html = $('#bill-list').html() + template('bill-list-tpl', data);
                    $('#bill-list').html(html);
                }
                else {
                    if (isInit) {
                        add.removeDiv();
                        $('.content-title').hide();
                        var html = template('none-list-tpl', {});
                        $('#bill-list').html(html);
                    }
                    else {
                        add.noMoreDiv();
                    }
                }
                isAjaxLocked = false;
                isInit = false;
                $(window).trigger('enableLoad');
            }
        });
    }

};
var initPlugins = function () {
    isInit = true;
    getBillList(urlParam.getUrlParam('sid'), 0, urlParam.getUrlParam('app_version'), 'refresh');
};
var getDom = function () {};
var getLastXid = function () {
    var xid = $('#bill-list').find('li').find('a').last().attr('xid');
    return xid;
};
var bind = function () {
    // 上滑
    $('.content').on('scroll', function (e) {
        isInit = false;
        scroll.check();
    });
};
var init = function () {
    initPlugins();
    getDom();
    bind();
};
init();
console.log('totalReward!');
