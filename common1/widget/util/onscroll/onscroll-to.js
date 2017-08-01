/**
 * @file    监听特定方向的滚动
 *
 * @exports (direction: 'up', 'down')

        add: function (direction, handler) {}
            add a listener

        remove: function (direction, handler) {}
            remove listener
 *
 * @author  nighca
 * @date    2015/03/09
 */

define(function (require, exports, module) {

    var onScroll = require('./onscroll');

    // the key for listener bound to handler
    var getKey = function (direction) {
        return '__onscrollTo' + direction.slice(0, 1).toUpperCase() + direction.slice(1) + 'Listener__';
    };

    // add a listener
    var addListener = function (direction, handler) {
        // the real listener
        var listener = handler[getKey(direction)] = function (e) {
            var offset = e.offset;
            switch (direction) {

                case 'up':
                    if (offset < 0) {
                        handler(e);
                    }

                    break;

                case 'down':
                    if (offset >= 0) {
                        handler(e);
                    }

                    break;

                default:
            }
        };

        onScroll.add(listener);
    };

    // remove a listener
    var removeListener = function (direction, handler) {
        // the real listener
        var listener = handler[getKey(direction)];

        if (listener) {
            onScroll.remove(listener);
        }

    };

    module.exports = {
        add: addListener,
        remove: removeListener
    };
});
