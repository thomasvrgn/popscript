"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Word = /** @class */ (function () {
    function Word() {
    }
    Word.prototype.exec = function (token, value, context, specs) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
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
            return value;
        }
        return;
    };
    return Word;
}());
exports["default"] = Word;
