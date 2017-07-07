/**
 * 跳转支付页面收拢组件
 * @author zhangyijun02@baidu.com
 * @use require('common/util/bnjs/startPay')
 */
var util = require('common/util/util');
var utilBNJS = require('common/util/bnjs/util-bnjs');
var $ = require('dep/zepto');
var api = require('widget/config/api');

// 需要透传给server的固定参数
var staticParams = {
    deliveryCost: 0, // 物流单邮费，未用传0
    promoMoney: 0, // 优惠价格
    activityId: 0, // 平台营销活动ID
    signType: 1, // 客户端透传、生成签名校验需要1：MD5， 2：SHA-1
    customerId: 4, // 客户端透传、生成签名校验需要4
    sdk: 1, // 客户端透传、生成签名校验需要
    service: 'cashier'
};

/**
 * 兼容各种入口，跳转至钱包支付页面
 * @param  {Object} options
 *                  如果是创建订单流程，options为创建订单表单中的用户参数
 *                  如果是其他流程（如订单列表中的去支付），options需包含orderId
 */
var jumpPay = function (options, callbacks) {

    var options = options || {};
    var callbacks = callbacks || {};
    var targetUrl = '';
    staticParams.deviceType = utilBNJS.getDeviceType();
    if (options.orderId) { // 有orderId，走继续支付流程
        staticParams.logpage = 'OrderPay';
        targetUrl = api.pay;
    } else if (options.arrivalDate && options.money) { // 创建订单流程，走新支付流程
        staticParams.logpage = 'OrderSubmit';
        targetUrl = api.ordercreate;
    }
    if (staticParams.logpage) {
        if (__DEV__) {
            console.log($.extend(options, staticParams));
        }
        utilBNJS.postNA({
            url: targetUrl,
            params: $.extend(options, staticParams),
            checklogin: true,
            loginSuccess: callbacks.loginSuccess || util.doNothing
        }).then(function (data) {
            if (callbacks.onOrderSuccess) {
                callbacks.onOrderSuccess();
            }
            // data = {
            //     customerId : 170,
            //     deviceType : 1,
            //     itemInfo   : '[{"id":1,"name":"星美五折会员卡","price":20000,"number":1}]',
            //     mobile     : '15618594235',
            //     notifyUrl  : 'http://cq01-rdqa-dev082.cq01.baidu.com:8080/api/lbsCallback/payCallback',
            //     orderCreateTime: '1426049254',
            //     originalAmount : 20000,
            //     passuid : '310253156',
            //     payAmount : 20000,
            //     orderId : '300186',
            //     sdk : 1,
            //     service : 'cashier',
            //     title : '星美五折会员卡',
            //     sign: '7a7a478962e01054a5ac5cc8af220fd9',
            //     signType: 1
            // };
            // 创建订单成功，跳转至确认订单页
            BNJS.page.startPay($.extend(data, {
                onSuccess: function () {
                    // 回调server通知付款成功
                    // utilBNJS.postNA({
                    //     url: api.orderresult,
                    //     params: {
                    //         orderId: data.orderId,
                    //         logpage: 'OrderResult'
                    //     }
                    // }).then(function (data) {
                    //     if (callbacks.onPaySuccess) {
                    //         callbacks.onPaySuccess();
                    //     }
                    //     // do nothing
                    // }).catch(function (err) {
                    //     if (__DEV__) {
                    //         console.log('err:', err);
                    //     }
                    // });

                    if (callbacks.onPaySuccess) {
                        callbacks.onPaySuccess();
                    }
                    BNJS.page.start('bainuo://component?compid=pinecone_reserve&comppage=pay_success', {
                        orderId: data.orderId
                    }, 1);
                },
                onCancel: function () {
                    if (callbacks.onPayFail) {
                        return callbacks.onPayFail();
                    }
                    // BNJS.ui.toast.show('支付失败~');
                }
            }));
        }).catch(function (err) {
            if (__DEV__) {
                console.log('err:', err);
            }
            if (callbacks.onOrderFail) {
                return callbacks.onOrderFail(err);
            }

            BNJS.ui.toast.show(err.errmsg);
        });
    }
};

module.exports = {
    jumpPay: jumpPay
};
