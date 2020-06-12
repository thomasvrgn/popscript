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
            var line = this_1.content[index];
            var tokens = parser_1.Tokenizer.tokenize(line);
            var context = [], built = [];
            for (var item_token in tokens) {
                var item = tokens[item_token], value = item.value, token = item.token;
                switch (token) {
                    case 'PRINT': {
                        context.push(token);
                        built.push('console.log(');
                        break;
                    }
                    case 'SPACE': {
                        if (context.includes('PRINT') ||
                            context.includes('VARIABLE')) {
                            if (!['PRINT', 'SIGNS'].includes(tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].token) &&
                                !Array.from(Object.keys(this_1.variables)).includes(tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].value)) {
                                built.push(', ');
                            }
                            else if (tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].token === 'SIGNS' &&
                                tokens.slice(parseInt(item_token) + 1).filter(function (x) { return x.token === 'SPACE'; }).length > 0) {
                                built.push('[');
                                context.push('ARRAY');
                                this_1.variables[built[0].replace('var ', '')] = 'array';
                            }
                        }
                        else {
                            if (context.includes('ARGUMENTS')) {
                                if (tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].token !== 'ARGUMENTS' &&
                                    tokens.slice(parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).length > 0) {
                                    built.push(', ');
                                }
                            }
                            else {
                                built.push(' ');
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
                            built.push(value.replace(/"/g, '`'));
                        }
                        else {
                            built.push(value);
                        }
                        break;
                    }
                    case 'WORD': {
                        if (Array.from(Object.keys(this_1.variables)).includes(value)) {
                            built.push(value);
                        }
                        else {
                            if (parseInt(item_token) === 0) {
                                if (this_1.functions.includes(value)) {
                                    built.push(value);
                                    context.push('FUNCTION_CALL');
                                }
                                else {
                                    built.push("var " + value);
                                    this_1.variables[value] = '';
                                    context.push('VARIABLE');
                                }
                            }
                            else {
                                if (context[context.length - 1] === 'FUNCTION') {
                                    built.push(value);
                                    this_1.functions.push(value);
                                }
                                else if (context.includes('ARGUMENTS')) {
                                    built.push(value);
                                    if (tokens.slice(parseInt(item_token) + 1).filter(function (x) { return x.token !== 'SPACE'; }).length === 0) {
                                        built.push('):');
                                    }
                                }
                                else {
                                    console.log(line);
                                }
                            }
                        }
                        break;
                    }
                    case 'SIGNS': {
                        built.push(value);
                        break;
                    }
                    case 'INDEX': {
                        if (tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).pop().token === 'WORD') {
                            if (this_1.variables[tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).pop().value] === 'array') {
                                built.push('[');
                                context.push('INDEX');
                            }
                        }
                        break;
                    }
                    case 'INT': {
                        built.push(value);
                        context.filter(function (x) { return x === 'INDEX'; }).map(function (x) { return built.push(']'); });
                        break;
                    }
                    case 'L_PAREN': {
                        if (context.includes('VARIABLE')) {
                            built.push('[');
                            context.push('ARRAY');
                        }
                        else if (context[context.length - 1] === 'FUNCTION_CALL') {
                            built.push('(');
                        }
                        break;
                    }
                    case 'R_PAREN': {
                        if (context.includes('VARIABLE')) {
                            built.push(']');
                        }
                        else if (context[context.length - 1] === 'FUNCTION_CALL') {
                            built.push(')');
                        }
                        break;
                    }
                    case 'FUNCTION': {
                        built.push('function');
                        context.push('FUNCTION');
                        break;
                    }
                    case 'ARGUMENTS': {
                        if (context[context.length - 1] === 'FUNCTION') {
                            built.push('(');
                            context.push(token);
                        }
                        break;
                    }
                    case 'TABS': {
                        built.push(value);
                        break;
                    }
                }
            }
            for (var context_item in context) {
                if (context.includes('ARRAY')) {
                    built.push(']');
                }
                if (!context.includes('VARIABLE') &&
                    !context.includes('FUNCTION') &&
                    !context.includes('FUNCTION_CALL')) {
                    built.push(')');
                }
                context.splice(Number(context_item), 1);
            }
            console.log(built.join(''));
            code.push(built.join(''));
            built = [];
        };
        var this_1 = this;
        for (var index in this.content) {
            _loop_1(index);
        }
        console.log(new tabdown_1["default"](code).tab().join('\n'));
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
