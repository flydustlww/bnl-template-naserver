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
		<div class="list" v-for="(item,index) in items "  v-bind:class="{'lastItem': (items.length-1)===index}" @click = "bindMaterial(item.alliance_name,item.merchant_id)" >
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
let dialog = require('widget/dialog/dialog.js');
let urlParam = require('static/js/urlParam');
let curUid = urlParam.getUrlParam('uid');
let util = require('widget/util/util'); 
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
	        let that = this;
	            // 删除或不填
	        if(val === '') {
	            that.isShowNote = true;
	            that.isShowTps = false;
	            that.isPink = false;
	            that.isShowLists = false;
	            that.items = [];
	            return;
	        }else{
	            // 输入
	            that.isShowLists = true;
	            that.isShowNote = false;
                $.ajax({
                    url: api.gettoken,
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        that.token = res.data;
                        new Promise(that.getSearchData).then(function(res){
                                if (res.length === 0){
                                    that.isShowLists=false;
                                    that.isShowTps = true;
                                    that.items = res;
                                }else{
                                    that.isShowTps = false;
                                    that.isShowLists = true;      
                                    that.items = res.slice(0,20);
                                }
                                
                            },function(res){
                                $.dialog({
                                    showTitle : false,
                                    contentHtml : res.msg||'出错了!',
                                    buttonClass : {
                                        ok : 'dialog-font-color-pink'
                                    }
                                });
                            }).catch(function (res) {
                            BNJS.ui.showErrorPage("拼命加载中");
                        });

                        that.isPink = true;                        
                    },
                    error: function (res) {
                    }
                });
	        }      
	    }
	},
	methods:{
	    clear:function() {
	        this.mendianInfo = '';
	        this.items = [];
	    },
	    bindMaterial:function(name,merchart_id){
	        // window.location.href = 'band://web?type=materials_binding&deal_id='+'&deal_name='+name+'&deal_statu=在线&merchant_id='+merchart_id+'&product=5';

            /**
            'access_token'  "",
            'code_id'     "",  
            'product'     5,  //产品类型
            */
            var _this = this;
            util.ready(function(BNJS) {
                BNJS.hardware.scanQRCode(function(res) {
                    let url = res.data.content;
                    let result = _this.parseQueryString(url);
                    let code_id = result.id;
                    let pN = new Promise(function (resolve, reject) {
                        $.ajax({
                            url: api.gettoken,
                            type: 'GET',
                            dataType: 'json',
                            success: function (res) {
                                _this.token = res.data;
                                resolve();
                            },
                            error: function (res) {
                                console.log(res);
                                reject(res);
                            }
                        });
                    }).then(res => httpAjax(api.bindcode, {
                            access_token: _this.token,
                            code_id: code_id,
                            product: 5
                        })).catch(function(){
                        BNJS.ui.showErrorPage("拼命加载中");
                    }).then(function(resp){
                        $.dialog({
                            showTitle : false,
                            contentHtml : resp.msg,
                            buttonClass : {
                                ok : 'dialog-font-color-pink'
                            },
                            onClickOk: function() {
                                //window.location.reload();
                                console.log('q');
                            }
                        });    
                    })

                    function httpAjax(url, data) {
                        let params = data;
                        var p = new Promise(function (resolve, reject) {
                            $.ajax({
                                url: url,
                                type: 'POST',
                                dataType: "json",
                                data: params,
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
                })
            })

	    },
        parseQueryString: function (url) {
             var reg_url = /^[^\?]+\?([\w\W]+)$/,
                  reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
                  arr_url = reg_url.exec(url),
                  ret = {};
             if (arr_url && arr_url[1]) {
                  var str_para = arr_url[1], result;
                  while ((result = reg_para.exec(str_para)) != null) {
                       ret[result[1]] = result[2];
                  }
             }
             return ret;
        },       
	    // 获取检索数据
	    getSearchData: function(resole,reject){
	        let that = this;
	        let params = function(){
	            let _params = {}
	            if(/^[0-9]*$/.test(that.mendianInfo)){
	                _params = {
	                    merchant_id: that.mendianInfo
	                }
	            }else{
	                _params = {
	                    name: that.mendianInfo
	                }
	            }
                _params.access_token = that.token;
	            return _params;
	        };
	        $.ajax({
	            url: api.searchmerchant,
	            type: 'GET',
	            dataType: 'json',
	            data: params(),
	            success: function(res){
	                resole(res.data)
	            },
	            error: function(res){
	                reject(res)
	            }
	        })    
	        
	    }
	}
}
</script>
