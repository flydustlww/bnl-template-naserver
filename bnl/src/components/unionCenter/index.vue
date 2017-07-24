<template>
    <div class="union-wrap">
        <section class="union-info-wrap" v-show="isInfo">
            <p><span class="union-info"></span><span class="union-info-link">立即认证</span></p>
        </section>
        <section class="union-top">
            <div class="union-user">
                <div class="user-img">
                    <img src="../../page/unionCenter/img/user.png" alt="头像">
                </div>
                <div class="user-message" v-if="isLogin">
                    <p>Hi <span class="user-name">{{passport_username}}</span></p>
                    <p class="area">{{alliance_name}}</p>
                </div>
                <div class="user-message" v-else>
                    <p class="user-no-login">未登录</p>
                </div>
            </div>
            <div class="union-number">
                <ul class="commission">
                    <li class="today border-rt">
                        <div class="today-count">{{today_commission}}</div>
                        <p>今日预估佣金</p>
                    </li>
                    <li class="total">
                        <div class="total-count">{{total_commission}}</div>
                        <p>累计佣金</p>
                    </li>
                </ul>
            </div>
        </section>
        <ul class="union-list">
            <li class="my-material" v-on:tap="materialClick"><span class="icon icon-material"></span><p class="border-bt">我的物料</p></li>
            <li class="baiduwallet" v-on:tap="baiduWalletclick"><span class="icon icon-baiduwallet"></span><p class="border-bt">百度钱包</p></li>
            <li class="my-message" v-on:tap="myMessageclick"><span class="icon icon-message"></span><p class="border-bt">我的消息</p></li>
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
let util = require('widget/util/util');
export default {
	name: 'union-center',
	data: function(){
		return{
            isLogin: false,
            token: '',
            is_alliance: true,
            isInfo: false,
            total_amount: '',
            is_verified: '',
            city_name: '',
            alliance_id: '',
            alliance_name: '',
            passport_username: '',
            promote_count: '',
            today_commission: "---",
            total_commission: "---",
            is_new: 0,
            new_num: 1,
            alliance_name: ""
		}
	},
    created: function(){
        // util.ready(function(){
            this.getData();
        // })
    },
	methods: {
        getData: function() {
            let that = this;
            // let uid = BNJS.account.uid || "";
            let uid = "12345";
            console.log(api.gettoken);
            let pN = new Promise(function (resolve, reject) {
                $.ajax({
                    url: api.gettoken,
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        that.token = res.data;
                        resolve();
                    },
                    error: function (res) {
                        console.log(res);
                        reject(res);
                    }
                });
            }).then(resp => httpAjax(api.checkuserinfo, {
                access_token: that.token,
                b_uid: uid
            })).catch(function(res) {
                $.dialog({
                    showTitle : false,
                    contentHtml : res.msg||'出错了!',
                    buttonClass : {
                        ok : ''
                    }
                }); 
            }).then(
                resp => {
                    // 拿到登录的数据
                    console.log("登录的数据")
                    console.log(resp);
                    // 如果登录状态
                    if (resp.errno === 0) {
                        // 判断加入联盟弹窗
                        if (resp.data.is_new === 1) {   // 首次加入联盟
                            that.is_new = 1;
                            that.firstUniondialog(resp.data);
                        }
                        return httpAjax(api.myuserinfo, {
                            access_token: that.token,
                            b_uid: uid
                        });
                    } else if (resp.errno === 2002) {
                        // 未登录状态
                        that.isLogin = false;
                        that.forceLogin();
                    } else if (resp.errno === 70150) {
                        // 未加入联盟
                        that.addUniondialog();
                        that.is_alliance = false;
                        that.isInfo = true;
                        that.changeInfo({
                            info: "您尚未填写角色，故无法加入联盟",
                            linkInfo: "去填写角色",
                            url: ""
                        })
                    }
                }).catch(function (res) {
                    $.dialog({
                        showTitle : false,
                        contentHtml : res.msg||'出错了!',
                        buttonClass : {
                            ok : ''
                        }
                    });                    
                }).then(resp => {
                    // 拿到用户的数据
                    console.log("用户的数据")
                    console.log(resp);
                    let datas = resp.data;
                    that.isLogin = true;
                    // 加入联盟
                    if (that.is_alliance) {
                        that.total_amount = datas.total_amount;
                        that.is_verified = datas.is_verified;
                        that.city_name = datas.city_name;
                        that.alliance_name = datas.alliance_name;
                        that.promote_count = datas.promote_count;
                        that.passport_username = datas.passport_username;
                        that.today_commission = datas.today_commission;
                        that.total_commission = datas.total_commission;
                    }

                    // 判断是否认证
                    if (that.is_verified === 0) {
                        that.isInfo = true;
                        that.changeInfo({
                            info: "您尚未实名认证，将无法进行佣金结算",
                            linkInfo: "立即认证",
                            url: "https://m.baifubao.com/wap/0/wallet/0/cardlist/0"
                        })
                        that.addVertifydialog();
                    }
                }).catch(function() {
                    $.dialog({
                        showTitle : false,
                        contentHtml : res.msg||'出错了!',
                        buttonClass : {
                            ok : ''
                        }
                    }); 
                });

            function httpAjax(url, data) {
                var p = new Promise(function (resolve, reject) {
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: "json",
                        data: {
                            b_uid: data.b_uid,
                            access_token: data.access_token
                        },
                        success: function (resp) {
                            resolve(resp);
                        },
                        error: function (resp) {
                            reject(resp);
                        }
                    });
                });
                return p;
            }

        },
        forceLogin: function() {
            $('.union-top').on('tap', function() {
                console.log(111);
                window.location.href = "login.html";
            })
            $('.union-list').on('tap', function() {
                window.location.href = "login.html";
            })
        },
        changeInfo: function(data) {
            let info = data.info;
            let linkInfo = data.linkInfo;
            let url = data.url;
            $('.union-info').html(info);
            $('.union-info-link').html(linkInfo+"&nbsp;>");
            $('.union-info-wrap').on('tap', function(ev) {
                console.log(url);
                window.location.href = url;
            })
        },
        materialClick: function() {
            console.log("11111");
            if (this.is_alliance) {
                window.location.href = "myMaterial.html";
            }
        },
        baiduWalletclick: function() {
            if (this.is_alliance) {
                window.location.href = "https://m.baifubao.com/?from=singlemessage&isappinstalled=1";
            }
        },
        myMessageclick: function() {
            if (this.is_alliance) {
                window.location.href = "BaiduNuomiMerchant://mymessagedetail?typeName=公告&typeId=1";
            }
        },
        firstUniondialog: function(data) {
            let name = data.alliance_info.alliance_name || "";
            let num = data.new_num || 0;
            if (num > 0) {
                $.dialog({  
                    showTitle : false,
                    dialogClass: 'firstUnion',
                    contentHtml : '恭喜您加入<br><span>'+ name +'</span><br>成为百度糯米商户联盟第'+ num +'位会员',
                    buttonClass : {
                        ok : 'dialog-font-color-white'
                    }           
                });
            } else {
                $.dialog({  
                    showTitle : false,
                    dialogClass: 'firstUnion',
                    contentHtml : '恭喜您加入<br><span>'+ name +'</span><br>',
                    buttonClass : {
                        ok : 'dialog-font-color-white'
                    }           
                });
            }

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
                    window.location.href = "https://m.baifubao.com/wap/0/wallet/0/cardlist/0";
                },
                onClickCancel: function () {
                    console.log("error");
                }
            });            
        },
        addUniondialog: function(data) {
            // 未加登录判断
             $.dialog({
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
                    BNJS.page.start('BaiduNuomiMerchant://bindingphone?channel=alliance&notificationName=com.nuomi.merchant.broadcast.PERSONALPROFILE&bottomText=填写完成,去退出重新登录', {}, 1);
                },
                onClickCancel: function () {
                }
            });             
        }
	}
}
</script>
