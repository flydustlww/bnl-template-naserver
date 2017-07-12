<template>
    <div class="list">
        <div class="poi-item border-tp border-bt mt10" v-for="item in list">
            <a class="poi-head">
                <div class="poi-item-img-wrap fl" :style="{ backgroundImage: 'url(' + item.poi_image +')' }">
                    <div class="poi-item-img">
                        <span class="icon-freedom"></span>
                    </div>
                </div>

                <div class="poi-item-info">
                    <span class="fr gray9" v-if="item.source == 1">推广</span>

                    <h2>
                        <p>
                            <span class="title-tag fr">
                                <em class="bg-orange" v-if="item.is_t10 && item.is_t10 == 1">精</em>
                                <em class="bg-blue" v-if="item.is_Nbd_Appoint && item.is_Nbd_Appoint == 1">预</em>
                            </span>
                            <span class="title-txt">
                                
                            </span>
                        </p>
                    </h2>

                    <p class="poi-item-ugc gray9" v-if="item.ugc && item.ugc.average_score">
                        <span class="ugc-star" :style="{width: item.ugc.average_score / 5 * 72 + 'px'}"></span>
                        <span class="ugc-star-gray"></span>
                    </p>
                    <p class="poi-item-ugc gray9" v-else>
                        暂无评分
                    <p>

                    <p class="poi-item-price gray9" v-if="item.poi_price_show">
                        &yen;&nbsp;&nbsp;/人

                        <span class="fr">
                            
                        </span>
                    </p>
                </div>
            </a>

            <div class="poi-body">
                <a href="javascript:void(0);" class="poi-deal-item" v-for="el in item.tuan_list">
                    <div class="poi-deal-item-price fl">
                        <p class="poi-deal-item-price-num">
                            <span class="ori-pirce gray9" v-if="el.market_price_show"></span>&nbsp;

                            <span class="now-price" v-if="el.cur_price_show"><span class="font12">&yen;&nbsp;</span></span>
                        </p>
                    </div>
                    <div class="poi-deal-item-info">
                        <span class="poi-deal-item-desc gray6"></span>
                        <span class="poi-deal-item-sold gray9" v-if="el.sale_count_show"></span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'dep/zepto';

export default {
    props: {
        list: Array
    },
    methods: {
        bindEvent: function () {



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
    watch: {
        list: function () {
            if(this.list.length){
                this.bindEvent();
            }
        }

//        list () {
//            if(this.list.length){
//                this.bindEvent();
//            }
//        }
    },
    ready () {
    }
}

</script>

<style lang="less">
    @import "~widget/util/util.less";
    .poi-item{
        width: 100%;
        height: auto;
        overflow: hidden;
        background-color: #FFF;

        &:first-child {
            margin-top: 0;
        }

        .poi-head {
            display: block;
            height: 58px;
            padding: 10px;

            .poi-item-img-wrap {
                width: 78px;
                height: 58px;
                overflow: hidden;
                .lgimg-default(@w: 78px);
            }

            .poi-item-img {
                position: relative;
                width: 100%;
                height: 100%;
                z-index: 1;
                background-position: center center;
                background-size: auto 58px;

                span {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 10;
                    width: 36px;
                    height: 36px;
                    -webkit-background-size: 36px 36px;
                    background-size: 36px 36px;
                }

                .icon-freedom {
                    background-image: url('./img/icon_freedom.png');
                }

            }

            .poi-item-info {
                margin-left: 88px;

                h2 {
                    height: 16px;
                    line-height: 16px;
                    clear: none;
                    overflow: hidden;
                    font-weight: normal;

                    p {
                        display: inline-block;
                        max-width: 100%;
                        height: 16px;
                    }

                    .title-txt {
                        display: block;
                        font-size: 16px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    .title-tag {
                        display: block;
                        margin-left: 10px;
                        font-size: 0;
                    }

                    em {
                        position: relative;
                        display: inline-block;
                        width: 12px;
                        left: 0;
                        top: 0;
                        padding: 3px 2px 2px 2px;
                        margin-right: 5px;
                        font-size: 11px;
                        line-height: 100%;
                        text-align: center;
                        border-radius: 2px;
                        vertical-align: top;

                        &.bg-orange {
                            color: #FFF;
                            background-color: #FF7E00;
                        }

                        &.bg-blue {
                            color: #FFF;
                            background-color: #56B1FF;
                        }

                        &.bg-pink {
                            color: #FFF;
                            background-color: #FF6B9C;
                        }

                    }
                }

            }

            .poi-item-ugc {
                position: relative;
                width: 100%;
                height: 12px;
                line-height: 12px;
                margin: 9px 0;

                span {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 71px;
                    height: 12px;
                    background-position: top left;
                    background-size: auto 12px;
                    background-repeat: no-repeat;
                }

                .ugc-star {
                    z-index: 10;
                    background-image: url('./img/star_orange.png');
                }

                .ugc-star-gray {
                    z-index: 9;
                    background-image: url('./img/star_gray.png');
                }

            }

            .poi-item-price {
                height: 12px;
                line-height: 12px;
            }

        }

        .pay-at-shop {
            display:block;
            height: 18px;
            line-height: 18px;
            margin: 0 0 0 10px;
            padding-bottom: 10px;

            .pay-at-shop-icon {
                display: block;
                width: 60px;
                height: 18px;
                margin-left: 18px;
                background-image: url('./img/pay_at_shop.png');
                background-size: cover;
                background-position: 50% center;
            }

            .pay-at-shop-desc {
                display: block;
                height: 18px;
                margin: 0 19px 0 88px;

                .pay-at-shop-desc-wrap {
                    display: inline-block;
                    max-width: 100%;
                    height: 18px;

                }

            }

            .pay-at-shop-title {
                display: block;
                margin-right: 16px;
                height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .pay-at-shop-arrow {
                display: inline-block;
                width: 6px;
                height: 18px;
                background: url('./img/icon_arrows_gray_right.png') center center no-repeat;
                background-size: 6px 12px;
            }

        }

        .poi-body {
            display: block;
            width: 100%;
            max-height: 105px;
            overflow: hidden;

            .poi-deal-item {
                display: block;
                margin-left: 10px;
                height: auto;
                overflow: hidden;
                background: url("./img/line_dashed.png") left top repeat-x;
                background-size: auto 1px;

                &:first-child {
                    background: none;
                }


                &:active {
                    background-color: #F6F6F6;
                }

            }

            .poi-deal-item-price {
                width: 78px;
                overflow: hidden;

                .poi-deal-item-price-num {
                    line-height: 16px;
                    height: 16px;
                    margin: 9px 0 2px 0;
                    overflow: hidden;
                    text-align: right;

                    .ori-pirce {
                        text-decoration:line-through;
                    }

                    .now-price {
                        font-size: 16px;
                        color: #F24;

                        span {
                            font-size: 12px;
                        }

                    }

                }

                .poi-deal-item-promotion {
                    height: 16px;
                    text-align: right;
                    overflow: hidden;

                    em {
                        position: relative;
                        display: inline-block;
                        left: 0;
                        bottom: 0;
                        padding: 3px 3px 2px 3px;
                        font-size: 9px;
                        line-height: 100%;
                        text-align: center;
                        border-radius: 2px;
                        vertical-align: top;
                        border: 1px solid #F24;
                        color: #F24;

                        &.ios {
                            padding: 2px 3px 3px 3px;
                        }
                    }

                }
            }

            .poi-deal-item-info {
                display: block;
                position: relative;
                margin: 7px 10px 4px 88px;
                height: 40px;

                .poi-deal-item-desc {
                    display: inline-block;
                    font-size: 13px;
                    height: 40px;
                    line-height: 20px;
                    overflow: hidden;
                }

                .poi-deal-item-sold {
                    position: absolute;
                    right: 0;
                    bottom: 1px;
                    font-size: 12px;
                }

            }

        }

        .poi-footer {
            display: block;
            margin-left: 10px;
            padding: 10px 10px 10px 0;
            font-size: 13px;
            line-height: 16px;
            text-align: center;

            i {
                display: inline-block;
                width: 11px;
                height: 6px;
                margin-left: 10px;
                position: relative;
                top: -2px;
                background: url("./img/arrow_down.png") left top repeat-x;
                background-size: 11px 6px;
            }

        }

        &.poi-item-show {

            .poi-body {
                max-height: none;
            }

            .poi-footer {
                display: none;
            }

        }

    }
</style>
