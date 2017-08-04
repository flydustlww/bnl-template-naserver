/**
 * @file    接口地址配置
 */
/* eslint-disable */

/**
 * myaccount 接口地址
 * http://band.baidu.com/naserver/user/myaccount?sid=112656384_201707&app_version=5.8.0&timestamp=1499930942771&location=1.0.0&sign=29FB10A5DA0073913397A41E70E1221D
 * 
 * getnewmsginfo 接口地址
 * http://band.baidu.com/naserver/mymessage/getnewmsginfo?sid=112656384_201707&app_version=5.8.0&timestamp=1499930209857&location=1.0.0&sign=7AA9A0C38B3A02C26905CE0F0462712C
 * 
 * naserver/newapp/checkuserinfo
 * 
 * /naserver/newapp/gettoken
 * naserver/newapp/myuserinfo
 */
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
let myaccount;
let getnewmsginfo;
let checkuserinfo;
let myuserinfo;
let gettoken;
let bindcode;
let unbindcode;
let mycustomer2;
let productcode;
console.log('请求接口环境: __DEV__' + __DEV__+ '__QA__ ' + __QA__ +'__PRO__'+__PRO__ );
// RD开发环境
if (__DEV__) {
    // server = 'http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/';
    // server = location.origin + '/mock/';
    server = location.origin + '/api/';
}
// QA环境
if (__QA__) {
    server = 'http://cp01-c-ugc-test00.epc.baidu.com:8999';
}
// 线上环境
if (__PRO__) {
    server = 'http://band.baidu.com';
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
myaccount = server + 'myaccount';
getnewmsginfo = server + 'getnewmsginfo';
checkuserinfo = server + 'checkuserinfo';
myuserinfo = server + 'myuserinfo';
gettoken = server + 'gettoken';
bindcode = server + 'bindcode';
mycustomer2 = server +'mycustomer2';
unbindcode = server +'unbindcode';
productcode = server +'unbindcode';

if (__DEV__) {
    if (/(\:8399\/mock\/)/.test(server)) {
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
        myaccount += '.json';
        getnewmsginfo += '.json';
        checkuserinfo += '.json';
        myuserinfo += '.json';
        gettoken += '.json';
        bindcode += '.json';
        mycustomer2 += '.json';
        unbindcode += '.json';
        productcode += '.json';
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
    tasknotify: tasknotify,
    myaccount: myaccount,
    getnewmsginfo: getnewmsginfo,
    checkuserinfo: checkuserinfo,
    myuserinfo: myuserinfo,
    gettoken: gettoken,
    bindcode: bindcode,
    mycustomer2: mycustomer2,
    unbindcode: unbindcode,
    productcode: productcode
};
/* eslint-disable */