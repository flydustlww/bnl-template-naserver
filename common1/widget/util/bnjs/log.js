/**
 * 统计相关helper函数
 * @author rangzf
 */

var util = require('common/util/util');

/**
 * mtj打点功能，支持传递自定义变量
 * @example
 * addMTJ({
       eventId: 'CuisineHome_Catlog_${id}',
       eventLable: '美食首页_细分业务点击量_${name}'
   }, {
      id: 'dessert',
    name: "甜点"
   });

 * 如果templates为纯字符串，则可以不必传递data模板变量
 * @param {Object} templates 打点模板
 * @param {Object} data      模板数据
 */
var addMTJ = function (templates, data) {
    var _templates = {
        eventId: templates.eventId,
        eventLabel: templates.eventLabel
    };

    if (data) {
        try {
            _templates.eventId = util.format(templates.eventId, data);
            _templates.eventLabel = util.format(templates.eventLabel, data);
        }
        catch (e) {
            if (__DEV__) {
                console.warn('[addMTJ]', 'format mtj template error with the data passed');
            }

        }
    }

    if (__DEV__) {
        console.log('[BNJS.statistic.addMTJ]', _templates);
    }

    BNJS.statistic.addMTJ(_templates);
};

/**
 * 离线日志
 * @param {Object} templates 模板
 * @param {Object} data      数据
 */
var addLog = function (templates, data) {

    var ComExtraParams = (templates.note || {}).ComExtraParams;
    if (!ComExtraParams || !data) {
        if (__DEV__) {
            console.log('[BNJS.statistic.addLog]', templates);
        }

        return BNJS.statistic.addLog(templates);
    }

    var _templates = $.extend(true, {}, templates);

    var _ComExtraParams = _templates.note.ComExtraParams;
    for (var i in _ComExtraParams) {
        _ComExtraParams[i] = util.format(_ComExtraParams[i], data);
    }

    _templates.note.ComExtraParams = JSON.stringify(_ComExtraParams);
    if (__DEV__) {
        console.log('[BNJS.statistic.addLog]', _templates, _templates.note.ComExtraParams);
    }

    BNJS.statistic.addLog(_templates);
};

module.exports = {
    addLog: addLog,
    addMTJ: addMTJ
};
