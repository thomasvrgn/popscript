"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Signs = /** @class */ (function () {
    function Signs() {
    }
    Signs.prototype.exec = function (token, value, context, specs, tokens, index, built) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (built === void 0) { built = []; }
        if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value] = {
                type: 'aliase'
            };
            return;
        }
        else {
            if (specs.variables[value] && specs.variables[value].type === 'aliase') {
                if (specs.variables[specs.variables[value].aliase].type === 'prototype') {
                    context.push('PROPERTY::CALL');
                    var built_copy = built[built.length - 1];
                    built[built.length - 1] = specs.variables[value].aliase + '(';
                    built.push(built_copy);
                    var remaining = tokens.slice(index + 2, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length))
                        .filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
                    return remaining.length > 0 ? ', ' : +')';
                }
                else {
                    context.push('FUNCTION::CALL');
                    var remaining = tokens.slice(index, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length))
                        .filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
                    return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()';
                }
            }
            else {
                if (context.includes('CONDITION::DECLARE')) {
                    if (value === '=') {
                        return '==';
                    }
                    else {
                        return value;
                    }
                }
                else {
                    return value;
                }
            }
        }
    };
    return Signs;
}());
exports["default"] = Signs;
