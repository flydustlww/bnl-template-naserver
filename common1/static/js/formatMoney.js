/*根据rd传进来的金额数（单位分）转化为元，
  常用于前端展示
  songjin
*/
exports.formatMoney = function(x){
    var x = x / 100;
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
          s_x += '0';
    }
    return s_x;
};