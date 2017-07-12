/**
 * @fileoverview 赋予对象或者类以分发自定义事件的能力。
 *     用法：EventEmitter.inject(Class);
 *          EventEmitter.bind(instance);
 *
 *          绑定的对象包含两个方法：trigger 和 on
 *
 * 
 */

'use strict';

var $ = window.Zepto;

function EventEmitter() {
}

/**
 * 订阅事件
 * @param {string} eventName
 * @param {function} handler
 * @param {*} ctx
 * @returns {DropBox}
 */
function on(eventName, handler, ctx) {
    if (!this.handlerManager) {
        this.handlerManager = {};
    }

    if (!this.handlerManager[eventName]) {
        this.handlerManager[eventName] = [];
    }

    this.handlerManager[eventName].push({
        handler: handler,
        ctx: ctx
    });
    return this;
}

/**
 * 触发事件
 * @param {string} eventName
 * @param {*} args
 */
function trigger(eventName, args) {
    if (!this.handlerManager) {
        this.handlerManager = {};
        return this;
    }

    if (!this.handlerManager[eventName]) {
        return this;
    }

    args = Array.prototype.slice.call(arguments, 1);
    var handles = this.handlerManager[eventName];
    for (var i = 0; i < handles.length; ++i) {
        handles[i].handler.apply(handles[i].ctx, args);
    }
}

/**
 * 给指定的对象添加事件分发能力
 * @param {*} obj
 */
EventEmitter.prototype.inject = function (obj) {
    obj.on = on;
    obj.trigger = trigger;
};

/**
 * 给指定的类添加事件分发能力
 * @param {*} Class
 */
EventEmitter.prototype.bind = function (Class) {
    $.extend(Class.prototype, {
        on: on,
        trigger: trigger
    });
};

// 导出
exports.EventEmitter = new EventEmitter();
