/**
 * @file 百糯连熊迹扫码 空白页页面调起SDK
 * @author liuboying <liuboying@baidu.com>
 * @date 2016-08-30
 */
/* eslint-disable */
require('./login.less');
var $ = require('dep/zepto')
var smsLogin = require('./smsLogin.js');
var urlParam = require('static/js/urlParam');
import 'DeferredBNJS'
// 获取query值
// function urlQuery(key) {
//     var half = decodeURIComponent(location.search).split(key + '=')[1];
//     return half != undefined ? decodeURIComponent(half.split('&')[0]) : null;
// }


smsLogin({
    success: function(bdusign) { 
        // pass登录成功后cb
        window.location.href = location.search.split("?u=")[1]+'&bdusign='+bdusign;
        
    }
},urlParam.getUrlParam('qatest')==1)
BNJSReady(() => {
    console.log('BNJSReady');
    BNJS.ui.title.addActionButton({
    tag: "1",
    text: "帮助",
    callback: function(){
        alert('help!')
    }
     
   });
    /* 注册广播接收器 */
       BNJS.page.registerReceiver('com.nuomi.merchant.broadcast.LOGIN', function(res){
           var str = '';
           for(var i in res.data){
               str = str + i + ':' + res.data[i] + ';';
           }   
           alert('str');   
           BNJS.ui.toast.show('PAGE_REFRESH接收器注册成功！')
       });

})
/* eslint-disable */
