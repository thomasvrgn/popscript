"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Word = /** @class */ (function () {
    function Word() {
    }
    Word.prototype.exec = function (token, value, context, specs, tokens, index) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (!specs.variables[value]) {
            specs.variables[value] = {
                type: ''
            };
        }
        if (context.includes('FUNCTION::DECLARE')) {
            context.pop();
            context.push('FUNCTION::ARGUMENTS');
            return value + ' = function (';
        }
        else if (context.includes('FUNCTION::ARGUMENTS')) {
            var remaining = tokens.slice(index + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return value + ', ';
            }
            else {
                return value + '):';
            }
        }
        return;
    };
    return Word;
}());
exports["default"] = Word;
