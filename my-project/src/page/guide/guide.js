import style from './guide.less';

import Vue from 'vue';
import 'DeferredBNJS';
var api = require('../../config/api');
var utilBNJS = require('widget/util/bnjs/util-bnjs');
var util = require('widget/util/util');
var $ = require('dep/zepto');

// 初始化页面级的Vue实例
// var vm = new Vue({
//     el: 'body',
//     data: {
//         bannerList: [],
//         dealList: []
//     },
//     components: {
//         banner,
//         list
//     },
//     ready () {

//     }
// });

// // 获取页面数据
// var helloworld = {
//     pageData: {},
//     init: function () {
//         var me = this;
//         // 设置页面标题
//         BNJS.ui.title.setTitle('引导页');
//         me.load();
//     },
//     load: function () {
//         var me = this;
//         console.log(api.item)
//         // debugger;
//         $.ajax({
//             url: api.item,
//             type: 'GET',
//             dataType: 'json',
//             data: {},
//             success : function(res) {
//             // 修改Vue属性值
//             // 关闭加载中页面
//            // BNJS.ui.hideLoadingPage();
//            },
//            error: function(data) {
//             console.log(data);
//             //BNJS.ui.showErrorPage('页面有些问题，请稍后再试试1', 1);
//             }
//         })

//     }
// }
console.log('test');
BNJSReady(() => {
    console.log('BNJSReady');
    BNJS.ui.title.setTitle('lby测试BNJS');

    /* 注册广播接收器 */
    BNJS.page.registerReceiver('com.nuomi.merchant.broadcast.LOGIN', function (res) {
        BNJS.ui.toast.show('PAGE_REFRESH接收器注册成功！');
        BNJS.page.start('baidunuomimerchant://component?url=http://172.22.149.96:8399/page/login.html', {}, 1);
    });

});
