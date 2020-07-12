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
        if (!specs.variables[value]) {
            if (tokens.slice(0, index).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); })[0] && tokens.slice(0, index).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); })[0].token !== 'IMPORT') {
                specs.variables[value] = {
                    type: ''
                };
            }
            else if (tokens.slice(0, index).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); })[0] && tokens.slice(0, index).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); })[0].token === 'IMPORT') {
                specs.variables[value] = {
                    type: 'module'
                };
            }
        }
        specs.current.variable = value;
        if (context.includes('FUNCTION::DECLARE')) {
            context.pop();
            context.push('FUNCTION::ARGUMENTS');
            specs.variables[value].type = 'function';
            return value + '.value = function (';
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
            var remaining = tokens.slice(index + 3, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()';
        }
        else if (specs.variables[value] && specs.variables[value].type === 'function') {
            context.push('FUNCTION::CALL');
            var remaining = tokens.slice(index + 3, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            return remaining.length > 0 ? value + '.value' + '(' : value + '.value' + '()';
        }
        else if (context.includes('FUNCTION::CALL')) {
            var remaining = tokens.slice(index + 2, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return value + ', ';
            }
            else {
                context.pop();
                return value + ')';
            }
        }
        else if (context.includes('PROPERTY::DECLARE')) {
            context.pop();
            context.push('PROPERTY::ARGUMENTS');
            specs.variables[value].type = 'prototype';
            return value + '.value = function (self, ';
        }
        else if (context.includes('PROPERTY::ARGUMENTS')) {
            var remaining = tokens.slice(index + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return value + ', ';
            }
            else {
                return value + '):';
            }
        }
        else if (specs.variables[value] && specs.variables[value].type === 'prototype') {
            var built_copy = built[built.length - 1];
            built[built.length - 1] = value + '.value(';
            built.push(built_copy);
            context.push('PROPERTY::CALL');
            var remaining = tokens.slice(index + 3, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            return remaining.length > 0 ? ', ' : +')';
        }
        else if (context.includes('PROPERTY::CALL')) {
            var remaining = tokens.slice(index + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) === -1 ? tokens.length : tokens.findIndex(function (x) { return x.token === 'AFTER'; }))).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
            if (remaining.length > 0) {
                return value + ', ';
            }
            else {
                context.pop();
                return value + ')';
            }
        }
        else {
            var variable = tokens.slice(index + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); })[0];
            if (variable && specs.variables[variable.value] && specs.variables[variable.value].type.length > 0) {
                if (specs.variables[variable.value].type === 'module') {
                    return;
                }
                else {
                    return value;
                }
            }
            else if (value && specs.variables[value] && specs.variables[value].type.length > 0) {
                if (specs.variables[value].type === 'module') {
                    console.log(specs);
                    return;
                }
                else {
                    return value;
                }
            }
            return !context.includes('LOOP::DECLARE') ? value + '.value' : value;
        }
    };
    return Word;
}());
exports["default"] = Word;
