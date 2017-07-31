# bnl

> 百糯组件化业务项目。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8398 , you can config this in /config/index file
npm run dev

# build for production with minification and generate a zip package
npm run build（npm run build:pro）

# build for qa and generate a zip package
npm run build:qa
```
npm install @nfe/DeferredBNJS --registry=http://nfe.baidu.com:8881 --save

轻登录API文档:http://fe.baidu.com/ss/doc/passport/smsLogin_v3.text

passport.rdtest.baidu.com先登陆  帐号 renlei8009   800800

webpack-dev-server的使用 https://segmentfault.com/a/1190000006964335

### 页面

登录引导页:   baidunuomimerchant://component?url=http://172.22.149.96:8399/page/guide.html  

cardList: 物料详情

dailyBilling: 当日详情

firstGuide: 首次进入导航

guide: 引导页

help: 帮助页

login: 登录页

mendianSearch: 门店查询

myMaterial: 我的物料

promoteDetail :

totalReward: 累计佣金

unionCenter: 联盟中心

userCenter: 个人中心

### 页面链接

1、实名认证：https://m.baifubao.com/wap/0/wallet/0/cardlist/0

2、我的钱包：https://m.baifubao.com/?from=singlemessage&isappinstalled=1

3、消息中心：BaiduNuomiMerchant://mymessagedetail?typeName=公告&typeId=1

4、填写角色（加入联盟跳转）:BaiduNuomiMerchant://bindingphone?channel=alliance&notificationName=com.nuomi.merchant.broadcast.PERSONALPROFILE&bottomText=填写完成,去退出重新登录

### 测试：
BaiduNuomiMerchant://component?url=http://test.baidu.com:8399/page/mendianSearch.html
BaiduNuomiMerchant://component?url=http%3A%2F%2Ftest.baidu.com%3A8399%2Fpage%2FunionCenter.html
### 打包
在bnl目录下运行npm run build

将release里产出的zip包上传到http://developer.nuomi.com/#/package/list?istest=1 里产品管理=>组件测试 => 发布组件

### 接口

获取access_token
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/gettoken

我的物料物料弹窗
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/memberMerchant

我的物料物料列表
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/codelist

门店搜索物料绑定
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/bindcode

门店搜索门店列表
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/searchmerchant

联盟中心验证用户登录和信息接口
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/checkuserinfo

个人中心个人信息
http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp/myuserinfo



