/**
 * @file   qa环境下配置
 */

var config = require('../config');
var merge = require('webpack-merge');
var utils = require('./utils');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var baseWebpackConfig = require('./webpack.base.conf');
var env = require('../config/qa.env');
var path = require('path');
var pkg = require(path.resolve(__dirname, '../package.json'));

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        loaders: utils.styleLoaders({
            extract: true
        })
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('[name]/[name].js'),
        chunkFilename: utils.assetsPath('chunk/[name]/[name].js')
    },
    vue: {
        loaders: utils.cssLoaders({
            extract: true
        })
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env,
            '__PRO__': false,
            '__DEV__': false,
            '__QA__': true,
            '__COMPID__': JSON.stringify(pkg.name)
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        // extract css into its own file
        new ExtractTextPlugin(utils.assetsPath('[name]/[name].css')),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: '[name]/[name].js',
            minChunks: 2
        })
    ]
});

// 生成自动html
utils.generatHtml({
    baseWebpackConfig: baseWebpackConfig
}).forEach(function (htmlWebpackPluginInstance) {
    webpackConfig.plugins.push(htmlWebpackPluginInstance);
});

module.exports = webpackConfig;
