/* eslint-disable */
/**
 * @file 环境配置
 * @author yongqingdong
 */
'use strict';

var webpackUtil = require('./webpack.util.js');

var envModeName = null;

if (process.argv[1].indexOf('webpack-dev-server') > 0) {
    // SERVER环境判断：携带--qa参数或者--ol参数，则认为是QA或者OL环境，否则MK环境
    envModeName = 'MK';
    process.argv.indexOf('--qa') > 0 && (envModeName = 'QA');
    process.argv.indexOf('--ol') > 0 && (envModeName = 'OL');
}
else {
    // 非SERVER环境判断：直接判断
    envModeName = process.env.npm_lifecycle_event.toUpperCase();
}

/**
 * 环境设置
 */
module.exports = {
    // Server模式：启动的是webpack-dev-server
    SERVER: process.argv[1].indexOf('webpack-dev-server') > 0,
    // Mock环境：本地开发Mock，联调环境Bridge
    MODE_MK: envModeName === 'MK',
    // 打包环境：Package：包括了：联调，测试，线上
    MODE_PK: envModeName !== 'MK',
    // 测试环境：QA测试
    MODE_QA: envModeName === 'QA',
    // 线上环境：Online
    MODE_OL: envModeName === 'OL',
    // 环境名称：仅作标识，不推荐用
    name: envModeName,
    // 只有MK环境才有值
    // 如：172.XX.XX.XX
    host: '',
    // 如：8527
    port: '',
    // 如：http://172.xx.xx.xx:8527
    addr: '',
    // 如：http://localhost:8527
    local: '',
    // 是否是远程调试
    dest: false,
    // 是否跑在Web服务器下：定位根目录
    webroot: process.argv.indexOf('--webroot') > 0
};

// 定制端口
if (process.argv.lastIndexOf('--port') !== -1) {
    var portPos = process.argv.lastIndexOf('--port') + 1;
    var portNum = +(process.argv[portPos]);
    module.exports.port = portNum;
}
else {
    // 非Server模式下默认为8527
    module.exports.port = 8527;
}

// 获取本机地址，只取第一个
if (webpackUtil.getLocalAddr().length > 0) {
    module.exports.host = webpackUtil.getLocalAddr()[0];
    // Actual ADDRESS：http://172.xx.xx.xx:8527
    // jscs:disable
    module.exports.addr = ['http://', module.exports.host, ':', module.exports.port].join('');
    // Local ADDRESS: http://localhost:8527
    module.exports.local = ['http://', 'localhost', ':', module.exports.port].join('');
    // jscs:enable
}

// 启动远程调试的功能
if (process.argv.indexOf('--dest') !== -1) {
    // 本地环境：http://172.xx.xx.xx:8527/webpack-dev-server
    module.exports.dest = true;
}
else if (process.argv.indexOf('--dest-cloud') !== -1) {
    // QA-CLOUD环境：http://szwg-lbs-nuomi-nov-m12-zhuijia142.szwg01:8040/webpack-dev-server
    // OL-CLOUD环境：http://szwg-lbs-nuomi-nov-m12-zhuijia142.szwg01:8050/webpack-dev-server
    module.exports.dest = true;
    module.exports.host = 'nfe.baidu.com';
    module.exports.port = module.exports.MODE_OL ? 8050 : 8040;
    // jscs:disable
    module.exports.addr = ['http://', module.exports.host, ':', module.exports.port].join('');
    // jscs:enable
}

console.info('DBUG: envMode.SERVER=%s', module.exports.SERVER);
console.info('DBUG: envMode.name=%s', module.exports.name);
console.info('DBUG: envMode.dest=%s', module.exports.dest);
console.info('DBUG: envMode.addr=%s', module.exports.addr);
console.info('DBUG: envMode.webroot=%s', module.exports.webroot);
