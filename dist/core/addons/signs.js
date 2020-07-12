"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Signs = /** @class */ (function () {
    function Signs() {
    }
    Signs.prototype.exec = function (token, value, context, specs, tokens, index) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value] = {
                type: 'aliase'
            };
            return;
        }
        else {
            if (specs.variables[value] && specs.variables[value].type === 'aliase') {
                context.push('FUNCTION::CALL');
                var remaining = tokens.slice(index, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length))
                    .filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
                return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()';
            }
            else {
                return value;
            }
        }
        return value;
    };
    return Signs;
}());
exports["default"] = Signs;
