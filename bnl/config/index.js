// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../output/index.html'),
        assetsRoot: path.resolve(__dirname, '../output'),
        assetsSubDirectory: './',
        assetsPublicPath: '../',
        assetsPublicPathDev: '/',
        productionSourceMap: false,
        // 打包路径
        releasePath: path.resolve(__dirname, '../../__release__'),
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    qa: {
        env: require('./qa.env')
    },
    dev: {
        env: require('./dev.env'),
        port: 8399,
        proxyTable: {
            /* '/mock': {
                 target: 'http://172.22.149.65',
                 changeOrigin: true,
                 pathRewrite: {
                   '^/mock': '/mock'
                 }
               }*/
            '/api': {
                target: 'http://cp01-ocean-1115-offline.epc.baidu.com:8080/naserver/newapp',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
    needLogin: [
        'timepicker',
        'reserve',
        'pay-success',
        'shoppicker'
    ]
};
