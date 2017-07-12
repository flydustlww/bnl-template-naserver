/* eslint-disable */
/**
 * @file webpack配置文件
 * @author yongqingdong
 */
'use strict';

// Node
var path = require('path');

//
var _ = require('lodash');

// Webpack
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-suppresserror-plugin');

// 常用功能
// var webpackUtil = require('./webpack.util.js');
// 路由配置
var webpackProxy = require('./webpack.proxy.js');
// 环境配置
var webpackEnv = process.webpackEnv = require('./webpack.env.js');
// HTML文件收集
var webpackPack = require('./webpack.pack.js');

// Base directory.
var dirbase = path.resolve(__dirname, '..');

/**
 * 核心的webpack配置config对象
 */
var config = module.exports = (function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    config.entry = {
        // 公共库
        //'static/lib/base': ['zepto', 'DeferredBNJS']
        // Entry入口文件
        // demo:              './src/demo/index.js',
    };


    var publicPath = null;

    if(webpackEnv.SERVER || webpackEnv.webroot){
        // 根目录
        publicPath = '/';
    }else{
        if(webpackEnv.dest){
            publicPath = webpackEnv.addr + '/';
        }else{
            publicPath = '../../'
        }
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    config.output = {
        // Absolute output directory
        path: dirbase + '/dist/pack',

        // Output path from the view of the page
        // Uses webpack-dev-server in development
        // SERVER模式：绝对路径；DEST模式HTTP路径的模式；file协议模式：绝对路径
        // jscs:disable
        publicPath: publicPath,
        // jscs:enable

        // Filename for entry points
        // Only adds hash in build mode
        filename: webpackEnv.SERVER ? '[name].bundle.js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: webpackEnv.SERVER ? '[name].bundle.js' : '[name].bundle.js',

        // SourceMap文件
        sourceMapFilename: '[file].map'
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (webpackEnv.SERVER) {
        // SERVER环境无source-map
        // config.devtool = 'eval-source-map';
    }
    else {
        // 组件包无SourceMap在包里，减小体积
        // config.devtool = 'source-map';
    }
    // UglifyJsPlugin：看源代码后得知
    config.sourceMap = false;

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        // noParse: [/vue\.js$/, /zepto\.js$/],
        preLoaders: [],
        loaders: [
            {
                // JS LOADER
                // Reference: https://github.com/babel/babel-loader
                // @nfe空间下的需要解析
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.resolve(__dirname, '../src'),
                    path.resolve(__dirname, '../node_modules/@nfe')
                ]
            },
            {
                // CSS LOADER
                // Reference: https://github.com/webpack/css-loader
                // Allow loading css through js
                //
                // Reference: https://github.com/postcss/postcss-loader
                // Postprocess your css with PostCSS plugins
                test: /\.(less|css)$/,
                // Reference: https://github.com/webpack/extract-text-webpack-plugin
                // Extract css files in production builds
                //
                // Reference: https://github.com/webpack/style-loader
                // Use style-loader in development.
                loader: ExtractTextPlugin.extract('style', 'css!postcss!less?{"modifyVars":{"remUnit":75}}')
            },
            {
                // ASSET LOADER
                // Reference: https://github.com/webpack/file-loader
                // 图片资源统一放置：static目录下
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'file?name=static/image/[name].[md5:hash:hex:6].[ext]'
            },
            {
                // 字体等不变资源
                test: /\.(woff|woff2|ttf|eot|swf)$/,
                loader: 'file?name=static/[name].[ext]'
            },
            {
                // HTML LOADER
                // Reference: https://github.com/webpack/raw-loader
                // Allow loading html through js
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.vue$/, // a regex for matching all files that end in `.vue`
                loader: 'vue',   // loader to use for matched files
                exclude: [
                    /node_modules\/[^@nfe]]/,
                    /lib/
                ]
            }
            // 暴露为全局变量
            // {
            //    test:       require.resolve('jquery'),
            //    loader:     'expose?$!expose?jQuery'
            // }
        ]
    };

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    // config.postcss = [
    //     autoprefixer({
    //         browsers: ['last 2 version', '> 0.1%']
    //     })
    // ];

    // 各环境下配置的变量
    var webpackEnvHash = {};

    if (webpackEnv.MODE_MK) {
        webpackEnvHash.serverDomain = JSON.stringify('http://mk.nuomi.com');
    }
    else if (webpackEnv.MODE_QA) {
        webpackEnvHash.serverDomain = JSON.stringify('http://qa.nuomi.com');
    }
    else if (webpackEnv.MODE_OL) {
        webpackEnvHash.serverDomain = JSON.stringify('http://ol.nuomi.com');
    }

    config.plugins = [
        // 区分页面所属的环境
        new webpack.DefinePlugin(_.assign({
            envMode: JSON.stringify(webpackEnv),
            // BNJS根据此标识判断是否加载
            envModeMK: webpackEnv.MODE_MK,
            envModeQA: webpackEnv.MODE_QA,
            envModeOL: webpackEnv.MODE_OL,
            // Dest功能
            envDest: webpackEnv.dest,
            // SERVER环境
            envSERVER: webpackEnv.SERVER,
            // REM适配
            remRatio: 10,
            // 打包环境下设置vue位线上模式 webpackEnv.MODE_OL ? 'production' : 'development'
            'process.env': {
                NODE_ENV: JSON.stringify(webpackEnv.MODE_OL ? 'production' : 'development')
            }
        }, webpackEnvHash)),

        // 合并打包
        // new webpack.optimize.CommonsChunkPlugin({
        //     // The order of this array matters
        //     names: 'static/lib/base',
        //     minChunks: Infinity
        // }),

        // 绝对路径改为相对路径
        // new WebpackPluginSigma({
        //    // 只有在file协议下访问才只将JS，CSS改为相对路径，图片仍未../../../的绝对路径
        //    relativePath: !webpackEnv.SERVER && !webpackEnv.dest
        // }),

        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // 找到require的css文件，生成单独的CSS文件：DEV不启用，PRODUCT启用
        new ExtractTextPlugin('[name].bundle.css')

        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        // DEMO：HTML与JS关联
        // new HtmlWebpackPlugin({
        //    template: './src/demo/index.html',
        //    chunks: ['static/lib/base', 'demo/index'],
        //    filename: './demo/index.html',
        //    hash: true
        // })
    ];

    if (webpackEnv.SERVER) {
        // 本地开发：打开浏览器
        webpackEnv.MODE_MK && config.plugins.push(new OpenBrowserPlugin({
            url: [webpackEnv.addr, '/webpack-dev-server'].join('')
        }));
    }
    else {
        // 打包环境下的操作：压缩，复制资源
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({})

            // 复制静态资源
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            // new CopyWebpackPlugin([
            //    {
            //        from:       __dirname + '/src/pack/static',
            //        to:         __dirname + '/static'
            //    }
            // ]),

            // // 打包：ZIP组件包
            // new WebpackShellPlugin({
            //    onBuildExit: [
            //        'node webpack.pack.js exportPackageZIP'
            //    ]
            // })
        );
    }
    // 配置vue文件的CSS解析
    config.vue = {
        loaders: {
            css: ExtractTextPlugin.extract('css'),
            // you can also include <style lang="less"> or other langauges
            less: ExtractTextPlugin.extract('css!postcss!less?{"modifyVars":{"remUnit":75}}')
        }
    };
    /**
     * 本地开发的服务器配置
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: path.join(dirbase, 'src'),
        stats: 'minimal',
        // 数据Mock：传递环境变量
        proxy: webpackProxy({
            envMode: webpackEnv
        })
    };

    // 自动加载模块
    config.plugins.push(
        new webpack.ProvidePlugin({})
    );

    // 模块路径配置
    config.resolve = {
        // 无后缀名的访问
        extensions: ['', '.webpack.js', '.web.js', '.js', '.vue'],
        // 资源访问目录
        root: [
            // 公共库
            path.resolve('./src/common'),
            // 组件库
            path.resolve('./src/common/components'),
            // node_modules
            path.resolve('./node_modules/@nfe')
        ],
        // 公共类库
        alias: {
           'widget': path.resolve(commonPath, 'widget'),
            'dep': path.resolve(commonPath, 'dep'),
            'static': path.resolve(commonPath, 'static'),
            'dev': path.resolve(commonPath, 'dev'),
            'pkg': path.resolve(projectRoot, 'package.json'),
            // 'widget': path.resolve(srcRoot, 'widget'),
            'components': path.resolve(srcRoot, 'components')
        }
    };

    // 通过$引入zepto：require('$')
    // externals|resolve.alias|ProvidePlugin：https://stackoverflow.com/questions/23305599/webpack-provideplugin-vs-externals?answertab=votes#tab-top
    // externals        外部定义的window变量，如：jQuery，可以通过require引入；
    // resolve.alias    通过alias引入相对路径下的类库；
    // ProvidePlugin    凡是代码中使用到的变量，均会间接引入，如：_.forEach；会引入require('underscore')；
    // config.externals = {
    //     $: 'Zepto'
    // };

    // 用于模块分析：http://webpack.github.io/analyse/，参数用法：http://webpack.github.io/docs/node.js-api.html
    // config.stats = {
    //    json:       'verbose'
    // };

    return config;
}());

// 配置
var srcPath = path.join(dirbase, '/src');
webpackPack.fillWebpackConfig(config, srcPath);

