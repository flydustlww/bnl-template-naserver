// //////////////////////////////////////////////////////////////////
//                            _ooOoo_                             //
//                           o8888888o                            //
//                           88" . "88                            //
//                           (| ^_^ |)                            //
//                           O\  =  /O                            //
//                        ____/`---'\____                         //
//                      .'  \\|     |//  `.                       //
//                     /  \\|||  :  |||//  \                      //
//                    /  _||||| -:- |||||-  \                     //
//                    |   | \\\  -  /// |   |                     //
//                    | \_|  ''\---/''  |   |                     //
//                    \  .-\__  `-`  ___/-. /                     //
//                  ___`. .'  /--.--\  `. . ___                   //
//                ."" '<  `.___\_<|>_/___.'  >'"".                //
//              | | :  `- \`.;`\ _ /`;.`/ - ` : | |               //
//              \  \ `-.   \_ __\ /__ _/   .-` /  /               //
//        ========`-.____`-.___\_____/___.-`____.-'========       //
//                             `=---='                            //
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^      //
//         佛祖保佑       永无BUG        永不修改                 //
// //////////////////////////////////////////////////////////////////
var loginButton = require('./loginButton/loginButton.js');

/**
 * base64和utf-8编码
 */

/* eslint-disable */
function Base64() {

    // private property
    _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    // public method for encoding
    this.encode = function (input) {
        var output = '';
        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    // public method for decoding
    this.decode = function (input) {
        var output = '';
        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }
        output = _utf8_decode(output);
        return output;
    };

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    };

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = '';
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };
}

/**
/**
 * 动态加载js文件
 * @param  {string}   url      js文件的url地址
 * @param  {Function} callback 加载完成后的回调函数
 */
function getScript(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');

    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);

    head.appendChild(js);

    // 执行回调
    var callbackFn = function () {
        if (typeof callback === 'function') {
            callback();
        }

    };

    if (document.all) { // IE
        js.onreadystatechange = function () {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                callbackFn();
            }

        };
    }
    else {
        js.onload = function () {
            callbackFn();
        };
    }
}

function smsLoginInit(option, debug) {

    var optionSetting = {
        success: function () {},
        render: function () {}
    };
    option = $.extend({}, optionSetting, option);

    // 如果使用的是zepto，就添加扩展函数
    if (Zepto) {
        $.getScript = getScript;
    }

    var api = '';
    if (debug === true) {
        api = 'http://wappass.qatest.baidu.com/static/touch/js/api/wrapper.js';
    }
    else {
        api = 'https://wappass.baidu.com/static/touch/js/api/wrapper.js';
    }
    $.getScript(api + '?cdnversion=' + new Date().getTime(), function (m) {
        var smsLogin;
        var prelogin;

        passport.use('smsLogin', {
            library: false,
            defaultCss: false
        }, function (magic) {
            var jumpPage = window.location.protocol + '//' + window.location.host;
            var opt = {
                product: 'nuomi',
                jumpBindCheck: 1,
                memberPass: true,
                staticPage: window.location.protocol + '//' + window.location.host + '//v3Jump.html' // __uri('./v3jump.html')
            };
            smsLogin = new magic.passport.smsLogin(opt);
            smsLogin.on('render', function (rsp) {
                rsp.returnValue = false;
                var encodeurl = encodeURIComponent(location.search.split('?u=')[1]);
                var wappassurl = 'http://wappass.baidu.com?tpl=nuomi&u=' + encodeurl;
                // console.log("wappassurl====="+wappassurl);
                $('#PASSP__1__mobilenumLabel').hide(); // 手机号label隐藏
                $('#PASSP__1__mobilenum').attr('placeholder', '请输入手机号');
                $('#PASSP__1__password').attr('placeholder', '请输入动态密码');
                $('#PASSP__1__submitWrapper').after('<p class="word"><input type="checkbox" > 我已阅读并同意<a href=' + wappassurl + ' class="passurl">百度糯米商户联盟服务协议</a></p>');
                $('#PASSP__1__submit').val('立即加入联盟');
                $('#PASSP__1__msgWrapper').remove();
                $('#PASSP__1__submitWrapper').before('<p id="PASSP__1__msgWrapper" class="pass-msg-generalMsgWrapper" ></p>');
                $('.pass-form-agreement').hide();
                option.render();
            });

            smsLogin.on('loginSuccess', function (rsp) {
                rsp.returnValue = false;
                var phone = $('#smsLogin .pass-text-input-mobilenum').val();
                var b = new Base64();
                var bdusign = b.encode(rsp.rsp.data.bdu);
                option.success(bdusign);
            });
            smsLogin.render('smsLogin');
            loginButton.init();

        });

    });
}
module.exports = smsLoginInit;

/* eslint-disable */
