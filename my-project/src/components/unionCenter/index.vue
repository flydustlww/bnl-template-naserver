<style lang="less" scoped>
.rem(@name, @px){
    @{name}: @px / 750 * 1rem;
}
.union-wrap {
    .union-top {
        .rem(height, 342);
        background: url('../../page/unionCenter/img/bg.jpg');
        .union-user {
            overflow: hidden;
            .user-img {
                float: left;
                .rem(height, 56);
                .rem(width, 56);
                .rem(margin-top, 34);
                .rem(margin-left, 30);
                .rem(margin-right, 20);
                img {
                    .rem(height, 56);
                    .rem(width, 56);                    
                }
            }
            .user-message {
                float: left;
                p {
                    .rem(font-size, 28);
                    color: #fff;
                    &:nth-child(1) {
                        .rem(line-height, 56);
                        .rem(margin-top, 16);
                    }
                    .user-name {
                    }
                    &.area {
                        .rem(font-size, 24);
                        color: rgba(255, 255, 255, 0.7);
                    }
                }
            }
        }
        .union-number {
            .rem(margin-top, 72);
            ul {
                overflow: hidden;
                li {
                    float: left;
                    color: #fff;
                    text-align: center;
                    .rem(height, 100);
                    .rem(width, 374);
                    div {
                        .rem(font-size, 60);
                    }
                    p {
                        .rem(line-height, 56);
                        .rem(font-size, 24);
                    }
                    &.today {

                    }
                    &.total {

                    }
                }
            }
        }
    }
    .union-list {
        li {
            position: relative;
            .rem(height, 105);
            .rem(line-height, 105);
            .rem(padding-left, 100);
            p {
                .rem(height, 105);
                color: #333;
                .rem(font-size, 32);
            }
            .icon {
                .rem(width, 35);
                .rem(height, 35);
                display: block;
                position: absolute;
                .rem(left, 30);
                .rem(top, 38);
                background-size: 35/750rem 35/750rem;
                background-repeat: no-repeat;
                background-position: center center;
            }            
            .icon-material {
                background-image: url('../../page/unionCenter/img/material.png');
            }
            .icon-baiduwallet {
                background-image: url('../../page/unionCenter/img/baiduwallet.png');
            }
            .icon-message {
                background-image: url('../../page/unionCenter/img/message.png');
            }            
        }
    }
}
</style>

<template>
    <div class="union-wrap">
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
        <a href="BaiduNuomiMerchant://bindingphone?channel=alliance&notificationName=com.nuomi.merchant.broadcast.PERSONALPROFILE&bottomText=填写完成,去退出重新登录" class="quick">去填写角色</a>
    </div>
</template>
<script>
require('widget/global/global.less');
require('../../page/unionCenter/unionCenter.less');
let api = require('../../config/api');
import $ from 'dep/zepto';
let Baidu = require('dep/baiduTemplate');
// 为了兼容该死的华为荣誉6
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
        }
	}
}
</script>
