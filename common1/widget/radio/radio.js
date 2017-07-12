/*radio组件*/
var EventEmitter = require('widget/util/EventEmitter.js').EventEmitter;
function RadioGroup(config) {

    var configDefault = {
        container: '',
        classname: ''
    };
    var param = $.extend({}, configDefault, config);
    this.$container = $(param.container);
    this.$radios = this.$container.find('.' + param.classname);
    this.bind();
}

$.extend(RadioGroup.prototype, {

    /**
     * 绑定事件
     */
    bind: function () {
        var me = this;
        this.$container.delegate('[type=radio]', 'change', function () {
            var oldValue = me.keyValue;
            var newValue = $(this).val();
            me.keyValue = newValue;
            me.trigger('valuechange', {
                oldValue: oldValue,
                newValue: newValue
            });
        });
    },

    /**
        * 获取单选组当前选中值
        * @returns {*}
    */
    getValue: function () {
        var val = null;
        $.each(this.$radios, function (index, radio) {
            if (radio.checked) {
                val = radio.getAttribute('value') || radio.value;
                // 不再继续接下来的循环，jQuery特有，不能返回除false其他值
                return false;
            }

        });
        this.keyValue = val;
        return val;
    }
});

// 具有事件分发能力
EventEmitter.bind(RadioGroup);
exports.RadioGroup = RadioGroup;
