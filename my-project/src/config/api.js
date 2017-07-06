/**
 * @file    接口地址配置
 */

let item,server,pointgoodslist;

// RD开发环境
if (__DEV__) {
	//server = 'http://cp01-tsm-baino02.cp01.baidu.com:8200';
    server = location.origin + '/mock/';
}
// QA环境
else if (__QA__) {
	server = 'http://cp01-rdqa-dev322.cp01.baidu.com:8192';
    
}
// 线上环境
else if (__PRO__) {
	server = 'http://band.baidu.com';
    // item = 'http://172.22.149.65:8399/mock/item.js';//location.origin + '/mock/item.js';
}
item = server + 'item';

if(__DEV__ || __QA__) {
    if(/(\:8399|\/mock\/)/.test(server)) {
        item += '.json';
    }
}
module.exports = {
    item: item
};
