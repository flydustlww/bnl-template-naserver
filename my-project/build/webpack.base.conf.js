var fs = require('fs');
var path = require('path');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');
var srcRoot = path.resolve(projectRoot, 'src');
var pagePath = path.resolve(srcRoot, 'page');
var commonPath = path.resolve(projectRoot, '../common1/');

var pages = fs.readdirSync(pagePath).filter(function (page) {
    return page.indexOf('.') !== 0;
});

var entry = {};
pages.forEach(function (page) {
    entry[page] = ['.', 'src/page', page, page].join('/');
});

console.log('入口文件列表：\n', entry);
console.log('output path ==================='+config.build.assetsRoot);
console.log('output publicPath ==================='+config.build.assetsPublicPath);
module.exports = {
    // entry 多入口配置{ page1 :'./page1'}
    // 详细见confiuration entry  http://webpack.github.io/docs/configuration.html 
    entry: entry,
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
       // [name]占位符的形式,待变
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        root: [
        // node_modules
            path.resolve('./node_modules/@nfe')
        ],
        // 资源访问目录,配置后只需要用key值访问 例如 要加载common/dep/zepto require('dep/zepto')
        alias: {
            'widget': path.resolve(commonPath, 'widget'),
            'dep': path.resolve(commonPath, 'dep'),
            'static': path.resolve(commonPath, 'static'),
            'dev': path.resolve(commonPath, 'dev'),
            'pkg': path.resolve(projectRoot, 'package.json'),
            // 'widget': path.resolve(srcRoot, 'widget'),
            'components': path.resolve(srcRoot, 'components')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        // preLoaders: [{
        //     test: /\.vue$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules/
        // }, {
        //     test: /\.js$/,
        //     loader: 'eslint',
        //     include: projectRoot,
        //     exclude: /node_modules/
        // }],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            //include: projectRoot,
            include: [
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../node_modules/@nfe')
            ],
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
        //     test: /\.tpl$/,
        //     loader: 'crox'
        // }, {
            test: /\.html$/,
            loader: 'vue-html'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }, {
            // to deal with ERROR in ../common/dev/debug.tpl
            test: /\.tpl$/,
            loader: 'raw-loader'
        }]
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    vue: {
        loaders: utils.cssLoaders()
    }
}
