<style lang="less" scoped>

</style>

<template>
    <div class="union-wrap">
        <section class="union-info-wrap">
            <p><span class="union-info">您尚未实名认证，将无法进行佣金结算</span><span class="union-info-link">立即认证&nbsp;></span></p>
        </section>
        <section class="union-top">
            <div class="union-user">
                <div class="user-img">
                    <img src="../../page/unionCenter/img/user.png" alt="头像">
                </div>
                <div class="user-message">
                    <p>Hi <span class="user-name">{{passport_username}}</span></p>
                    <p class="area">{{city_name}}{{alliance_name}}</p>
                </div>
            </div>
            <div class="union-number">
                <ul class="commission">
                    <li class="today border-rt">
                        <div class="today-count">{{new_msg_count}}</div>
                        <p>今日预估佣金</p>
                    </li>
                    <li class="total">
                        <div class="total-count">{{total_amount}}</div>
                        <p>累计佣金</p>
                    </li>
                </ul>
            </div>
        </section>
        <ul class="union-list">
            <li class="my-material"><span class="icon icon-material"></span><p class="border-bt">我的物料</p></li>
            <li class="baiduwallet"><span class="icon icon-baiduwallet"></span><p class="border-bt">百度钱包</p></li>
            <li class="my-message" @click="myMessageclick"><span class="icon icon-message"></span><p class="border-bt">我的消息</p></li>
        </ul>
        <!--<a href="BaiduNuomiMerchant://bindingphone?channel=alliance&notificationName=com.nuomi.merchant.broadcast.PERSONALPROFILE&bottomText=填写完成,去退出重新登录" class="quick">去填写角色</a>-->
    </div>
</template>
<script>
require('widget/global/global.less');
require('../../page/unionCenter/unionCenter.less');
let api = require('../../config/api');
import $ from 'dep/zepto';
let Baidu = require('dep/baiduTemplate');
// 为了兼容该死的华为荣耀6
let Promise = require('widget/util/es6-promise.js').Promise;
let dialog = require('widget/dialog/dialog.js');
let urlParam = require('static/js/urlParam');
let curUid = urlParam.getUrlParam('uid');
export default {
	name: 'union-center',
	data: function(){
		return{
            total_amount: '',
            is_verified: '',
            city_name: '',
            alliance_id: '',
            alliance_name: '',
            passport_username: '',
            promote_count: '',
            new_msg_count: ''
		}
	},
    created: function(){
        this.getData();
        // this.firstUniondialog();
        // this.addVertifydialog();
        this.addUniondialog()
    },
	methods: {
        getData: function() {
            let that = this;
            let p1 = new Promise(getMyaccount).then(function(res) {
                that.total_amount = res.total_amount;
                that.is_verified = res.is_verified; 
                that.city_name = res.city_name;
                that.alliance_name = res.alliance_name;
                that.promote_count = res.promote_count;
                that.passport_username = res.passport_username;
                return Promise.resolve(res);
            }, function(res) {
                $.dialog({
                    showTitle : false,
                    contentHtml : res.msg||'出错了!',
                    buttonClass : {
                        ok : 'dialog-font-color-pink'
                    }
                });
            })

            let p2 = new Promise(getnewmsginfo).then(function(res) {
                that.new_msg_count = res.new_msg_count;
                return Promise.resolve(res);
            }, function(res) {
                $.dialog({
                    showTitle : false,
                    contentHtml : res.msg||'出错了!',
                    buttonClass : {
                        ok : 'dialog-font-color-pink'
                    }
                });
            })

            Promise.all([p1, p2]).then(function (result) {
                console.log('all');
                console.log(result);
            });

            function getMyaccount(resolve, reject) {
                $.ajax({
                    url: api.myaccount,
                    type: 'GET',
                    dataType: 'json',
                    data: '',
                    success: function(res){
                        if (res.errno == 0) {
                            resolve(res.data)
                        }
                    },
                    error: function(res){
                        reject(res);
                    }
                }) 
            }
            function getnewmsginfo(resolve, reject) {
                $.ajax({
                    url: api.getnewmsginfo,
                    type: 'GET',
                    dataType: 'json',
                    data: '',
                    success: function(res){
                        if (res.errno == 0) {
                            resolve(res.data) 
                        }
                    },
                    error: function(res){
                        reject(res)
                    }
                })
            }
        },
        myMessageclick: function() {
            window.location.href = "BaiduNuomiMerchant://mymessagedetail?typeName=公告&typeId=1";
        },
        firstUniondialog: function(data) {
            $.dialog({
                showTitle : false,
                dialogClass: 'firstUnion',
                contentHtml : '恭喜您加入<br><span>"海底捞上地店商户联盟"</span><br>成为百度糯米商户联盟第8位会员',
                buttonClass : {
                    ok : 'dialog-font-color-white'
                }           
            });
        },
        addVertifydialog: function(data) {
            $.dialog({
                type: 'confirm',
                showTitle: false,
                contentHtml: "您尚未实名认证!<br>将无法进行佣金结算",
                buttonText: {
                    ok: '立即认证',
                    cancel: '稍后再说'
                },
                buttonClass: {
                    ok: 'dialog-font-color-blue',
                    cancel: 'dialog-btn-cancel'
                },
                onClickOk: function () {
                    console.log("ok");
                },
                onClickCancel: function () {
                    console.log("error");
                }
            });            
        },
        addUniondialog: function(data) {
            // 未加登录判断
            
/*             $.dialog({
                type: 'confirm',
                showTitle: false,
                dialogClass: 'addUnion',
                contentHtml: "<p>您尚未加入联盟!</p>系统检测您登录的手机号尚未填<br>写角色信息，故无法加入联盟认<br>领物料和推广，请您尽快完善。",
                buttonText: {
                    ok: '立即填写',
                    cancel: '稍后处理'
                },
                buttonClass: {
                    ok: 'dialog-font-color-blue',
                    cancel: 'dialog-btn-cancel'
                },
                onClickOk: function () {
                    console.log("ok");
                },
                onClickCancel: function () {
                    console.log("error");
                }
            }); */
            // 判断百糯连弹窗
            $.dialog({
                type: 'confirm',
                showTitle: false,
                dialogClass: 'addUnion',
                contentHtml: "<p>您尚未加入联盟!</p>您尚未加入联盟或您的百度账号<br>手机号暂未加入联盟。如您未加入联盟请去<br>填写角色，如已加入请用联盟手机号登录。",
                buttonText: {
                    ok: '未加入，去填写',
                    cancel: '已加入，稍后登录'
                },
                buttonClass: {
                    ok: 'dialog-font-color-blue',
                    cancel: 'dialog-btn-cancel'
                },
                onClickOk: function () {
                    console.log("ok");
                },
                onClickCancel: function () {
                    console.log("error");
                }
            });                
        }
	}
}
</script>
