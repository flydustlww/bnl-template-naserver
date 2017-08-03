/**
 * @file 仿照iOS日期控件
 * @author liuboying <liuboying@baidu.com>
 * @date 2017-08-01
 */

var IosSelect = require('dep/datePickerX');
require('./iosDatePicker.less');
var selectDate = function () {
	var _this = this;
	// var selectDateDom = $('#selectDate');
	var showDateDom = $('.select-date');
	// 初始化时间
	var now = new Date();
	var nowYear = now.getFullYear();
	var nowMonth = now.getMonth() + 1;
	var nowDate = now.getDate();
	showDateDom.attr('data-year', nowYear);
	showDateDom.attr('data-month', nowMonth);
	showDateDom.attr('data-date', nowDate);
	var oneLevelId = showDateDom.attr('data-year');
	var twoLevelId = showDateDom.attr('data-month');
	var threeLevelId = showDateDom.attr('data-date');
	// 数据初始化
	function formatYear(nowYear) {
	    var arr = [];
	    for (var i = nowYear - 5; i <= nowYear + 5; i++) {
	        arr.push({
	            id: i + '',
	            value: i + '年'
	        });
	    }
	    return arr;
	}
	function formatMonth() {
	    var arr = [];
	    for (var i = 1; i <= 12; i++) {
	        arr.push({
	            id: i + '',
	            value: i + '月'
	        });
	    }
	    return arr;
	}
	function formatDate(count) {
	    var arr = [];
	    for (var i = 1; i <= count; i++) {
	        arr.push({
	            id: i + '',
	            value: i + '日'
	        });
	    }
	    return arr;
	}
	var yearData = function (callback) {
	    // setTimeout(function() {
	    callback(formatYear(nowYear));
	    // }, 2000)
	};
	var monthData = function (year, callback) {
	    // setTimeout(function() {
	    callback(formatMonth());
	    // }, 2000);
	};
	var dateData = function (year, month, callback) {
	    // setTimeout(function() {
	    if (/^4|6|9|11$/.test(month)) {
	        callback(formatDate(30));
	    }
	    else if (/^1|3|5|7|8|10|12$/.test(month)) {
	        callback(formatDate(31));
	    }
	    else if (/^2$/.test(month)) {
	        if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
	            callback(formatDate(29));
	        }
	        else {
	            callback(formatDate(28));
	        }
	    }
	    else {
	        throw new Error('month is illegal');
	    }
	    // }, 2000);   

	};
	var tpl = [
	    '<section class="iosselect-box">',
	    '<div class="one-level-contain" id="oneLevelContain">',
	    '<ul class="select-one-level">',
	    '</ul>',
	    '</div>',
	    '<div class="two-level-contain" id="twoLevelContain">',
	    '<ul class="select-two-level">',
	    '</ul>',
	    '</div>',
	    '<div class="three-level-contain" id="threeLevelContain">',
	    '<ul class="select-three-level">',
	    '</ul>',
	    '</div>',
	    '</section>',
	    '<hr class="cover-area1"/>',
	    '<hr class="cover-area2"/>',
	    '<header style="height: " class="iosselect-header">',
	    '<h2 id="iosSelectTitle"></h2>',
	    '<a href="javascript:void(0)" class="close">取消</a>',
	    '<a href="javascript:void(0)" class="sure">确定</a>',
	    '</header>',
	    '<div class="ios-select-loading-box" id="iosSelectLoadingBox">',
	    '<div class="ios-select-loading"></div>',
	    '</div>'
	].join('\r\n');

	var iosSelect = new IosSelect(3, [yearData, monthData, dateData],
	    {
	        title: '',
	        itemHeight: 35,
	        relation: [1, 1],
	        oneLevelId: oneLevelId,
	        twoLevelId: twoLevelId,
	        threeLevelId: threeLevelId,
	        showLoading: true,
	        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
	            // showDateDom.attr('data-year', selectOneObj.id);
	            // showDateDom.attr('data-month', selectTwoObj.id);
	            // showDateDom.attr('data-date', selectThreeObj.id);
	            // showDateDom.html(selectOneObj.id + '.' + selectTwoObj.id + '.' + selectThreeObj.id + '<span id=\'triangle-down\'></span> <div class=\'seporator\'></div>');
	            var str = selectOneObj.id + '/' + selectTwoObj.id + '/' + selectThreeObj.id;
	            _this.params.start_time = (new Date(str)).getTime() / 1000;
	            _this.params.page = 1;
	            _this.params.end_time = _this.params.start_time + 24 * 60 * 60;
	            console.log('更新页面');
	           // _this.getTasklist(_this.params);
	        }
	    }, tpl);

	window.addEventListener("popstate", function(e) {
	    if (!!$('.three-level-box')) {
	        $('.three-level-box').remove();
	    }
	    
	}, false); 
}
module.exports = selectDate;