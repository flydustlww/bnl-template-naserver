/**
 * @file    message with image
 * @author  zhoufei04
 * @since   2015-11-11
 */

var util = require('../util');

// ensure that method calling before BNJS ready causes error.
util.ready(function (BNJS) {

    var image = {
        error: {
            src: require('./img/errorpage.png'),
            size: [117, 128]
        },
        loading: {
            src: require('./img/loading.png'),
            size: [160.5, 85]
        }
    };

    exports.show = function (wrapper, options) {
        var text = options.text || '';
        var type = options.type || 'error';
        var img = image[type];

        var $msgbox = $('#j-bnjs-messagepage-hook');

        if (!$msgbox.length) {
            $(wrapper).html('<div id="j-bnjs-messagepage-hook"></div>');
            $msgbox = $('#j-bnjs-messagepage-hook');
        }

        var html = '';
        html += '<div id="j-bnjs-messagepage-hook" data-type="' + type + '"';
        html += 'class="bnjs-messagepage-hook" style="text-align:center;">';
        html += '<div class="bnjs-messagepage-img-wrap">';
        html += '<img src="' + img.src + '" alt="" width="' + img.size[0] + '" height="' + img.size[1] + '" />';
        html += '</div>';
        html += '<div class="bnjs-messagepage-text" style="margin:10px 0 0;color:#88888d;">' + text + '</div>';
        html += '</div>';

        $msgbox.html(html);

    };

    exports.hide = function () {
        var $msgbox = $('#j-bnjs-messagepage-hook');
        if ($msgbox.length) {
            $msgbox.hide();
        }
    };
});

