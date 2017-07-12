/**
 * @file   dev环境下配置
 */

var config = require('../config');
var webpack = require('webpack');
var merge = require('webpack-merge');
var utils = require('./utils');
var path = require('path');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require(path.resolve(__dirname, '../package.json'));
console.log('add for DefferedBNJS 是否为开发环境--------------------'+process.argv[1].indexOf('webpack-dev-server') > 0);

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

var webpackConfig = merge(baseWebpackConfig, {
   /* entry: {
        // 公共库
        'static/lib/base': ['DeferredBNJS']
    },*/
    module: {
        loaders: utils.styleLoaders()
    },
    // will be merged into base output
    output: {
        publicPath: config.build.assetsPublicPathDev/*,
        chunkFilename: '[name].bundle.js'*/
    },
    // eval-source-map is faster for development
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
            '__DEV__': true,
            '__QA__': false,
            '__PRO__': false,
            '__COMPID__': JSON.stringify(pkg.name),
            // add for DefferedBNJS 是否为开发环境
            envSERVER: true,//process.argv[1].indexOf('webpack-dev-server') > 0
            envMode: JSON.stringify({
                name: 'MK'
            })
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        //new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
});
// 生成自动html
utils.generatHtml({
    baseWebpackConfig: baseWebpackConfig
}).forEach(function (htmlWebpackPluginInstance) {
    webpackConfig.plugins.push(htmlWebpackPluginInstance);
});

module.exports = webpackConfig;
