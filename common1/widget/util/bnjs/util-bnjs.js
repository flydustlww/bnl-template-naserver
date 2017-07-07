/**
 * bnjs二次封装
 * zhoufei04@baidu.com
 */

var util = require('../util');
var Promise = require('dep/promise/promise.js');

// ensure that method calling before BNJS ready causes error.
util.ready(function (BNJS) {

    var getCityCode = exports.getCityCode = function () {
        return BNJS.location.hasLocation ? BNJS.location.cityCode : null;
    };

    /**
     * 检查是否异地
     * - 用户选择城市 != 定位城市
     * - 定位失败也按照异地来算
     * @return {Boolean} true异地 false同城
     */
    exports.isRemote = function () {
        var GPS = getCityCode();

        return !GPS || GPS != BNJS.location.selectCityCode;
    };

    /**
     * 在开发环境采用getNA方法
     * dev环境可能用.js模拟数据文件，无法post
     * @param {Object}  options          配置参数
     *     -  {string}  url              接口地址
     *     -  {Function}onSuccess        登录成功回调
     *     -  {Function}onFail           登录失败回调
     *     -  {boolean} needChecklogin   是否需要检查是否登录，默认是
     *     -  {Function}loginSuccess     登录成功回调
     *     -  {Function}loginFail        登录失败后回调
     *     -  {Object}  context          loginSuccess,loginFail的上下文
     */
    var ajax = exports.ajax = function (options) {

        var method = options.method || 'postNA';
        // dev环境下并且接口以.js结尾
        if ((__DEV__ || __QA__) && /.*\.js$/.test(options.url)) {
            method = 'getNA';
        }

        options.needChecklogin = options.needChecklogin || true;// 默认需要检查登录

        return new Promise(function (resolve, reject) {
            BNJS.http[method]({
                url: options.url,
                params: options.params || {},
                onSuccess: function (res) {
                    if (options.needChecklogin && !checklogin(res.errno)) {
                        return;
                    }

                    if (res.errno != 0) {
                        return reject(res);
                    }

                    if (__DEV__) {
                        console.log('请求成功:', res);
                    }

                    resolve(res.data || {});
                },
                onFail: function (res) {

                    if (__DEV__) {
                        console.log('请求失败:', res);
                    }

                    if (options.needChecklogin && !checklogin(res.errno)) {
                        return;
                    }

                    BNJS.env.network(function (resNet) {
                        // 断网提示
                        if (resNet.network === 'non') {
                            BNJS.ui.showErrorPage('网络不给力哦…', 1, 9011);// 新丸子图
                            reject(resNet);
                            return false;
                        }

                        // 其他错误
                        reject(res);
                    });

                }
            });
        });

        function checklogin(errno) {
            // 检查是否登录，并执行登录后的回调
            // 接口返回的errno可能为字符串和数字，所以需要转一下
            if ([951012, 950012, 99010].indexOf(+errno) > -1) {

                var context = options.context || window;
                var loginSuccess = options.loginSuccess || util.doNothing;

                function fail() {
                    BNJS.ui.showErrorPage('未登录，请重试~', 1);
                }

                BNJS.account.login({
                    onSuccess: function () {
                        loginSuccess();
                    },
                    onFail: function () {
                        if (options.loginFail) {
                            options.loginFail();
                        } else {
                            fail();
                        }
                    }
                });

                return false;
            }

            return true;
        }
    };

    exports.postNA = function (options) {
        options.method = 'postNA';

        return ajax(options);
    };

    exports.getSelectCityCode = function () {
        if (!BNJS.location.selectCityCode) {
            BNJS._updateLocation(BNJS.execSync('location', 'getLocation'));
        }
        return BNJS.location.selectCityCode;
    };

    exports.getMobile = function (callback) {
        var m = BNJS.account.mobile;
        if (m === 'null' || m === undefined) {
            if (__DEV__) {
                return callback('');
            }
            return BNJS.account.getMobile({
                onSuccess: function (res) {
                    if (res.mobile !== '') {
                        callback(res.mobile);
                    } else {
                        callback('');
                    }
                },
                onFail: function (res) {
                    callback('');
                }
            });
        }

        callback(m);
    };

    /**
     * 浏览器localstorage与bnjs.localstorage相结合
     */
    exports.storage = (function () {
        // 低端浏览器不支持localstorage
        var ls = localStorage || {
            setItem: util.doNothing,
            getItem: util.doNothing,
            removeItem: util.doNothing
        };

        var bs = BNJS.localStorage;

        /**
         * setItem存储的结果有差异，在getItem的时候返回的都是string
         * - ls存储的是string
         * - bs存储的是object
         */
        var setItem = function (key, value) {

            return new Promise(function (resolve, reject) {

                if (typeof value !== 'string') {
                    ls.setItem(key, JSON.stringify(value));
                } else {
                    ls.setItem(key, value);
                }

                // 貌似bs不需要stringify value
                bs.setItem(key, value, function (res) {
                    resolve(res.data);
                }, function (res) {
                    reject(res);
                });
            });
        };

        /**
         * getItem
         * - 从ls中获取到的值是string
         * - 从bs中获取的是Object
         * - 返回的数据格式都是Object类型
         */
        var getItem = function (key) {

            return new Promise(function (resolve, reject) {
                var res;

                if (res = ls.getItem(key)) {

                    if ('string' === typeof res) {
                        try {
                            res = JSON.parse(res);
                        } catch (e) {
                            // 不转换
                            // console.log(res);
                        }
                    }

                    return resolve(res);
                }
                bs.getItem(key, function (response) {
                    res = response.data;

                    // 有res之后才能parse，否则ios会弹框报错
                    // 同时给ls添加该项存储
                    if (res) {
                        if ('string' === typeof res) {
                            ls.setItem(key, res);
                            try {
                                res = JSON.parse(res);
                            } catch (e) {}
                        } else {
                            ls.setItem(key, JSON.stringify(res));
                        }
                    }
                    resolve(res);
                }, function (err) {
                    reject(err);
                });
            });
        };

        var removeItem = function (key) {

            return new Promise(function (resolve, reject) {
                ls.removeItem(key);

                // 安卓6.2.0 bs.removeItem删除不了缓存，手动设置为空
                bs.setItem(key, null);
                bs.removeItem(key, function (res) {
                    if (__DEV__) {
                        console.log('storage.remove', key, '删除成功~');
                    }
                    resolve(res.data);
                }, function (res) {
                    if (__DEV__) {
                        console.log('storage.remove', key, '删除失败！');
                    }
                    reject(res);
                });
            });
        };

        return {
            getItem: getItem,
            setItem: setItem,
            removeItem: removeItem
        };
    })();

});
