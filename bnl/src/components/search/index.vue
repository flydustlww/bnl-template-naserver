<style lang="less">
.select-wrap{
   background-color: rgb(242,244,243);
   padding: 22/750rem 24/750rem 0 24/750rem;
   height: 86/750rem;
   position: fixed;
   top: 0px;
   z-index: 100;
   width: 100%;
   .clearlayer{
    position: absolute;
    top: 22/750rem;
    right: 20%;
    display: inline-block;
    height: 55/750rem;
    width: 80/750rem;
   }
   .clear{
    position: absolute;
    top: 18/750rem;
    right: 20%;
    display: inline-block;
    height: 30/750rem;
    width: 30/750rem;
    border-radius: 100%;
    background-color: rgb(204,204,204);
    .clear-close{ 
        display: inline-block;    
        position: absolute;
        right: 25%;
        top: 50%;
        width: 17/750rem;
        height:1px;
        background: #fff;
        line-height: 0;
        font-size:0;
        vertical-align: middle;
        -webkit-transform: rotate(45deg);
    }
    .clear-close:after{
        content:'/';
        display:block;
        width: 17/750rem;
        height:1px; 
        background: #fff;
        -webkit-transform: rotate(-90deg);
    }
   
   }
   .mendian-id-text{
       height: 55/750rem;
       width: 590/750rem;
       padding-left: 0.03125rem;
       font-size: 26/750rem;
       color: rgb(125,125,131);
       background-color: #fff;
       border: 1px solid rgb(239,239,239);
       border-top: none;
       border-radius: 4/750rem;
       position: absolute;
       left: 24/750rem;
   }
   .search{
       margin-left: 24/750rem;
       color: rgb(204,204,204);
       display: block;
       font-size: 28/750rem;
       position: absolute;
       right: 10%;
       display: inline-block;
       height: 55/750rem;
       line-height: 70/750rem;
       // vertical-align: bottom;
   }
   .pink{
    color: rgb(250,50,80);
   }
   .btn-pink{
       background: #ff4978;
       border:0 ;
       color: #fff;
       padding: 0.03125rem 0;
       font-size: 0.04375rem;
   }
   
}
.content-note{
    color: rgb(153,153,153);
    font-size: 24/750rem;
    padding-left: 24/750rem;
    display: block;
    padding-top: 15%;
   
      span.symbol{
        vertical-align: middle;
        line-height: 12/750rem;
      }
    
}

// 搜索结果
.mendian-lists{
    background-color: #fff;
    top: 108/750rem;
    position: absolute;
    // overflow-y: scroll;
    width: 100%;
    // -webkit-overflow-scrolling: touch;   /*这句是为了滑动更顺畅*/
    // height:1248/750rem;
    .list{
        // background-color: #fff;
        height: 130/750rem;
        padding: 0 24/750rem 0 0;
        margin-left: 24/750rem;
        border-bottom: 1px solid rgb(229,229,229);
        position: relative;
        .mendian-name{
            color: rgb(51,51,51);
            font-size: 30/750rem;
            height: 78/750rem;
            line-height: 78/750rem;
        }
        .mendian-id{
            color: rgb(153,153,153);
            font-size: 28/750rem;
            height: 50/750rem;
            vertical-align: top;
        }
        .mendian-bind{
            position: absolute;
            right: 24/750rem;
            top: 40%-24/750rem;
            color: rgb(250,50,80);
            font-size: 24/750rem;

        }
    }
    .lastItem{
      border-bottom: none;
    }

}

// tips
.tips{
    font-size: 28/750rem;
    color: rgb(117,117,117);
    text-align: center;
    height: 625/750rem;
    line-height: 625/750rem;
}
</style>
<template>
	<div>
	<div class="select-wrap" id="select-wrap">
	    <input type="text" id="input" placeholder="请输入门店名称/门店ID" class="mendian-id-text" v-model="mendianInfo" />
	    <div class="clearlayer" @click="clear" v-show='mendianInfo'>
	    	<span class="clear"><span class="clear-close"></span></span>
	    </div>
	    
	    <span class="search" :class="{pink:isPink}" >搜索</span>
	</div>
	<div class="content-note" v-show='isShowNote'>
		<span class="symbol">*</span> <span class="text">门店ID请咨询销售或通过糯米商家app查询</span>
	</div>
	<div class="mendian-lists" id="wrapper" v-show="isShowLists">
		<div class="list" v-for="(item,index) in items "  v-bind:class="{'lastItem': (items.length-1)===index}" @click="bindMaterial(item.alliance_name,item.merchant_id)" >
			<div class="mendian-name">{{item.alliance_name}}</div>
			<div class="mendian-id">门店ID:{{item.merchant_id}}</div>
			<div class="mendian-bind" >+立即绑定</div>
		</div>
	</div>
	<div class="tips" v-show='isShowTps'>没有找到该门店，请先建立该门店联盟</div>
	</div>
</template>
<script>
import $ from 'dep/zepto';
let api = require('../../config/api');
let Baidu = require('dep/baiduTemplate');
// 为了兼容该死的华为荣誉6
let Promise = require('widget/util/es6-promise.js').Promise;
let httpBnjs = require('widget/http/httpBnjs');
let dialog = require('widget/dialog/dialog.js');
let urlParam = require('static/js/urlParam');
let curUid = urlParam.getUrlParam('uid');
let util = require('widget/util/util');
let utilBNJS = require('widget/util/bnjs/util-bnjs'); 
export default {
	name: 'mendian-search',
	data: function(){
		return{
			items: [],
			isShowLists: false,
			mendianInfo: '',
			isShowNote: true,
			isShowTps: false,
			isPink: false,
			lastItem: true,
            token: ""
		}

	},
	mounted: function(){
        let wrapper = document.getElementById('wrapper');
        let input = document.getElementById('input');
        let selectWrap = document.getElementById('select-wrap');

        wrapper.addEventListener('touchmove', function(e) {
            input.blur();
        }, false);
        input.addEventListener('blur',function(e){
            selectWrap.style.position = 'fixed';
            selectWrap.style.top = '0px';

        },false)
        input.addEventListener('focus',function(e){
            selectWrap.style.position = 'absolute';
            selectWrap.style.top = '0px'

        },false)

	},
	watch:{
	    mendianInfo:function(val,oldVal){
            util.ready(function(){
                let that = this;
                let uid = typeof(BNJS.account.uid) === "number" ? BNJS.account.uid : 0;
                let bdussStroage = res;
                let params = function(){
                    let _params = {}
                    if(/^[0-9]*$/.test(that.mendianInfo)){
                        _params = {
                            merchant_id: that.mendianInfo,
                            bduss: bdussStroage,
                            b_uid: uid
                        }
                    }else{
                        _params = {
                            name: that.mendianInfo,
                            bduss: bdussStroage,
                            b_uid: uid
                        }
                    }
                    return _params;
                };
                // 删除或不填
                if(val === '') {
                    that.isShowNote = true;
                    that.isShowTps = false;
                    that.isPink = false;
                    that.isShowLists = false;
                    that.items = [];
                    return;
                } else {
                    // 输入
                    that.isShowLists = true;
                    that.isShowNote = false;
                    httpBnjs.get({
                        url: api.searchmerchant,
                        params: params()                   
                    })
                    .then(function(res){
                        if (res.length === 0){
                            that.isShowLists=false;
                            that.isShowTps = true;
                            that.items = res;
                        }else{
                            that.isShowTps = false;
                            that.isShowLists = true;      
                            that.items = res.slice(0,20);
                        }
                        if (errno === 2002) {
                            BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=login", {});
                        }
                        
                    },function(res){
                        $.dialog({
                            showTitle : false,
                            contentHtml : res.msg||'出错了!',
                            buttonClass : {
                                ok : 'dialog-font-color-pink'
                            }
                        });
                    })
                    that.isPink = true;               
                }
            })
	    }
	},
	methods:{
	    clear:function() {
	        this.mendianInfo = '';
	        this.items = [];
	    },
	    bindMaterial:function(name,merchart_id){
            var _this = this;
            util.ready(function() {
                BNJS.hardware.scanQRCode(function(res) {
                    let url = res.data.content;
                    let result = util.parseQueryString(url);
                    let code_id = result.id;
                    httpBnjs.get({
                        url: api.bindcode,
                        params: {
                            code_id: code_id,
                            product: 5
                        }                  
                    })                    
                    .then(function(resp) {
                        if (resp.errno === 2002) {
                            $.dialog({
                                showTitle : false,
                                contentHtml : resp.msg,
                                buttonClass : {
                                    ok : 'dialog-font-color-pink'
                                },
                                onClickOk: function() {
                                    BNJS.page.start("BaiduNuomiMerchant://component?compid=bnl&comppage=login", {});
                                }
                            });
                        } else {
                            $.dialog({
                                showTitle : false,
                                contentHtml : resp.msg,
                                buttonClass : {
                                    ok : 'dialog-font-color-pink'
                                },
                                onClickOk: function() {
                                }
                            });
                        }
                    }, function(res) {
                        BNJS.ui.showErrorPage();
                    })                
                });
            });

	    }
	}
}
</script>
