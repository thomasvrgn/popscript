"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var String = /** @class */ (function () {
    function String() {
    }
    String.prototype.exec = function (token, value, context, specs, tokens, index) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (specs.variables[value.slice(1, value.length)] && specs.variables[value.slice(1, value.length)].type === 'function') {
            context.push('FUNCTION::CALL');
            var remaining = tokens.slice(index + 3, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length))
                .filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            return remaining.length > 0 ? value + '(' : value + '()';
        }
        else if (context.includes('FUNCTION::CALL')) {
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
    return String;
}());
exports["default"] = String;
