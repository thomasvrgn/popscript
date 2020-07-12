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
        if (context.includes('CONDITION::DECLARE')) {
            if (tokens.slice(index + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).length === 0) {
                context = context.filter(function (x) { return x !== 'CONDITION::DECLARE'; });
                return value + '):';
            }
        }
        if (context.includes('FUNCTION::CALL')) {
            var remaining = tokens.slice(index + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return '{value:' + value + '}, ';
            }
            else {
                context.pop();
                return '{value:' + value + '})';
            }
        }
        else if (context.includes('PROPERTY::CALL')) {
            var remaining = tokens.slice(index + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return '{value:' + value + '}, ';
            }
            else {
                context.pop();
                return '{value:' + value + '})';
            }
        }
        else {
            return value;
        }
    };
    return String;
}());
exports["default"] = String;
