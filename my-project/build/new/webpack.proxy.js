/* eslint-disable */
/**
 * @file 路由的映射文件
 * @author yongqingdong
 */

/**
 * 路由的映射文件
 *
 * @param {Object} options - 配置
 * @param {Object} options.envMode 环境变量
 * @return {Object}
 */
module.exports = function (options) {
    'use strict';

    // 本地开发地址，默认：http://localhost:8527
    var targetHostLocal = [options.envMode.local, ''].join('');
    // 本地开发地址，默认：http://172.xx.xx.xx:8527
    var targetHostAddr = [options.envMode.addr, ''].join('');

    // 联调地址
    // var targetHostLocal = 'http://10.94.191.37:8088';
    var targetHostRemote = '';

    var proxyHash = {};
    // 示例
    (function () {
        proxyHash['/checkcheat'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/checkcheat.json';
            }
        };
        proxyHash['/checkinlandingpage'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/checkinlandingpage.json';
            }
        };
        proxyHash['/memberpointreceive'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/memberpointreceive.json';
            }
        };
        
        proxyHash['/MemberPointCheckinswitch'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/MemberPointCheckinswitch.json';
            }
        };
        proxyHash['/pointgoodsdetail'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/pointgoodsdetail.json';
            }
        };
        proxyHash['/memberpointlist'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/memberpointlist.json';
            }
        };
        proxyHash['/goodschange'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/goodschange.json';
            }
        };
        proxyHash['/memberpointdetail'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/memberpointdetail.json';
            }
        };
        proxyHash['/pointgoodslist'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/pointgoodslist.json';
            }
        };
        proxyHash['/memberperfectlist'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/memberperfectlist.json';
            }
        };
        
        proxyHash['/PointCatGoodsList'] = {
            target: targetHostRemote || targetHostLocal || targetHostAddr,
            rewrite: function (req) {
                req.method = 'GET';
                req.url = '/mock/PointCatGoodsList.json';
            }
        };
    })();

    return proxyHash;
};
