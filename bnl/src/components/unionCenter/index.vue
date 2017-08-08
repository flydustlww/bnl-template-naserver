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
            <li class="my-material" v-on:click="materialClick"><span class="icon icon-material"></span><p class="border-bt">我的物料</p></li>
            <li class="baiduwallet" v-on:click="baiduWalletclick"><span class="icon icon-baiduwallet"></span><p class="border-bt">百度钱包</p></li>
            <li class="my-message" v-on:click="myMessageclick"><span class="icon icon-message"></span><p class="border-bt">我的消息</p></li>
        </ul>
    </div>
</template>
<script>
require('widget/global/global.less');
require('../../page/unionCenter/unionCenter.less');
import $ from 'dep/zepto';
let api = require('../../config/api');
let server = require('../../config/server').server;
let merchantlogin = encodeURIComponent(server + '/naserver/newapp/merchantlogintpl');
let FastClick  = require('dep/fastclick/index.js');
let Promise = require('widget/util/es6-promise.js').Promise;
let Baidu = require('dep/baiduTemplate');
let dialog = require('widget/dialog/dialog.js');
let util = require('widget/util/util');
let utilBNJS = require('widget/util/bnjs/util-bnjs.js');
let httpBnjs = require('widget/http/httpBnjs');

FastClick.attach(document.body, {});
export default {
	name: 'union-center',
	data: function(){
		return{
            isLogin: false,
            is_alliance: false,
            isInfo: false,
            is_new: 0,
            is_verified: '',
            new_num: 1,
            total_amount: '',
            merchant_name: '',
            passport_username: "",
            promote_count: '',
            today_commission: "---",
            total_commission: "---",
            alliance_name: "",
            uid: 0,
            curTime: ''
		}
	},
    created: function(){
        let _this = this;
        util.ready(function(){
            _this.getData();
        })
    },
	methods: {
        getData: function() {
            let that = this;
            this.uid = typeof(BNJS.account.uid) === "number" ? BNJS.account.uid : 0;
            // 请求checkuserinfo,请求myuserinfo
            let curTimeDate = new Date();
            this.curTime = curTimeDate.getTime();
            httpBnjs.get({
                url: api.checkuserinfo,
                params: {
                    b_uid: that.uid,                
                }
            })
            .then(function(res) {
                return that.checkuserInfoOk(res);
            }, function(res) {
                console.log(JSON.stringify(res));
                BNJS.page.start("BaiduNuomiMerchant://component?url=" + merchantlogin, {}, 1);
            })
            .then(function(res) {
                that.myuserInfoOk(res);
            }, function(res) {
                BNJS.ui.showErrorPage();
            });
        },
        checkuserInfoOk: function(res) {
            // 拿到登录的数据
            console.log("登录的数据")
            console.log(res);
            let that = this;
            // 如果登录状态
            switch (res.errno) {
                // 已登录
                case 0:
                    {
                        // 判断加入联盟弹窗
                        if (res.data.is_new === 1) {   // 首次加入联盟
                            that.is_new = 1;
                            that.firstUniondialog(res.data);
                        }
                        if (res.data.alliance_info.alliance_name) {
                            that.is_alliance = true;
                        }

                        return httpBnjs.get({
                            url: api.myuserinfo,
                            params: {
                                b_uid: that.uid                    
                            }
                        })
                        break;
                    }
                // 未登录
                case 2002:
                    {
                        that.isLogin = false;
                        that.forceLogin();
                        break;
                    }
                // 未加入联盟
                case 70150:
                    {
                        // 未加入联盟
                        that.is_alliance = false;
                        that.isInfo = true;
                        that.isLogin = true;
                        BNJS.localStorage.getItem('bnl_allianceFlag', function(res){
                            console.log("拿到storage返回值==");
                            console.log(res);
                            if (res.data == "") {
                                that.addUniondialog();                           
                                BNJS.localStorage.setItem('bnl_allianceFlag', {
                                        name: "ok",
                                        time: that.curTime
                                }, function(){
                                    console.log("成功添加storage")
                                }, function(){
                                    console.log('添加失败')
                                });
                            } else {
                                if (new Date().getTime() - res.data.time > 30000) {
                                    BNJS.localStorage.removeItem('bnl_allianceFlag', function(){}, function(){}); 
                                }
                            }
                            
                        }, function(res) {
                            BNJS.ui.hideLoadingPage();
                            that.addUniondialog();                           
                            BNJS.localStorage.setItem('bnl_allianceFlag', {
                                    "name": "ok",
                                    "time": that.curTime
                            }, function(){}, function(){});
                        }, '2.7');                       

                        that.changeInfo({
                            info: "您尚未填写角色，故无法加入联盟",
                            linkInfo: "去填写角色",
                            url: "BaiduNuomiMerchant://bindingphone?channel=alliance&notificationName=com.nuomi.merchant.broadcast.PERSONALPROFILE&bottomText=填写完成,去退出重新登录"
                        });
                        return httpBnjs.get({
                            url: api.myuserinfo,
                            params: {
                                b_uid: that.uid                
                            }
                        })
                        break;                          
                    }
                case 1004:
                    {
                        BNJS.page.start("BaiduNuomiMerchant://component?url=" + merchantlogin, {}, 1);
                        break;
                    }
                case 2001: 
                    {
                        BNJS.page.start("BaiduNuomiMerchant://component?url=" + merchantlogin, {}, 1);
                        break;                       
                    }
                default:
                    {
                        BNJS.ui.showErrorPage();
                    } 
            }
        },
        myuserInfoOk: function(res) {
            if (res) {
                // 拿到用户的数据
                console.log("用户的数据")
                console.log(res);
                let datas = util.cloneObj(res.data);
                let that = this;
                switch (res.errno)
                {
                    case 0: 
                    {
                        that.isLogin = true;
                        // 添加点击跳转个人中心事件
                        $('.union-user').on('click', function () {
                            let url = "BaiduNuomiMerchant://component?compid=bnl&comppage=userCenter";
                            BNJS.page.start(url, {});
                        })
                        if (res.data.alliance_name === "") {
                            that.alliance_name = "未加入联盟";
                            that.passport_username = datas.passport_username;
                        } else {                         
                            that.is_verified = datas.is_verified;
                            that.alliance_name = datas.alliance_name;
                            that.merchant_name = datas.merchant_name;
                            that.passport_username = datas.passport_username;
                            that.today_commission = datas.today_commission;
                            that.total_commission = datas.total_commission;
                            $('.today').on('click', function () {
                                let url = "BaiduNuomiMerchant://component?compid=bnl&comppage=dailyBilling";
                                BNJS.page.start(url, {});
                            });
                            $('.total').on('click', function () {
                                let url = "BaiduNuomiMerchant://component?compid=bnl&comppage=totalReward";
                                BNJS.page.start(url, {});
                            });                            
                        }
                        // 判断是否认证
                        if (that.is_verified === 0) {
                            that.isInfo = true;
                            let verifiedUrl = encodeURIComponent("https://m.baifubao.com/wap/0/wallet/0/cardlist/0");
                            that.changeInfo({
                                info: "您尚未实名认证，将无法进行佣金结算",
                                linkInfo: "立即认证",
                                url: "BaiduNuomiMerchant://component?url=" + verifiedUrl
                            })
                            // 认证弹窗暂时不需要了 未添加48小时弹窗
                            // that.addVertifydialog();
                        }

                        break;                      
                    }
                    case 2002: 
                    {
                        that.isLogin = false;
                        that.forceLogin();
                        break;
                    }
                    default:
                    BNJS.ui.showErrorPage();
                }
            } else {
                return ;
            }
          
        },   
        forceLogin: function() {
            $('.union-top').on('click', function() {
                BNJS.page.start("BaiduNuomiMerchant://component?url=" + merchantlogin, {}, 1);
            })
            $('.union-list').on('click', function() {
                BNJS.page.start("BaiduNuomiMerchant://component?url=" +merchantlogin, {}, 1);
            })
        },
        changeInfo: function(data) {
            let info = data.info;
            let linkInfo = data.linkInfo;
            let url = data.url;
            $('.union-info').html(info);
            $('.union-info-link').html(linkInfo+"&nbsp;>");
            $('.union-info-wrap').on('tap', function(ev) {
                BNJS.page.start(url, {});
            })
        },
        materialClick: function() {
            if (this.is_alliance) {
                BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=myMaterial", {});
            }
        },
        baiduWalletclick: function() {
            if (this.is_alliance) {
                let url = encodeURIComponent("https://m.baifubao.com/?from=singlemessage&isappinstalled=1");
                BNJS.page.start("BaiduNuomiMerchant://component?url=" + url, {});
            }
        },
        myMessageclick: function() {
            if (this.is_alliance) {
                BNJS.page.start("BaiduNuomiMerchant://mymessagedetail?typeName=公告&typeId=1", {});
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
                    },
                    buttonText: {
                        ok: '我知道了'
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
                    window.location.href = encodeURIComponent("https://m.baifubao.com/wap/0/wallet/0/cardlist/0");
                    BNJS.page.start("BaiduNuomiMerchant://component?url=" +url, {});
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
                    BNJS.page.start('BaiduNuomiMerchant://bindingphone?channel=alliance&notificationName=com.nuomi.merchant.broadcast.PERSONALPROFILE&bottomText=填写完成,去退出重新登录', {});
                },
                onClickCancel: function () {
                }
            });             
        }
    }
}
</script>
