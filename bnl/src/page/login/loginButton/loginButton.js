/**
 * @file loginButton.js
 * @author liuboying (liuboying@baidu.com)
 * @description 根据登录状态更新登录界面样式及提示
 *  登录效果
 */

module.exports.init = function () {
    // 手机号输入框
    var $inputPhone = $('#PASSP__1__mobilenum');
    // 验证码输入框
    var $inputCode = $('#PASSP__1__password');
    // 获取验证码
    var $btnCode = $('.pass-button-send');
    // 登录
    var $btnConfirm = $('#PASSP__1__submit');
    // 重新发送
    var $btnResend = $('.btn-resend');
    // checkbox
    var $checkbox = $('.word input')

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
    if ($checkbox.attr('checked') === true) {
        
    }
     /**
     * 验证手机号是否合法
     *
     * @param {string} phone phone
     * @return {boolean}
     */
    function verifyPhone(phone) {
        return /^1[3|4|5|7|8][0-9]\d{8}$/.test(phone);
    }

};
