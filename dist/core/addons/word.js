"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Word = /** @class */ (function () {
    function Word() {
    }
    Word.prototype.exec = function (token, value, context, specs, tokens, index, built) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (built === void 0) { built = []; }
        if (context.filter(function (x) { return ['CONDITION::DECLARE'].includes(x); }).length > 0) {
            ++specs.current.tabs;
        }
        if (!specs.variables[value]) {
            specs.variables[value] = {
                type: '',
                value: undefined,
                scope: specs.current.tabs,
                name: value
            };
        }
        else {
            if (specs.current.tabs >= specs.variables[value]) {
            }
            else {
                console.log('ERROR: Variable', value, 'does not exists!');
            }
        }
        return value;
    };
    return Word;
}());
exports["default"] = Word;
