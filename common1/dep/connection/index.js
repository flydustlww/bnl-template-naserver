/*
 * connectionJs
 * Analysis browser's navigator.connection type
 * 分析并获取连接类型,可能的返回值为'unknown','ethernet','wifi','2g','3g','4g','none'
 *
 * Author: Jone Casper
 * Email: xu.chenhui@live.com
 */

define(function (require, exports, module) {
    (function(root, name, factory) {
        "use strict";
        /*if (typeof define === 'function' && define.amd) {
            define(function(){
                return factory();
            });
        }else if (typeof module !== 'undefined' && module.exports){
            module.exports = factory();
        }else{
            var namespaces = name.split("."),
                scope = root || this;
            for (var i=0; i<namespaces.length; i++) {
                var p = namespaces[i],
                    ex = scope[p];
                scope = scope[p] = (i === namespaces.length - 1) ? 
                    factory():
                    (ex || {});
            }
        }*/
        module.exports = factory();
    }(this, "connectionJs.getConnectType",function(){
        /*
         * navigator.connection now work on Android, Firefox Mobile (Gecko) and Firefox OS
         */
        var connection = window.navigator.connection||window.navigator.mozConnection||window.navigator.webkitConnection;
        var type_text = ['unknown','ethernet','wifi','2g','3g','4g','none'];

        function getConnectType(){
            if (!connection){
                return "unknown";
            }
            var conn_type = 'unknown';
            if (typeof connection.type === "number" && connection.type < type_text.length){
                conn_type = type_text[connection.type];
            }else{
                conn_type = connection.type;
            }
            if (conn_type === "unknown" || typeof conn_type === "undefined" || typeof connection.bandwidth === "number"){
                if(connection.bandwidth > 10){
                    conn_type = 'wifi';
                }else if(connection.bandwidth > 2){
                    conn_type = '3g';
                }else if(connection.bandwidth > 0){
                    conn_type = '2g';
                }else if(connection.bandwidth == 0){
                    conn_type = 'none';
                }else{
                    conn_type = 'unknown';
                }
            }
            return conn_type;
        }
        return {
            getConnectType:getConnectType
        };
    }));
});
