"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/
exports.__esModule = true;
var parser_1 = require("./parser");
var tokens_1 = require("./tokens/tokens");
var tabdown_1 = require("./tabdown");
var Transpiler = /** @class */ (function () {
    function Transpiler(content) {
        this.variables = {};
        this.functions = [];
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function () {
        var code = [];
        var _loop_1 = function (index) {
            if (this_1.content.hasOwnProperty(index)) {
                var line = this_1.content[index];
                var tokens = parser_1.Tokenizer.tokenize(line);
                var context = [], built_1 = [], var_name = void 0;
                for (var item_token in tokens) {
                    if (tokens.hasOwnProperty(item_token)) {
                        var item = tokens[item_token], value = item.value, token = item.token;
                        switch (token) {
                            case 'PRINT': {
                                context.push(token);
                                built_1.push('console.log(');
                                break;
                            }
                            case 'SPACE': {
                                if (context.includes('PRINT') ||
                                    context.includes('VARIABLE')) {
                                    if (tokens.slice(parseInt(item_token) - 1)
                                        .filter(function (x) { return x.token !== 'SPACE'; })
                                        .filter(function (x) { return ['PRINT', 'SIGNS'].includes(x.token); }).length === 0) {
                                        built_1.push(', ');
                                    }
                                    else if (tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].token === 'SIGNS' &&
                                        tokens.slice(parseInt(item_token) + 1).filter(function (x) { return x.token === 'SPACE'; }).length > 0) {
                                        built_1.push('[');
                                        context.push('ARRAY');
                                        this_1.variables[built_1[0].replace('var ', '')] = 'array';
                                    }
                                }
                                else {
                                    if (context.includes('ARGUMENTS')) {
                                        if (tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].token !== 'ARGUMENTS' &&
                                            tokens.slice(parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).length > 0) {
                                            built_1.push(', ');
                                        }
                                    }
                                    else {
                                        built_1.push(' ');
                                    }
                                }
                                break;
                            }
                            case 'STRING': {
                                var match = value.match(/::\w+::?/g);
                                if (match) {
                                    for (var _i = 0, match_1 = match; _i < match_1.length; _i++) {
                                        var occurrence = match_1[_i];
                                        var variable_name = occurrence.slice(2, occurrence.length - 2);
                                        if (Array.from(Object.keys(this_1.variables)).includes(variable_name)) {
                                            value = value.replace(occurrence, '${' + variable_name + '}');
                                        }
                                        else {
                                            throw 'VARIABLE CALLED "' + variable_name + '" DOES NOT EXISTS!';
                                        }
                                    }
                                    built_1.push(value.replace(/"/g, '`'));
                                }
                                else {
                                    built_1.push(value);
                                }
                                if (context.includes('VARIABLE')) {
                                    this_1.variables[var_name] = 'string';
                                }
                                if (['JOIN', 'SPLIT'].includes(context[context.length - 1])) {
                                    built_1.push(')');
                                }
                                break;
                            }
                            case 'JOIN':
                            case 'SPLIT': {
                                built_1.push("." + value.toLowerCase() + "(");
                                context.push(token);
                                break;
                            }
                            case 'WORD': {
                                if (Array.from(Object.keys(this_1.variables)).includes(value)) {
                                    built_1.push(value);
                                }
                                else {
                                    if (parseInt(item_token) === 0) {
                                        if (this_1.functions.includes(value)) {
                                            built_1.push(value);
                                            context.push('FUNCTION_CALL');
                                        }
                                        else {
                                            built_1.push("var " + value);
                                            this_1.variables[value] = '';
                                            context.push('VARIABLE');
                                            var_name = value;
                                        }
                                    }
                                    else {
                                        if (context[context.length - 1] === 'FUNCTION') {
                                            built_1.push(value);
                                            this_1.functions.push(value);
                                        }
                                        else if (context.includes('ARGUMENTS')) {
                                            built_1.push(value);
                                            this_1.variables[value] = '';
                                            if (tokens.slice(parseInt(item_token) + 1).filter(function (x) { return x.token !== 'SPACE'; }).length === 0) {
                                                built_1.push('):');
                                            }
                                        }
                                        else {
                                            built_1.push(value);
                                        }
                                    }
                                }
                                break;
                            }
                            case 'SIGNS': {
                                built_1.push(value);
                                break;
                            }
                            case 'ADD': {
                                var variable = tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).reverse()[0];
                                if (!variable)
                                    break;
                                var_name = variable.value;
                                if (this_1.variables[var_name] === 'string')
                                    built_1.push('+=');
                                else if (this_1.variables[var_name] === 'array') {
                                    built_1.push('.push(');
                                    context.push('ADD');
                                }
                                else if (this_1.variables[var_name] === 'number')
                                    built_1.push('+=');
                                break;
                            }
                            case 'REMOVE': {
                                var variable = tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).reverse()[0];
                                if (!variable)
                                    break;
                                var_name = variable.value;
                                if (this_1.variables[var_name] === 'string') {
                                    built_1.push("= " + var_name + ".replace(");
                                    context.push('REMOVE');
                                }
                                else if (this_1.variables[var_name] === 'array') {
                                    built_1.push("= " + var_name + ".filter(x => x !== ");
                                    context.push('REMOVE');
                                }
                                else if (this_1.variables[var_name] === 'number')
                                    built_1.push('-=');
                                break;
                            }
                            case 'INDEX': {
                                if (tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).pop().token === 'WORD' &&
                                    tokens.slice(parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; })[0].token === 'INT') {
                                    if (this_1.variables[tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).pop().value] === 'array') {
                                        built_1.push('[');
                                        context.push('INDEX');
                                    }
                                }
                                else if (['WORD', 'STRING'].includes(tokens.slice(0, parseInt(item_token) - 1)
                                    .filter(function (x) { return x.token !== 'SPACE'; })[tokens.slice(0, parseInt(item_token) - 1)
                                    .filter(function (x) { return x.token !== 'SPACE'; }).length - 1].token) ||
                                    ['WORD', 'STRING'].includes(tokens.slice(0, parseInt(item_token))
                                        .filter(function (x) { return x.token !== 'SPACE'; })[tokens.slice(0, parseInt(item_token))
                                        .filter(function (x) { return x.token !== 'SPACE'; }).length - 1].token)) {
                                    built_1.push('.');
                                }
                                break;
                            }
                            case 'INT': {
                                built_1.push(value);
                                context.filter(function (x) { return x === 'INDEX'; }).map(function (x) { return built_1.push(']'); });
                                break;
                            }
                            case 'L_PAREN': {
                                if (context.includes('VARIABLE')) {
                                    built_1.push('[');
                                    context.push('ARRAY');
                                }
                                else if (context[context.length - 1] === 'FUNCTION_CALL') {
                                    built_1.push('(');
                                }
                                break;
                            }
                            case 'R_PAREN': {
                                if (context.includes('VARIABLE')) {
                                    built_1.push(']');
                                }
                                else if (context[context.length - 1] === 'FUNCTION_CALL') {
                                    built_1.push(')');
                                }
                                break;
                            }
                            case 'FUNCTION': {
                                built_1.push('function');
                                context.push('FUNCTION');
                                break;
                            }
                            case 'ARGUMENTS': {
                                if (context[context.length - 1] === 'FUNCTION') {
                                    built_1.push('(');
                                    context.push(token);
                                }
                                break;
                            }
                            case 'TABS': {
                                built_1.push(value);
                                break;
                            }
                        }
                    }
                }
                for (var context_item in context) {
                    if (context.hasOwnProperty(context_item)) {
                        if (context.includes('ARRAY')) {
                            built_1.push(']');
                        }
                        if (!context.includes('VARIABLE') &&
                            !context.includes('FUNCTION') &&
                            !context.includes('FUNCTION_CALL') &&
                            !context.includes('JOIN') &&
                            !context.includes('SPLIT')) {
                            if (context.includes('ADD') || context.includes('REMOVE')) {
                                if (this_1.variables[var_name] === 'string')
                                    built_1.push(', "")');
                                else if (this_1.variables[var_name] === 'array')
                                    built_1.push(')');
                            }
                            else {
                                built_1.push(')');
                            }
                        }
                        context.splice(Number(context_item), 1);
                    }
                }
                code.push(built_1.join(''));
                built_1 = [];
            }
        };
        var this_1 = this;
        for (var index in this.content) {
            _loop_1(index);
        }
        eval(new tabdown_1["default"](code).tab().join('\n'));
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
