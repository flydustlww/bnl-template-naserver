/**
 * @file Describe bnjsHTTP请求封装
 * yuchanghuang@baidu.com
*/
/* eslint-disable */
var util = require('../util/util.js');
var Promise = require('dep/promise/promise.js');

// ensure that method calling before BNJS ready causes error.
util.ready(function (BNJS) {

    /**
     * @param {Object}  options          配置参数
     *     -  {string}  url              接口地址
     *     -  {Function}onSuccess        成功回调
     *     -  {Function}onFail           失败回调
     *     -  {Object}  context          loginSuccess,loginFail的上下文
     */
    var ajax = exports.ajax = function (options) {

        var method = options.method || 'postNA';
        // dev环境下并且接口以.json结尾
        
        return new Promise(function (resolve, reject) {
            BNJS.localStorage.getItem('bnl_bduss', function(res){
                let data = res.data;
                options.params.bduss = data;
                BNJS.http[method]({
                    url: options.url,
                    params: options.params || {},
                    onSuccess: function (res) {
                        if (__DEV__) {
                            console.log('请求成功:', res);
                        }
                        resolve(res || {});
                    },
                    onFail: function (res) {

                        if (__DEV__) {
                            console.log('请求失败:', res);
                        }

                        BNJS.env.network(function (resNet) {
                            // 断网提示
                            if (resNet.network === 'non') {
                                BNJS.ui.showErrorPage('网络不给力哦…', 1, 9011); // 新丸子图
                                reject(resNet);
                                return false;
                            }
                        });

                        // 其他错误
                        reject(res);                    
                    }
                });
            }, function(){
                alert(1);
            }, '2.7');

        });
    };

    exports.get = function (options) {
        options.method = 'get';
        return ajax(options);
    };

});
/* eslint-disable */