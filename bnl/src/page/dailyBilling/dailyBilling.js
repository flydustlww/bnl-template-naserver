/**
 * @file 今日佣金
 * @author songjin <songjin@baidu.com>
 * @description  有时间请重构
 * @date 
 */
require('dep/zepto');
require('dep/artTemplate');
require('./css/scroll.css');
require('widget/ratchet/ratchet');
require('./css/reward.css');
require('./dailyBilling.less');
var util = require('widget/util/util');
var urlParam = require('static/js/urlParam');
var formatMoney = require('static/js/formatMoney');
var api = require('../../config/api');
var cutString = require('static/js/cutString');
var util = require('widget/util/util.js');
var httpBnjs = require('widget/http/httpBnjs');
var utilBNJS = require('widget/util/bnjs/util-bnjs.js');
var iosDatePicker = require('widget/iosDatePicker/iosDatePicker');


var promoteList;
var isInit;
var curPageNum;
var curUserType;
var curDate;
var formatDate;
var curCount = 12;
var isAjaxLocked = false;
var curTime = (new Date().getTime()) / 1000;
var timeTpl = '<ul class="table-view">'
    + '<li class="table-view-cell">'
    + '<input type="date" value="" class="timeselect font-color-gray">'
    + '</li>'
    + '</ul>';
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
        var bodyHeight = $('#promote-list').height();
        var viewHeight = window.innerHeight;
        var scrollTop = $('.content').scrollTop();
        if (bodyHeight - scrollTop - viewHeight < 10) {
            add.addDiv(); // 显示加载更多div
            $(window).trigger('disableLoad'); // 显示加载中的过程中不允许scroll
            getPromoteList(curPageNum, curCount, curUserType, formatDate);
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
var initPlugins = function () {
    isInit = true;
    curPageNum = 1;
    curUserType = 0;
    if (urlParam.getUrlParam('time')) {
        curDate = urlParam.getUrlParam('time');
        curTime = (new Date(curDate).getTime()) / 1000;
    }
    else {
        curDate = formatTime(curTime).year + '-' + formatTime(curTime).month + '-' + formatTime(curTime).date;
    }
    formatDate = curDate.replace(/-/g, '');

    /*promoteList.html(timeTpl);
    promoteList.find('.timeselect').val(curDate);*/
    $('#promote-title').find('.timeselect').val(curDate);
    BNJS.ui.title.addActionButton({
        tag: 2,
        text: '日期',
        callback: function() {
            new iosDatePicker();
        }


    });
    getPromoteList(1, curCount, 0, formatDate);
};
var formatTime = function (time) {
    var time = time * 1000;
    var formattime = {};
    var date = new Date(time);
    formattime.year = date.getFullYear();
    formattime.month = (date.getMonth() + 1) < 10 ? ('0' + parseFloat(date.getMonth() + 1)) : (date.getMonth() + 1);
    formattime.date = (date.getDate()) < 10 ? ('0' + parseFloat(date.getDate())) : (date.getDate());
    formattime.hour = (date.getHours()) < 10 ? ('0' + parseFloat(date.getHours())) : (date.getHours());
    formattime.minute = (date.getMinutes()) < 10 ? ('0' + parseFloat(date.getMinutes())) : (date.getMinutes());
    formattime.second = (date.getSeconds()) < 10 ? ('0' + parseFloat(date.getSeconds())) : (date.getSeconds());
    return formattime;
};
var getPromoteList = function (page, count, user_type, search_date) {

    var total_commission;
    var html;
    if (!isAjaxLocked) {
        isAjaxLocked = true;
    
            utilBNJS.storage.getItem('bnl_bduss').then(function (res) {
            var bdussStroage = res;
            var bdussStroage = "2ZmaENuUlFXa1hIOFhMQmxMV0Z1cXdMWjl5U1hyelU4ZEl0ZkhpM3ZiTEQ0S2haSVFBQUFBJCQAAAAAAAAAAAEAAAAoqTMGcmVubGVpODAwOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMNTgVnDU4FZT";
            httpBnjs.get({
                url: api.mycustomer2,
                params: {
                    page: page,
                    count: 12,
                    user_type: user_type,
                    search_date: search_date,
                    bduss: bdussStroage                        
                }
            })
            .then(function(data) {
                if (data.errno == 0) {
                    if (data.data.detail && data.data.detail.length != 0) {
                        $('.content-title').show();
                        $('#promote-title').show();
                        $('#promote-content').show();
                        $('#promote-none').hide();
                        if (data.data.total_commission) {
                            total_commission = '￥' + formatMoney.formatMoney(data.data.total_commission);
                        }
                        else {
                            total_commission = '￥0.00';
                        }
                        $('.total-amount').html(total_commission);
                        add.removeDiv();
                        $.each(data.data.detail, function (i, item) {
                            item.formatcommission = formatMoney.formatMoney(item.commission);
                            if (item.pay_time == 0) { // 购买时间
                                item.formatpay_time = '--';
                            }
                            else {
                                item.formatpay_time = formatTime(item.pay_time).year + '-' + formatTime(item.pay_time).month + '-' +
                                formatTime(item.pay_time).date + '' + ' ' + formatTime(item.pay_time).hour + ':' +
                                formatTime(item.pay_time).minute + ':' + formatTime(item.pay_time).second;
                            }
                            if (item.consumption_time == 0) { // 消费时间
                                item.formatconsumption_time = '--';
                            }
                            else {
                                item.formatconsumption_time = formatTime(item.consumption_time).year + '-' + formatTime(item.consumption_time).month + '-' +
                                formatTime(item.consumption_time).date + '' + ' ' + formatTime(item.consumption_time).hour + ':' +
                                formatTime(item.consumption_time).minute + ':' + formatTime(item.consumption_time).second;
                            }
                            item.formatorder_price = '￥' + formatMoney.formatMoney(item.order_price); // 订单金额
                            if (item.rule_name == '') { // 推广策略
                                item.formatrule_name = '--';
                            }
                            else {
                                item.formatrule_name = cutString.cutString(item.rule_name, 18);
                            }
                            if (item.deal_name == '') { // 团单名称
                                item.formatdeal_name = '--';
                            }
                            else {
                                item.formatdeal_name = cutString.cutString(item.deal_name, 18);
                            }
                            if (item.product_type == '') { // 推广类型
                                item.product_type = '--';
                            }

                        });
                        html = template('promote-list-tpl', data);
                        $(html).appendTo($('#promote-content'));
                        $('.timeselect').on('change', function (evt) {
                            var inputval = $(this).val();
                            window.location.href = '/naserver/user/mycustomer2tpl?time=' + inputval;
                        });
                    }
                    else {
                        if (isInit) {
                            $('.content-title').hide();
                            $('#promote-title').hide();
                            $('#promote-content').hide();
                            $('#promote-none').show();
                            add.removeDiv();
                            $('.content-title').hide();
                            if (curUserType == 0) {
                                promoteList.find('.none-text').html('当日无推广活动！');
                            }
                            else {
                                promoteList.find('.none-text').html('不存在该种类型的推广记录！');
                            }
                        }
                        else {
                            add.noMoreDiv();
                        }
                    }
                }
                else {
                    alert(data.msg);
                    return;
                }
                curPageNum = curPageNum + 1;
                isAjaxLocked = false;
                $(window).trigger('enableLoad');
            })
        }) 
       

    }

};
var getDom = function () {
    promoteList = $('#promote-list');
};
var bind = function () {
    var item = $('.control-item');
    // 全部 user_type=0  新客 user_type=1 老客 user_type=2
    $('.control-item').on('click', function (evt) {
        $.each(item, function (i, val) {
            $(val).removeClass('active');
        });
        evt.preventDefault();
        $('#promote-title').hide();
        $('#promote-content').html('');
        $('#promote-none').hide();
        isInit = true;
        curPageNum = 1;
        var target = $(evt.target);
        target.addClass('active');
        var user_type = target.attr('user_type');
        curUserType = user_type;
        getPromoteList(curPageNum, curCount, curUserType, formatDate);       
        
    });
    // 展开收起
    promoteList.on('click', function (evt) {
        // evt.preventDefault();
        var li = $(evt.target).closest('li');
        var target = li.find('.icon');
        var id = target.attr('id');
        var promoteInfoList = target.parent().find('.order-detail-list');
        if (target.attr('status') == 'down') {
            promoteInfoList.show();
            target.removeClass('icon-down').addClass('icon-up');
            target.attr('status', 'up');
            return;
        }

        if (target.attr('status') == 'up') {
            promoteInfoList.hide();
            target.parent().find('.order-detail-list').hide();
            target.removeClass('icon-up').addClass('icon-down');
            target.attr('status', 'down');
            return;
        }

    });
    // 上滑
    $('.content').on('scroll', function (e) {
        isInit = false;
        scroll.check();
    });
};
var init = function () {
    getDom();
    initPlugins();
    bind();
};

util.ready(function() {
    BNJS.ui.hideLoadingPage();
    BNJS.ui.title.setTitle('当日佣金');
    init();
})

