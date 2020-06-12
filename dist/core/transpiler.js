"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/
exports.__esModule = true;
var parser_1 = require("./parser");
var tokens_1 = require("./tokens/tokens");
var Transpiler = /** @class */ (function () {
    function Transpiler(content) {
        this.variables = {};
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function () {
        var code = [];
        for (var index in this.content) {
            var line = this.content[index];
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
                                !Array.from(Object.keys(this.variables)).includes(tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].value)) {
                                built.push(', ');
                            }
                            else if (tokens.slice(parseInt(item_token) - 1).filter(function (x) { return x.token !== 'SPACE'; })[0].token === 'SIGNS' &&
                                tokens.slice(parseInt(item_token) + 1).filter(function (x) { return x.token === 'SPACE'; }).length > 0) {
                                built.push('[');
                                context.push('ARRAY');
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
                                if (Array.from(Object.keys(this.variables)).includes(variable_name)) {
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
                        if (Array.from(Object.keys(this.variables)).includes(value)) {
                            built.push(value);
                        }
                        else {
                            if (parseInt(item_token) === 0) {
                                built.push("var " + value);
                                this.variables[value] = '';
                                context.push('VARIABLE');
                            }
                        }
                        break;
                    }
                    case 'SIGNS': {
                        built.push(value);
                        break;
                    }
                    case 'L_PAREN': {
                        if (context.includes('VARIABLE')) {
                            built.push('[');
                            context.push('ARRAY');
                        }
                        break;
                    }
                    case 'R_PAREN': {
                        if (context.includes('VARIABLE')) {
                            built.push(']');
                        }
                        break;
                    }
                }
            }
            for (var context_item in context) {
                if (context.includes('ARRAY')) {
                    built.push(']');
                }
                if (!context.includes('VARIABLE')) {
                    built.push(')');
                }
                context.splice(Number(context_item), 1);
            }
            console.log(built.join(''));
            code.push(built.join(''));
            built = [];
        }
        //eval(code.join('\n'))
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
