"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/
exports.__esModule = true;
var parser_1 = require("./parser");
var tokens_1 = require("./tokens/tokens");
var Transpiler = /** @class */ (function () {
    function Transpiler(file_content) {
        this.content = [];
        this.specs = {
            variables: {},
            functions: {}
        };
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = file_content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function () {
        for (var index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                var line = this.content[index], tokens = parser_1.Tokenizer.tokenize(line), context = [], built = [];
                for (var token_index in tokens) {
                    if (tokens.hasOwnProperty(token_index)) {
                        var item = tokens[token_index], value = item.value, token = item.token;
                        switch (token) {
                            case 'PROTOTYPE': {
                                built.push('.prototype');
                                context.push('PROTOTYPE::DECLARE');
                                break;
                            }
                            case 'WORD': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::INFORMATIONS') {
                                    built.push(value);
                                    context.push('PROTOTYPE::TYPE');
                                }
                                else if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    built.unshift(value);
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).filter(function (x) { return x.token === 'CALL'; }).length === 0) {
                                        built.push(' = function ():');
                                    }
                                }
                                else if (context.slice(-1)[0] === 'PROTOTYPE::ARGUMENTS') {
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).length > 0) {
                                        built.push(value + ', ');
                                    }
                                    else {
                                        built.push(value + '):');
                                    }
                                }
                                break;
                            }
                            case 'CALL': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::DECLARE') {
                                    built.push('.');
                                    context.push('PROTOTYPE::INFORMATIONS');
                                }
                                else if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    built.push(' = function (');
                                    context.push('PROTOTYPE::ARGUMENTS');
                                }
                                break;
                            }
                            case 'TYPES': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    if (value === 'string')
                                        built.unshift('String');
                                    else if (value === 'array')
                                        built.unshift('Array');
                                    else if (value === 'int')
                                        built.unshift('Number');
                                    else if (value === 'any')
                                        built.unshift('Object');
                                }
                                break;
                            }
                        }
                    }
                }
            }
            console.log(built.join(''));
        }
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
