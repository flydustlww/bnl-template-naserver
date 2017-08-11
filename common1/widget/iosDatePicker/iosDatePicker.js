/**
 * @file 仿照iOS日期控件
 * @author liuboying <liuboying@baidu.com>
 * @date 2017-08-01
 */

var IosSelect = require('dep/datePickerX');
require('./iosDatePicker.less');
var selectDate = function (func) {
	var _this = this;

	// 初始化时间
	var now = new Date();
	var nowYear = now.getFullYear();
	var nowMonth = now.getMonth() + 1;
	var nowDate = now.getDate();

	// // 数据初始化
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

	    callback(formatYear(nowYear));

	};
	var monthData = function (year, callback) {

	    callback(formatMonth());

	};
	var dateData = function (year, month, callback) {

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
	        oneLevelId: nowYear,
	        twoLevelId: nowMonth,
	        threeLevelId: nowDate,
	        showLoading: true,
	        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                var monthStr = selectTwoObj.id.toString().length ==1 ? '0' + selectTwoObj.id : selectTwoObj.id;
                var dateStr = selectThreeObj.id.toString().length ==1 ? '0' + selectThreeObj.id : selectThreeObj.id;
	            var str = selectOneObj.id + monthStr  + dateStr;
	            var curDate = selectOneObj.id + '-' + monthStr + '-' + dateStr;
	            $('#promote-title').find('.timeselect').val(curDate);

	            func(str);
	        }
	    }, tpl);

	window.addEventListener("popstate", function(e) {
	    if (!!$('.three-level-box')) {
	        $('.three-level-box').remove();
	    }
	    
	}, false); 
}
module.exports = selectDate;