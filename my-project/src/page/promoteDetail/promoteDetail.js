(function () {

    require('dep/zepto');
    require('dep/artTemplate');
    require('./css/scroll.css');
    require('widget/ratchet/ratchet');
    require('./css/reward.css');
    require('./promoteDetail.less');
    var cutString = require('static/js/cutString');
    // mock数据
    var api = require('../../config/api');
    var curBillId;
    var curPageNum;
    var curUserType;
    var curCount = 20;
    var isAjaxLocked = false;
    var isSwipe = false;
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
            var bodyHeight = $('.reward-list').height();
            var viewHeight = window.innerHeight;
            var scrollTop = $('.content').scrollTop();
            if (bodyHeight - scrollTop - viewHeight < 10) {
                add.addDiv(); // 显示加载更多div
                $(window).trigger('disableLoad'); // 显示加载中的过程中不允许scroll
                getBill(curBillId, curPageNum, curCount, curUserType);
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
    var promoteInfoMap = {
        billing_user: '推广用户',
        rule_name: '推广策略',
        pay_time: '购买时间',
        consumption_time: '消费时间',
        deal_info: '团单名称',
        order_price: '订单金额',
        product_type: '推广类型',
        user_type: '用户类型',
        lower: '下级推广员'
    };
    function getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) {
            return unescape(r[2]);
        }

        return null; // 返回参数值
    }
    var formatMoney = function (x) {
        var x = x / 100;
        var f_x = parseFloat(x);
        if (isNaN(f_x)) {
            return false;
        }

        var f_x = Math.round(x * 100) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }

        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
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
    var getBill = function (bill_id, page, count, user_type) {
        var html;
        var postdata = {
            bill_id: bill_id,
            page: page,
            count: count || 10,
            user_type: user_type
        };
        if (!isAjaxLocked) {
            isAjaxLocked = true;
            $.ajax({
                url: api.billing, // "/naserver/user/billing",
                type: 'get',
                dataType: 'json',
                data: postdata,
                success: function (data) {
                    if (data.errno == 0) {
                        if (data.data && data.data.detail.length > 0) {
                            $('#reward-title-html').show();
                            $('#reward-content-list').show();
                            $('#reward-content-none').hide();
                            $('#reward-list').removeClass('table-noborder');
                            data.totalamount = '￥' + formatMoney(data.data.total_commission);
                            data.curday = getUrlParam('time');
                            html = template('reward-title-tpl', data); // 顶部总计
                            $('#reward-title-html').html(html);
                            add.removeDiv();
                            $.each(data.data.detail, function (index, item) {
                                if (item.commission) {
                                    item.formatcommission = formatMoney(item.commission);
                                }

                            });
                            html = template('reward-list-tpl', data);
                            $(html).appendTo($('#reward-content-list'));
                        }
                        else {
                            if (isInit) {
                                $('#reward-title-html').hide();
                                $('#reward-content-list').hide();
                                $('#reward-content-none').show();
                                $('#reward-list').addClass('table-noborder');
                                add.removeDiv();
                                if (curUserType == 0) {
                                    $('.reward-list').find('.none-text').html('当日无推广活动！');
                                }
                                else {
                                    $('.reward-list').find('.none-text').html('不存在该种类型的推广记录！');
                                }
                            }
                            else {
                                add.noMoreDiv();
                            }
                        }

                    /*if((data.data.total == 0)&&isTabChange ){
                        $('#reward-title-html').hide();
                        $('#reward-list').addClass('table-noborder');
                    }else{
                        $('#reward-title-html').show();
                        $('#reward-list').removeClass('table-noborder');
                    }
                    if(isTabChange){
                        var html = template('reward-list-tpl', data);
                    }else{
                        var html = $("#reward-list").html() + template('reward-list-tpl', data);
                    }
                    $("#reward-list").html(html);
                    if(data.data.total == 0){
                        if(curUserType == 0){
                            $('.reward-list').find('.none-text').html('当日无推广活动！');
                        }else{
                            $('.reward-list').find('.none-text').html('不存在该种类型的推广记录！');
                        }
                    }*/
                    }
                    else {
                        alert(data.msg);
                        return;
                    }
                    curPageNum = curPageNum + 1;
                    isAjaxLocked = false;
                    $(window).trigger('enableLoad');
                }
            });
        }

    };
    var getPromoteInfo = function (bill_id, target) {
        var arr = [];
        var label;
        var content;
        var postdata = {
            billing_id: bill_id
        };
        $.ajax({
            url: api.GetPromoteInfo, // "/naserver/user/GetPromoteInfo",
            type: 'get',
            dataType: 'json',
            data: postdata,
            success: function (data) {
                $.each(data.data, function (key, value) {
                    if (promoteInfoMap[key]) {
                        if (key == 'pay_time' || key == 'consumption_time') { // 购买时间，消费时间特型处理
                            value = formatTime(parseFloat(value)).year + '-' + formatTime(parseFloat(value)).month + '-'
                            + formatTime(parseFloat(value)).date + ' ' + formatTime(parseFloat(value)).hour + ':'
                            + formatTime(parseFloat(value)).minute + ':' + formatTime(parseFloat(value)).second;
                        }

                        if (key == 'order_price') { // 订单金额特型处理
                            value = '￥' + formatMoney(value);
                        }

                        if (key == 'user_type') {
                            if (value == '1') {
                                value = '新用户';
                            }

                            if (value == '2') {
                                value = '老用户';
                            }
                        }

                        if (key == 'product_type') {
                            switch (value) {
                                case '1':
                                    value = '常规地推';
                                    break;
                                case '2':
                                    value = '储值卡推广';
                                    break;
                                case '3':
                                    value = '到店付';
                                    break;
                                default:
                                    value = '--';
                            }

                            /*if(value == '1'){
                                value = '常规地推';
                            }
                            if(value == '2'){
                                value = '储值卡推广';
                            }
                            if(value == '3'){
                                value = '到店付';
                            }*/
                        }

                        if (key == 'rule_name') {
                            if (value == '') {
                                value = '--';
                            }
                            else {
                                value = cutString.cutString(value, 18);
                            }
                        }

                        if (key == 'deal_info') {
                            value = cutString.cutString(value, 18);
                        }

                        var json = {};
                        label = promoteInfoMap[key];
                        content = value;
                        json.label = label;
                        json.content = content;
                        arr.push(json);
                    }

                });
                insertList(tplToHtml('order-detail-tpl', {
                    formatdata: arr
                }, 'order-info'), target);
            }
        });
    };
    var insertList = function (html, target) {
        var li = target.parent();
        li.find('.order-detail-list').html(html).show();
    };
    var tplToHtml = function (tpl, data, domid) {
        var html = template(tpl, data);
        $('#' + domid).html(html);
        return html;
    };
    var initPlugins = function () {
        isInit = true;
        curPageNum = 1;
        curUserType = 0;
        curBillId = getUrlParam('bill_id');
        // 获取日账单明细
        getBill(curBillId, curPageNum, curCount, curUserType);
    };
    var getDom = function () {};
    var bind = function () {
        // 全部 user_type=0  新客 user_type=1 老客 user_type=2
        $('.control-item').on('click', function (evt) {
            $('#reward-title-html').html('');
            $('#reward-content-list').html('');
            $('#reward-content-none').hide();
            isInit = true;
            evt.preventDefault();
            isSwipe = false;
            curPageNum = 1;
            var target = $(evt.target);
            var user_type = target.attr('user_type');
            curUserType = user_type;
            getBill(curBillId, curPageNum, curCount, user_type, true);
        });
        // 展开收起
        $('#reward-list').on('click', function (evt) {
            evt.preventDefault();
            var li = $(evt.target).closest('li');
            var target = li.find('.icon');
            var id = target.attr('id');
            if (target.attr('status') == 'down') {
                getPromoteInfo(id, target);
                target.removeClass('icon-down').addClass('icon-up');
                target.attr('status', 'up');
                return;
            }

            if (target.attr('status') == 'up') {
                target.parent().find('.order-detail-list').hide();
                target.removeClass('icon-up').addClass('icon-down');
                target.attr('status', 'down');
                return;
            }

        });
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
})();
