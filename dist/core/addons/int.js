"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Int = /** @class */ (function () {
    function Int() {
    }
    Int.prototype.exec = function (token, value, context, specs, tokens, index) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (context.includes('FUNCTION::CALL')) {
            var remaining = tokens.slice(index + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length))
                .filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return value + ', ';
            }
            else {
                context.pop();
                return value + ')';
            }
        }
        else {
            return value;
        }
    };
    return Int;
}());
exports["default"] = Int;
