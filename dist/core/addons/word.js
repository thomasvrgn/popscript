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
        if (!specs.variables[value] || specs.variables[value] === undefined) {
            specs.variables[value] = {
                type: '',
                value: undefined,
                scope: specs.current.tabs,
                name: value
            };
            for (var variable in specs.variables) {
                if (specs.variables[variable] && specs.variables[variable].scope < specs.current.tabs) {
                    specs.variables[variable] = undefined;
                }
            }
            if (context.length === 0) {
                built.push('var ' + value);
            }
        }
        if (context.includes('FUNCTION::ARGUMENTS')) {
            var remaining = tokens.slice(index + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS', 'CALL'].includes(x.token); });
            specs.variables[specs.current.variable].arguments.push({
                name: value,
                mutable: false
            });
            console.log(JSON.stringify(specs.variables[specs.current.variable], null, 2));
            built.push(remaining.length > 0 ? value + ', ' : value + '):');
        }
        else if (context.includes('FUNCTION::DECLARE')) {
            context.push('FUNCTION::ARGUMENTS');
            var remaining = tokens.slice(index + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS', 'CALL'].includes(x.token); });
            specs.current.variable = value;
            if (!specs.variables[value] || specs.variables[value].type !== 'function') {
                specs.variables[value] = {
                    type: 'function',
                    value: undefined,
                    scope: specs.current.tabs,
                    name: value,
                    arguments: []
                };
            }
            built.push(remaining.length > 0 ? value + ' (' : value + ' ()');
        }
        return;
    };
    return Word;
}());
exports["default"] = Word;
