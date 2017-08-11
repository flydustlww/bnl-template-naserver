/**
 * @file Describe the file 
 * 今日预估佣金:BaiduNuomiMerchant://component?compid=bnl&comppage=promoteDetail
 * @author name<liuboying@baidu.com>
 */

require('dep/zepto');
require('widget/ratchet/ratchet');
require('./promoteDetail.less');
// var utilBNJS = require('widget/util/bnjs/util-bnjs.js');
var api = require('../../config/api');
var Baidu = require('dep/baiduTemplate');
var httpBnjs = require('widget/http/httpBnjs');
var cutString = require('static/js/cutString');
var formatMoney = require('static/js/formatMoney');

var REWARD_LIST_TPL = require('./view/promoteDetail.tpl');
var ERROR_TPL = require('./view/error.tpl');
var DETAIL_LIST_TPL = require('./view/promoteDetailList.tpl');

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

var promoteDetail = function () {
	// 每页请求20个
	this.curCount = 20;
	// 是否请求接口
	this.isAjaxLocked = false;
	// 是否允许滚动
	this.isEnableScroll  = true;
	// 是否首次进入页面
	this.isInit = true;
	// 当前页数
	this.curPageNum = 1;
	// 当前tab
	this.curUserType = 0;
	// 推广佣金详情列表头名称
	this.promoteInfoMap = {
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
    // 上一个页面透传下来的bill_id
    this.bill_id = '';
    // time
    this.time = '';
    // bduss
    this.bduss = '';
    // 获取日账单明细
    var me = this;
    BNJSReady(function () {
        BNJS.ui.hideLoadingPage();
        BNJS.ui.title.setTitle('当日佣金');
        BNJS.page.getData(function(res){
            console.log('读取页面参数:' + JSON.stringify(res) );
        	me.bill_id = res.bill_id;
            me.time = res.time;
            me.getBill(me.bill_id, me.curPageNum, me.curCount, me.curUserType);
        }, '2.2');   
        // tab事件监听
        me.bindTabEvents();
        // 监听剪头事件
        me.bindArrowEvents();  
    });
    
}

promoteDetail.prototype.getBill = function (bill_id, page, count, user_type) {
	var me = this;
	if (!me.isAjaxLocked) {
		me.isAjaxLocked = true;
		// utilBNJS.storage.getItem('bnl_bduss', function(bduss) {
			// var bduss = "<2ZmaENuUlFXa1hIOFhMQmxMV0Z1cXdMWjl5U1hyelU4ZEl0ZkhpM3ZiTEQ0S2haSVFBQUFBJCQAAAAAAAAAAAEAAAAoqTMGcmVubGVpODAwOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA></2ZmaENuUlFXa1hIOFhMQmxMV0Z1cXdMWjl5U1hyelU4ZEl0ZkhpM3ZiTEQ0S2haSVFBQUFBJCQAAAAAAAAAAAEAAAAoqTMGcmVubGVpODAwOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>AAAAAAAAAAAAAAAAAAMNTgVnDU4FZT";
			// me.bduss = bduss;
			httpBnjs.get({
				url: api.billing,
				params: {
					bill_id: bill_id,
					page: page,
					count: count || 10,
					user_type: user_type
				}
			})
			.then(function (res) {

				if (res.errno === 0) {
					if (res.data && res.data.detail.length > 0) {
						me.renderTotalReward(res);
						// 移除加载中
						me.removeDiv();
					}
					else{
						if (me.isInit) {

						    $('#reward-list').addClass('table-noborder');

						    me.removeDiv();

						    if (me.curUserType == 0) {
						    	// 展示错误信息
						    	me.showError('当日无推广活动！');
						    }
						    else {
						    	me.showError('不存在该种类型的推广记录！');
						    }
						}
						else {
						    me.noMoreDiv();
						}
					}
				}
				else{
					me.showError(res.msg);
				}
				me.curPageNum += 1;
				me.isAjaxLocked = false;
				$(window).trigger('enableLoad');
			})

		// });
	}
};

// 监听下拉展开操作和切换tab操作
promoteDetail.prototype.bindTabEvents = function () {
	var me = this;
	// 全部 user_type=0  新客 user_type=1 老客 user_type=2
	$('.control-item').on('click', function (evt) {
		// 首次加载
	    me.isInit = true;
        // 当前页码
	    me.curPageNum = 1;
	    // 当前tab
	    var target = $(evt.target);
	    // 全部/新客/老客
	    me.curUserType= target.attr('user_type');
	    // 获取数据并展示
	    me.getBill(me.bill_id, me.curPageNum, me.curCount, me.curUserType);
	    // 阻止默认事件
	    evt.preventDefault();
	});
	// 监听滚动
	$('.content').on('scroll', function (e) {
		// 不是初次加载页面
	    me.isInit = false;
	    // 监听滚动
	    me.check();
	});
};
promoteDetail.prototype.bindArrowEvents = function () {
	var me = this;
	// 展开收起
	$('.reward-list').on('click', function (evt) {

	    var li = $(evt.target).closest('li');

	    var target = li.find('.icon');

	    var id = target.attr('id');

	    if (target.attr('status') == 'down') {

	        me.getPromoteInfo(id, target);

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
        // 组织默认事件
        evt.preventDefault();
	});	
};

// 格式化时间
promoteDetail.prototype.formatTime = function (time) {

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

// 展示佣金详情
promoteDetail.prototype.getPromoteInfo = function (bill_id, target) {
	
	var me = this;
	// bduss 在httpBnjs方法内获取
	httpBnjs.get({
		url: api.GetPromoteInfo,
		params: {
			billing_id: bill_id
		}
	})
	.then(function(res) {
		var data = res.data;
		var arr = me.dealDetailData(data);
		// 渲染详情列表
		me.renderPromoteDetailList(arr, target);
	});

};
// 处理详情数据
promoteDetail.prototype.dealDetailData = function (data) {
	var arr = [];
	var me = this;
	$.each(data.data, function (key, value) {
	    if (me.promoteInfoMap[key]) {
	        if (key == 'pay_time' || key == 'consumption_time') { 
	            // 购买时间，消费时间特型处理
	            value = me.formatTime(parseFloat(value)).year + '-' + me.formatTime(parseFloat(value)).month + '-'
	            + me.formatTime(parseFloat(value)).date + ' ' + me.formatTime(parseFloat(value)).hour + ':'
	            + me.formatTime(parseFloat(value)).minute + ':' + me.formatTime(parseFloat(value)).second;
	        }

	        if (key == 'order_price') { // 订单金额特型处理
	            value = '￥' + formatMoney.formatMoney(value);
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
	        json.label = me.promoteInfoMap[key];
	        json.content = value;
	        arr.push(json);
	    }

	});
    return arr;
};

// 渲染详情列表
promoteDetail.prototype.renderPromoteDetailList = function (arr, target) {
    //
	var html = Baidu.template(DETAIL_LIST_TPL, {
		formatdata: arr
	});

     var $deliatList = target.parent().find('.order-detail-list');
	 $deliatList.html(html);
	 $deliatList.show();   
};

// 滚动
promoteDetail.prototype.check = function () {
	var me = this;
	if (me.isEnableScroll) {
	    var scrollHeight;
	    var scrollPosition;
	    var bodyHeight = $('.reward-list').height();
	    var viewHeight = window.innerHeight;
	    var scrollTop = $('.content').scrollTop();
	    if (bodyHeight - scrollTop - viewHeight < 10) {
	        me.addDiv();
	        $(window).trigger('disableLoad');
	        me.getBill(me.bill_id, me.curPageNum, me.curCount, me.curUserType);
	    }
	}

	$(window).bind('enableLoad', function () {
	    me.isEnableScroll = true;
	});
	$(window).bind('disableLoad', function () {
	    me.isEnableScroll = false;
	});

};

// 移除加载中
promoteDetail.prototype.removeDiv = function () {
    $('.loadingmore').remove();
};
// 添加加载中提示
promoteDetail.prototype.addDiv = function () {
    if ($('.loadingmore').length > 0) {
        return;
    }

    var loadingmore = $('<div class="loadingmore" data-elems="loadingmore">加载中...</div>');
    loadingmore.appendTo('.content');
};
// 没有更多了
promoteDetail.prototype.noMoreDiv = function () {
    if ($('.loadingmore').length > 0) {
        $('.loadingmore').html('没有更多了');
    }

    $('.loadingmore').prev().find('.collapse').remove();
};
// 展示错误提示信息
promoteDetail.prototype.showError = function (msg) {
	var html = Baidu.template(ERROR_TPL, {
		msg: msg
	});

	$('.reward-list').html(html);
};

// 渲染佣金总计金额
promoteDetail.prototype.renderTotalReward = function (data) {
	var me = this;
	$.each(data.data.detail, function (index, item) {
	    if (item.commission) {
	        item.formatcommission = formatMoney.formatMoney(item.commission);
	    }

	});
	var html = Baidu.template(REWARD_LIST_TPL, {
		totalamount: '￥' + formatMoney.formatMoney(data.data.total_commission),
		curday: me.time,
		detail: data.data.detail
	});
	$('.reward-list').html(html);
    $('.loadingmore').remove();
}

new promoteDetail();