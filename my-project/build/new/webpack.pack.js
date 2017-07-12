/* eslint-disable */
/**
 * @file 组件包打包配置
 * @author yongqingdong
 */
'use strict';

// Node
var path = require('path');
var fs = require('fs');

// Webpack
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');
var shelljs = require('shelljs');
var JSZip = require('jszip');
var _ = require('lodash');

var rp = require('request-promise');
// var md5 = require('blueimp-md5');

// 常用功能
var webpackUtil = require('./webpack.util.js');

// Base directory.
var dirbase = path.resolve(__dirname, '..');

/**
 * 收集该目录下要导出的HTML列表
 *
 * @param {string} srcPath - 收集目录
 * @return {Array}
 */
exports.collectHtmlList = function (srcPath) {

    // 收集Entry的JS和HTML
    var pageRootPath = srcPath;
    var pageDirList = fs.readdirSync(pageRootPath);
    // 收集起来的列表
    var htmlDirList = [];

    // 遍历每个目录
    pageDirList.forEach(function (pageDirName) {

        var pageDirPath = path.join(pageRootPath, pageDirName);

        // 如果是文件则返回
        if (fs.statSync(pageDirPath).isFile()) {
            return;
        }

        // 存在则遍历
        if (this.pageConf.scanList && this.pageConf.scanList.length > 0 && this.pageConf.scanList.indexOf(pageDirName) === -1) {
            // 如果不存在，则直接跳过
            console.info('WARN:', 'Giveup looping html directory: ', pageDirName);
            return;
        }
        else {
            // 如果存在，则只遍历匹配的文件夹
            console.info('INFO:', 'Looping html directory: ', pageDirName);
        }

        // 填充pageConf.configJson
        this.pageConf.configJson = _.assign(this.pageConf.configJson, this.loadPageConfig(pageDirPath).configJson);

        // 指定目录下：要保存的HTML列表
        var pageDirHtmlList = [];

        var allFileList = shelljs.ls('-R', pageDirPath);
        var allFileHash = webpackUtil.list2Hash(allFileList);

        // 遍历这个目录下的每一个文件
        allFileList.forEach(function (vFileSubPath) {

            var vFileFullPath = path.join(pageDirPath, vFileSubPath);
            // 文件信息
            var vFileStat = fs.lstatSync(vFileFullPath);
            // 是否是HTML结尾
            var vFileMatch = vFileSubPath.match(/(.*)\.html/);

            if (vFileStat.isFile() && vFileMatch && !!allFileHash[vFileMatch[1] + '.js']) {
                // 如果存在同名的HTML和JS，则判断收集

                var subPath = path.join(pageDirName, vFileMatch[1]);

                var subPathMatch = subPath.match(/(component|template)/);
                if (subPathMatch && subPathMatch.length > 0) {
                    // 如果是组件或者模板，则放弃
                    console.info('WARN:', 'Jump template or component: %s', subPath);
                    return;
                }

                var pageInfo = {
                    // 子路径
                    subPath: path.join(pageDirName, vFileMatch[1]).replace(/\\/g, '/'),
                    // 全路径
                    fullPath: path.join(srcPath, pageDirName, vFileMatch[1]).replace(/\\/g, '/')
                };

                if (allFileHash[vFileMatch[1] + '.json']) {
                    // 如果存在JSON配置文件，则加载进来
                    var jsonPath = pageInfo.fullPath + '.json';
                    pageInfo.confHash = require(jsonPath);
                }
                else {
                    pageInfo.confHash = {
                        configJson: {}
                    };
                }

                pageDirHtmlList.push(pageInfo);
            }
            else {
                // 否则：跳过
            }

        });

        // 记录下来
        htmlDirList.push({
            dirName: pageDirName,
            htmlList: pageDirHtmlList
        });

    }.bind(this));
    // console.info('DEBUG', 'Collected Html List: ', JSON.stringify(htmlDirList, null, 4));
    return htmlDirList;
};

/**
 * 填充webpack的config对象，把HTML与JS关联起来
 *
 * @param {Object} webpackConfig - webpack配置
 * @param {Array} htmlDirList - 目录数组
 */
exports.hookWebpackConfig = function (webpackConfig, htmlDirList) {

    // 遍历每个文件夹
    htmlDirList.forEach(function (vDirHash) {

        // 遍历每个文件
        vDirHash.htmlList.forEach(function (vEntryHash) {

            var entryName = vEntryHash.subPath;
            var entryPathJs = vEntryHash.fullPath + '.js';
            var entryPathHtml = vEntryHash.fullPath + '.html';
            var outputPathHtml = ['./', entryName, '.html'].join('');

            /// JS,CSS发布在static目录下
            var entryNameStatic = path.join('static', entryName).replace(/\\/g, '/');
            var outputPathHtmlView = ['./', 'view/', entryName, '.html'].join('');
            var entryNameFinal = process.webpackEnv.webroot ? entryNameStatic : entryName;
            var outputPathHtmlFinal = process.webpackEnv.webroot ? outputPathHtmlView : outputPathHtml;


            var entryObject = {
                template: entryPathHtml,
                chunks: ['static/lib/base', entryNameFinal],
                filename: outputPathHtmlFinal,
                hash: true,
                // 自定义的字段：标识依赖的JS文件
                pageHash: vEntryHash
            };
            // console.info('DEBUG', 'Webpack EntryName: ', entryName, entryNameFinal, entryPathJs);
            // console.info('DEBUG', 'HtmlWebpackPlugin: ', JSON.stringify(entryObject, null, 4), '\n');

            // Webpack ERROR: a dependency to an entry point is not allowed.
            webpackConfig.entry[entryNameFinal] = [entryPathJs];
            // HTML与JS的绑定
            webpackConfig.plugins.push(new HtmlWebpackPlugin(entryObject));
        });

    });

};

/**
 * 生成糯米组件化的配置文件：config.json
 *
 * @param {Object} webpackConfig - webpack配置
 * @param {string} destPath - 最终路径
 * @return {Object}
 */
exports.generateConfigJson = function (webpackConfig, destPath) {

    var packageJson = require(path.join(dirbase, 'package.json'));

    // 1. 结构
    var configJsonHash = process.configJsonHash = _.assign({
        id: packageJson.name,
        version: '0.0.1',
        pages: []
    }, this.pageConf.configJson);

    // 2. 填充
    webpackConfig.plugins.forEach(function (vPlugin) {

        if (vPlugin instanceof HtmlWebpackPlugin) {
            // 从这个插件中抽取HTML路径出来

            // 页面配置对象
            var pageHash = vPlugin.options.pageHash;
            // 去掉 '.'前缀
            var htmlFilePath = vPlugin.options.filename[0] === '.' ? vPlugin.options.filename.substring(1) : vPlugin.options.filename;
            // 自定义的字段：标识依赖的JS文件
            var htmlFileName = pageHash.subPath.replace(/\\/g, '/').replace(/\//g, '-').replace(/^\w*-/, '');

            htmlFilePath = htmlFilePath.replace(/\\/g, '/');

            configJsonHash.pages.push(_.assign({
                name: htmlFileName,
                file: htmlFilePath,
                login: false
            }, pageHash.confHash.configJson));
        }

    });

    // 3. 写入config.json
    var configFilePath = path.join(destPath, 'config.json');

    shelljs.mkdir('-p', destPath);
    fs.writeFileSync(configFilePath, JSON.stringify(configJsonHash));

    return configJsonHash;
};

/**
 * 填充webpack的config对象
 *
 * @param {Object} webpackConfig - webpack配置
 * @param {string} srcPath - 源路径
 */
exports.fillWebpackConfig = function (webpackConfig, srcPath) {

    // 加载配置
    this.pageConf = this.loadPageConfig(srcPath);

    // 1. 收集
    var dirHtmlList = this.collectHtmlList(srcPath);

    // 2. 填充
    this.hookWebpackConfig(webpackConfig, dirHtmlList);

    // 3. 生成：Mock阶段不需要
    if (!process.webpackEnv.SERVER) {
        var destPath = path.join(dirbase, 'dist/pack');

        // 生成：config.json
        var configJsonHash = this.generateConfigJson(webpackConfig, destPath);

        // 目标地址
        var destAddr = !process.webpackEnv.dest ? '' : ['_dest', process.webpackEnv.host, process.webpackEnv.port].join('_');

        // 打包：ZIP组件包
        webpackConfig.plugins.push(
            new WebpackShellPlugin({
                onBuildExit: [
                    ['node ./config/webpack.pack.js exportPackageZIPWithVersion', configJsonHash.id, process.webpackEnv.name, destAddr].join(' ')
                ]
            })
        );
    }

    // 4. 路径记录
    process.webpackConfig = webpackConfig;

};

/**
 * 读取配置 src/config.json或者 src/xxx/config.json
 *
 * @param {string} srcPath - 源路径
 * @return {*}
 */
exports.loadPageConfig = function (srcPath) {

    // 文件配置
    var pageConf = {};

    try {
        var vFileFullPath = path.join(srcPath, 'config.json');
        // 文件信息
        var vFileStat = fs.lstatSync(vFileFullPath);
        // 加载
        vFileStat.isFile() && (pageConf = require(vFileFullPath));
    }
    catch (e) {
    }

    console.info('INFO:', 'Load config.json: ', vFileFullPath);
    return pageConf;
};

/**
 * 最后生成ZIP包文件
 *
 * @param {string} zipFileName - ZIP组件包的名称
 */
exports.exportPackageZIP = function (zipFileName) {

    var zip = new JSZip();
    zip.folder();

    var packPathDir = path.resolve('./dist/pack');
    var packFilePath = ['./dist/', zipFileName, '.zip'].join('');

    console.info('DBUG:', 'Generating ZIP file: ', packFilePath);

    // 1. Read file list.
    var packFileList = shelljs.ls('-R', packPathDir);

    packFileList.forEach(function (vFilePath) {

        var vFileAbsoPath = path.resolve(packPathDir, vFilePath);
        var vFileStat = fs.lstatSync(vFileAbsoPath);

        if (vFileStat.isDirectory()) {
            zip.folder(vFilePath);
        }
        else if (vFileStat.isFile()) {
            var vFileCont = fs.readFileSync(vFileAbsoPath);
            zip.file(vFilePath, vFileCont);
        }
        else {
            console.warn('WARN: ', 'Ignore file path: ', vFilePath);
        }

    });

    // 2. Generate ZIP file.
    zip.generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true,
        // 压缩率
        compression: 'DEFLATE',
        compressionOptions: {
            level: 6
        }
    }).pipe(fs.createWriteStream(packFilePath));

};

/**
 * RUN：node webpack.pack.js exportPackageZIPWithVersion rechargecenter
 *
 * @param {string} componentName - 组件名称
 * @param {string} envModeName - 环境名称
 * @param {string} envDest - Dest配置
 */
exports.exportPackageZIPWithVersion = function (componentName, envModeName, envDest) {

    // 版本：获取版本号
    var def = this.defPackageLatestVersion(componentName, envModeName);

    def.then(function (res) {
        var zipFilename = (res && res.version) ? [res.name, envModeName, res.version].join('_') + (envDest || '') : componentName;
        this.exportPackageZIP(zipFilename);
    }.bind(this), function () {
        this.exportPackageZIP(componentName);
    });
};

/**
 * 获取组件包的版本信息
 * RUN：node webpack.pack.js defPackageLatestVersion rechargecenter QA
 *
 * @param {string} componentName - 组件名称
 * @param {string} envModeName - 环境名称
 * @return {*}
 */
exports.defPackageLatestVersion = function (componentName, envModeName) {

    var requestJar = rp.jar();
    var cookie = rp.cookie('BDUSS=F-Wm9SfkJRdzR5Znl4ZVM1Mn5GclBycDd0NTRabW9lUzVtWDN1ZFhzYzB6Z3BZQVFBQUFBJCQAAAAAAAAAAAEAAABTBioBZGl5ZHlxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRB41c0QeNXVE');
    var requestHttpCompList = 'http://developer.nuomi.com/openplatform/api/permitcomponent';
    requestJar.setCookie(cookie, requestHttpCompList);

    var requestData = webpackUtil.signData({
        url: '/openplatform/api/opupload'
    });

    return rp({
        url: requestHttpCompList,
        jar: requestJar,
        method: 'POST',
        formData: requestData
    }).then(function (res) {

        typeof res === 'string' && (res = JSON.parse(res));
        // console.info('INFO: HTTP component list with response data: ', res);

        // Find component info.
        var componentHash = null;
        if (res instanceof Array) {
            var resLeft = res.filter(function (vComp) {
                return vComp.name === componentName;
            });
            resLeft.length > 0 && (componentHash = resLeft[0]);
        }

        if (componentHash) {
            // 找到了组件包信息
            console.info('INFO: HTTP component list response: ', componentHash);
            //
            var requestHttpCompInfo = 'http://developer.nuomi.com/openplatform/api/configapi';
            requestJar.setCookie(cookie, requestHttpCompInfo);

            /* eslint-disable fecs-camelcase */
            var requestData = webpackUtil.signData({
                component_id: componentHash.id,
                info_type: 1,
                istest: envModeName ? (envModeName === 'QA' ? 1 : 0) : 1,
                product_id: 1
            });
            /* eslint-enable fecs-camelcase */

            return rp({
                url: requestHttpCompInfo,
                jar: requestJar,
                method: 'POST',
                formData: requestData
            }).then(function (res) {

                typeof res === 'string' && (res = JSON.parse(res));
                if (res.data && res.data.version) {
                    // 找到了组件包信息：更新版本
                    console.info('INFO: HTTP component info response: ', res);
                    process.configJsonHash && (process.configJsonHash.version = res.data.version);

                    return (componentHash.version = res.data.version) && componentHash;
                }
                else {
                    // 找不到包
                    console.warn('WARN: Cannot find compoennt=%s', componentName);
                    return null;
                }
            }, function () {
                return null;
            });

        }
        else {
            // 找不到包
            console.warn('WARN: Cannot find compoennt=%s', componentName);
            return null;
        }
    }, function () {
        return null;
    });

};

// RUN
var methodName = process.argv[2];
if (exports[methodName]) {
    // 参数
    var args = Array.prototype.slice.call(process.argv, 3);
    // 执行
    exports[methodName].apply(exports, args);
}
