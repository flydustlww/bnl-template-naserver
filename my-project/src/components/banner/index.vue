<style lang="less">
@import "~common/util/util.less";
.m-banner-slider {
    background: #fff;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    overflow: hidden;

    .inner {
        position: relative;
        overflow: hidden;
        .img-full(@ratio: 21%);
    }
    .sliders {
        visibility: hidden;
    }
    .sliders,
    .holder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lgimg-default(@w: 60px);
        .img-bg {
            height: 100%;
            background-size: 100%;
            background-repeat: no-repeat;
        }
    }
    .pointers {
        position: absolute;
        bottom: 8px;
        width: 100%;
        text-align: center;
        height: 8px;
        line-height: 8px;
        i {
            display: inline-block;
            margin-left: 5px;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            box-sizing: border-box;
            border: 1px solid #fff;
            &.active {
                background: white;
            }
            &:first-child {
                margin-left: 0;
            }
        }
    }
}
</style>

<template>
    <div id="j-banner" class="m-banner-slider border-tp">
    	<div class="inner">
    		<ul class="sliders">
    		    <li v-for="item in list"
    		        class="holder j-link"
    	            @click="openPage($index)">
    	            <div class="img-bg j-lazyimg" data-background=""></div>
    	        </li>
    	    </ul>
    	    <div class="pointers"></div>
        </div>
    </div>
</template>

<script>
import $ from 'dep/zepto';
import swipe from 'dep/swipe';
import lazyload from 'common/util/lazyload/lazyload';

export default {
    props: {
        list: Array
    },
    methods: {
        bindEvent: function () {
            let wrapper = $('#j-banner');
            let sliders = wrapper.find('.sliders');
            let pointers = wrapper.find('.pointers');

            swipe(sliders[0], {
                startSlide: 0,
                continuous: true,
                auto: 3000,
                pointers: pointers[0]
            });

            lazyload.init('.j-lazyimg', {
                context: wrapper[0],
                dataAttribute: 'background'
            });
        },
        openPage: function (index) {
            if (this.list[index].targetUrl) {
                BNJS.page.start(this.list[index].targetUrl);
                 var ev = window.event;
                ev = ev || window.event;
                ev.stopPropagation();
                ev.preventDefault();
                return false;
            }
        }
    },
    watch:{
        list () {
            if(this.list && this.list.length){
                this.bindEvent();
            }
        }
    },
    ready () {
    }
}
</script>
