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
        specs.current.variable = value;
        if (context.includes('FUNCTION::DECLARE')) {
            context.pop();
            context.push('FUNCTION::ARGUMENTS');
            specs.variables[value].type = 'function';
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
        else if (context.includes('LOOP::ARRAY')) {
            return value + '):';
        }
        else if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value].type = 'aliase';
        }
        else if (context.includes('ALIASE::FUNCTION')) {
            context.pop();
            specs.variables[Object.keys(specs.variables).slice(-1)[0]]['aliase'] = value;
        }
        else if (specs.variables[value] && specs.variables[value].type === 'aliase') {
            context.push('FUNCTION::CALL');
            var remaining = tokens.slice(index + 3, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length))
                .filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()';
        }
        else if (specs.variables[value] && specs.variables[value].type === 'function') {
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
    return Word;
}());
exports["default"] = Word;
