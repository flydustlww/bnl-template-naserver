/**
 * @file login.js
 * @author liuboying (liuboying@baidu.com)
 * @description
 *  登录效果
 */

module.exports.init = function  () {
    // body...
    var $btnsms = $('.btn-sms');
    var $view = $('#view');

    // 如果未登录
    // var $textPassport = $('.passport-text');
    var $inputPhone = $('#PASSP__1__mobilenum');
    var $inputCode = $('#PASSP__1__password');
    var $rowCode = $('#PASSP__1__password'); //验证码输入框
   // var $rowPhone = $('#PASSP__1__mobilenum'); //手机号输入框
    var $btnCode = $('.pass-button-send'); //获取验证码 重发提示
    var $btnConfirm = $('#PASSP__1__submitWrapper');
    var $btnResend = $('.btn-resend');

    // 绑定手机号输入事件
    $inputPhone.on('input', function () {
        var phone = $inputPhone.val();
        if (verifyPhone(phone)) {
            $btnCode.removeClass('button-inactive');
        }
        else {
            $btnCode.addClass('button-inactive');
        }
    });

    // 绑定验证码输入事件
    $inputCode.on('input', function () {
        var code = $inputCode.val();
        if (code) {
            $btnConfirm.removeClass('button-inactive');
        }
        else {
            $btnConfirm.addClass('button-inactive');
        }
    });

    // 绑定获取验证码按钮点击事件
    $btnCode.on('click', function () {
        if ($btnCode.hasClass('button-inactive')) {
            return;
        }

        sms();
    });

    // 绑定重发按钮的事件
    $btnResend.on('click', function () {
        if ($btnResend.hasClass('disable')) {
            return;
        }

        sms();
    });

    // 绑定绑定事件
    $btnConfirm.on('click', function () {
        if ($btnConfirm.hasClass('button-inactive')) {
            return;
        }
      //form submit
      //  login();
    });

    // $textPassport.on('click', '.change-phone', function () {
    //     stopSms();
    // });

    // 绑定captcha 输入事件
    // $('#view').on('input', '.input-captcha', function () {
    //     var $btnreceive = $('.btn-receive');
    //     var code = $('.input-captcha').val();
    //     if (code) {
    //         $btnreceive.removeClass('button-inactive');
    //     }
    //     else {
    //         $btnreceive.addClass('button-inactive');
    //     }
    // });
    // 发送防黄牛验证码，
    // $('#view').on('click', '.btn-sms', function () {
    //     if ($btnsms.hasClass('disable')) {
    //         return;
    //     }
    //     sendCaptcha();
    // });

    // // 发送防黄牛验证码，
    // $('#view').on('click', '.btn-receive', function () {
    //     if ($('.btn-receive').hasClass('disable')) {
    //         return;
    //     }
    //     bindByCaptcha({
    //         hasCaptcha: true
    //     });
    // });

     /**
     * 验证手机号是否合法
     *
     * @param {string} phone phone
     * @return {boolean}
     */
    function verifyPhone(phone) {
        return /^1[3|4|5|7|8][0-9]\d{8}$/.test(phone);
    }


    /**
     * 获取passport手机验证码
     */
    function sms() {
        var phone = $inputPhone.val();
        var phoneNumber = phone;

        // 更改文案
        // $textPassport.html('<span class="phone-number">领券手机号：'
        //     + phone);
        //    + '<i class="change-phone">更改</i></span>');
        //动态密码发送成功 提示隐藏
      //  $("#PASSP__1__msgWrapper").hide();
        // 隐藏手机号
      // $rowPhone.css({ opacity:0, position: 'absolute',top:'-999rem'});// $rowPhone.hide();
        // 显示验证码行
        $rowCode.show();
      // $btnCode.css({width:'6.70rem','margin-left': '0.25rem','background': '0,0','border': '1px solid #fff', 'color': '#fff',    'opacity': '.8','padding':0});
        // 更改重发按钮的样式
        // $btnResend.html('重发(60)');
        // // 禁止发送验证码按钮
        // $btnResend.addClass('disable');
        // // 隐藏获取验证码按钮
        // $btnCode.hide();
        // 显示确认提交按钮
        $btnConfirm.css('display', 'block');

        // 通过计算时间差来计算时间
        // var time = Math.floor(Date.now() / 1000);
        // interval = setInterval(function () {
        //     var now = Math.floor(Date.now() / 1000);

        //     var offset = 60 - now + time;
        //     if (offset <= 0) {
        //         stop();
        //         return;
        //     }
        //     $btnResend.html('重发(' + offset + ')');
        // }, 1000);

        // function stop() {
        //     clearInterval(interval);
        //     $btnResend.removeClass('disable');
        //     $btnResend.html('重发短信');
        // }

        // // 发送手机号
        // var dfd = passport.sms(phone);
        // dfd.fail(function (data) {
        //     toast.show(data.err_msg);
        //     stop();
        // });
    }

    // function bindRule() {
    //     $('body').on('click', '.rule-link, .rule .close, .x-dialog-mask', function () {
    //         toggleRule();
    //         return false;
    //     });
    // }

    // var $rule = $('.rule');
    // var ruleHeight = $('.rule-content').height();
    // var $mask = $('.x-dialog-mask');

    // /**
    //  * 显示或者隐藏活动规则
    //  */
    // function toggleRule() {
    //     if ($rule.hasClass('hided')) {
    //         $mask.removeClass('hided'); 
    //         var maskheight = $(window).height() +$(window).scrollTop() ; 
    //         $mask.css({"height":maskheight});

    //         $rule.removeClass('hided');
    //         $rule.height(ruleHeight);
    //     }
    //     else {
    //         $rule.addClass('hided');
    //         $mask.addClass('hided');
    //         $rule.height(0);
    //     }
    // }
    // bindRule();

}
