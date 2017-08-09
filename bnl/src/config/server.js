/**
 * @file 组件包加载H5页面域名配置 
 * desc 用此配置的都是与加载H5登录有关的页面
 * @author name<liuboying@baidu.com>
 */
/* eslint-disable */
console.log('H5链接环境: __DEV__' + __DEV__+ '__QA__ ' + __QA__ +'__PRO__'+__PRO__ );
// 默认取RD环境
var server = 'http://cp01-ocean-1115-offline.epc.baidu.com:8080';
// 
if (__DEV__) {

	server = 'http://cp01-ocean-1115-offline.epc.baidu.com:8080';

}
if (__QA__) {
    server = 'http://cp01-c-ugc-test00.epc.baidu.com:8999';
}
if (__PRO__) {
	server = 'http://band.baidu.com';
}

module.exports = {

	server: server
};
/* eslint-disable */