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
    function Transpiler(file_content) {
        this.content = [];
        this.tabsize = 0;
        this.code = [];
        this.specs = {
            currents: {
                variable: '',
                prototype: '',
                "function": '',
                count_args: 0
            },
            variables: {},
            functions: {},
            prototypes: {}
        };
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = file_content.split(/\n/g).filter(function (x) { return x.trim().length > 0; });
    }
    Transpiler.prototype.transpile = function () {
        for (var index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                var line = this.content[index], tokens = parser_1.Tokenizer.tokenize(line), context = [], built = [], depth = 0;
                for (var token_index in tokens) {
                    if (tokens.hasOwnProperty(token_index)) {
                        var item = tokens[token_index], value = item.value, token = item.token;
                        switch (token) {
                            case 'WORD': {
                                // Variable exist checking
                                if (!this.specs.variables[value]) {
                                    this.specs.variables[value] = {
                                        type: ''
                                    };
                                }
                                // Word processing
                                // Function name
                                if (context.includes('FUNCTION::DECLARE')) {
                                    built.push(value + ' = function (');
                                    context.pop();
                                    context.push('FUNCTION::ARGUMENTS');
                                    this.specs.variables[value].type = 'function';
                                }
                                // Function arguments
                                else if (context.includes('FUNCTION::ARGUMENTS')) {
                                    built.push(value);
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['TABS', 'SPACE'].includes(x.token); }).length > 0) {
                                        built.push(', ');
                                    }
                                    else {
                                        built.push('):');
                                        context.pop();
                                    }
                                }
                                // Looped variable
                                else if (context.includes('LOOP::DECLARE')) {
                                    built.push(value);
                                    context.pop();
                                }
                                // Looped array
                                else if (context.includes('LOOP::ARRAY')) {
                                    built.push(value);
                                    context.pop();
                                    built.push('):');
                                }
                                // Function call
                                else if (this.specs.variables[value] && this.specs.variables[value].type === 'function') {
                                    built.push(value);
                                    var fn_args = tokens.slice(parseInt(token_index) + 3, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length)).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
                                    context.pop();
                                    if (fn_args && fn_args.length > 0) {
                                        built.push('(');
                                        context.push('FUNCTION::CALL');
                                    }
                                    else {
                                        built.push('()');
                                    }
                                }
                                // Function call arguments
                                else if (context.includes('FUNCTION::CALL')) {
                                    built.push(value);
                                    var fn_args = tokens.slice(parseInt(token_index) + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length)).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
                                    if (fn_args && fn_args.length > 0) {
                                        built.push(', ');
                                    }
                                    else {
                                        built.push(')');
                                        context.pop();
                                    }
                                }
                                // Variable sue
                                else {
                                    built.push(value);
                                }
                                break;
                            }
                            case 'STRING':
                            case 'INT': {
                                if (context.includes('FUNCTION::CALL')) {
                                    built.push(value);
                                    var fn_args = tokens.slice(parseInt(token_index) + 1, (tokens.findIndex(function (x) { return x.token === 'AFTER'; }) || tokens.length)).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); });
                                    if (fn_args && fn_args.length > 0) {
                                        built.push(', ');
                                    }
                                    else {
                                        built.push(')');
                                        context.pop();
                                    }
                                }
                                else {
                                    built.push(value);
                                }
                                break;
                            }
                            case 'SIGNS': {
                                built.push(" " + value + " ");
                                break;
                            }
                            case 'FUNCTION': {
                                context.push('FUNCTION::DECLARE');
                                break;
                            }
                            case 'AFTER': {
                                built.push(', ');
                                break;
                            }
                            case 'MULTIPLES': {
                                built.push('...');
                                break;
                            }
                            case 'LOOP': {
                                built.push('for (');
                                context.push('LOOP::DECLARE');
                                break;
                            }
                            case 'IN': {
                                built.push(' of ');
                                context.push('LOOP::ARRAY');
                                break;
                            }
                            case 'NATIVE': {
                                var native_content = value.match(/".*?"/g)[0];
                                built.push(native_content.slice(1, native_content.length - 1));
                                break;
                            }
                            case 'TABS': {
                                if (!this.tabsize)
                                    this.tabsize = value.length;
                                depth = value.length / this.tabsize;
                                built.push(value);
                                break;
                            }
                        }
                    }
                }
                context = [];
                this.code.push(built.join(''));
            }
        }
        this.code.unshift('var ' + Object.keys(this.specs.variables).join(', '));
        console.log(new tabdown_1["default"](this.code.map(function (x) { return x.replace(/'/g, '"'); })).tab().join('\n'));
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
