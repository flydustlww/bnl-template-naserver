/**
 * @file    接口地址配置
 */
/* eslint-disable */
let item;
let server;
let pointgoodslist;
let newbilllist;
let GetPromoteInfo;
let billing;
let memberMerchant;
let checkActivity;
let codelist;
let juejin;
let searchmerchant;
let tasklist;
let tasknotify;
console.log('__DEV__================' + __DEV__);
// RD开发环境
if (__DEV__) {
    // server = 'http://cp01-tsm-baino02.cp01.baidu.com:8200';
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
newbilllist = server + 'newbilllist';
billing = server + 'billing';
GetPromoteInfo = server + 'GetPromoteInfo';
memberMerchant = server + 'memberMerchant';
checkActivity = server + 'checkActivity';
codelist = server + 'codelist';
juejin = server + 'juejin';
searchmerchant = server + 'searchmerchant';
tasklist = server + 'tasklist';
tasknotify = server + 'tasknotify';

if (__DEV__ || __QA__) {
    if (/(\:8399|\/mock\/)/.test(server)) {
        item += '.json';
        newbilllist += '.json';
        GetPromoteInfo += '.json';
        billing += '.json';
        memberMerchant += '.json';
        checkActivity += '.json';
        codelist += '.json';
        juejin += '.json';
        searchmerchant += '.json';
        tasklist += '.json';
        tasknotify += '.json';
    }
}

module.exports = {
    item: item,
    newbilllist: newbilllist,
    billing: billing,
    GetPromoteInfo: GetPromoteInfo,
    memberMerchant: memberMerchant,
    checkActivity: checkActivity,
    codelist: codelist,
    juejin: juejin,
    searchmerchant: searchmerchant,
    tasklist: tasklist,
    tasknotify: tasknotify
};
/* eslint-disable */