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
                                    this.specs.prototypes[value] = {};
                                    this.specs.currents.prototype = value;
                                    context.push('PROTOTYPE::TYPE');
                                }
                                else if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    built.unshift(value);
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).filter(function (x) { return x.token === 'CALL'; }).length === 0) {
                                        built.push(' = function ():');
                                    }
                                }
                                else if (context.slice(-1)[0] === 'PROTOTYPE::ARGUMENTS') {
                                    if (!this.specs.prototypes[this.specs.currents.prototype].arguments)
                                        this.specs.prototypes[this.specs.currents.prototype].arguments = {};
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).length > 0) {
                                        built.push(value + ', ');
                                    }
                                    else {
                                        built.push(value + '):');
                                    }
                                    this.specs.prototypes[this.specs.currents.prototype].arguments[value] = '';
                                    this.specs.variables[value] = '';
                                }
                                else if (context.slice(-1)[0] === 'PROTOTYPE::CALL::ARGUMENTS') {
                                    built.push(value);
                                    ++this.specs.currents.count_args;
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).length > 0) {
                                        built.push(', ');
                                    }
                                    else {
                                        built.push(')');
                                    }
                                }
                                else if (context.slice(-1)[0] === 'ALIASE::DECLARE') {
                                    built.push('.');
                                    built.push(value);
                                    this.specs.prototypes[value] = {};
                                    this.specs.currents.prototype = value;
                                    context.push('ALIASE::PROTOTYPE');
                                }
                                else if (context.slice(-1)[0] === 'ALIASE::PROTOTYPE') {
                                    var type = this.specs.prototypes[value].type;
                                    if (type === 'string')
                                        built.unshift('String');
                                    else if (type === 'array')
                                        built.unshift('Array');
                                    else if (type === 'int')
                                        built.unshift('Number');
                                    else if (type === 'any')
                                        built.unshift('Object');
                                    built.push(' = ' + value);
                                    this.specs.prototypes[this.specs.currents.prototype] = this.specs.prototypes[value];
                                }
                                else if (context.slice(-1)[0] === 'FUNCTION::ARGUMENTS') {
                                    if (!this.specs.functions[this.specs.currents["function"]].arguments)
                                        this.specs.functions[this.specs.currents["function"]].arguments = {};
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).length > 0) {
                                        built.push(value + ', ');
                                    }
                                    else {
                                        built.push(value + '):');
                                    }
                                    this.specs.functions[this.specs.currents["function"]].arguments[value] = '';
                                    this.specs.variables[value] = '';
                                }
                                else if (this.specs.variables[value] !== undefined) {
                                    built.push(value);
                                    context.push('VARIABLE::USE');
                                }
                                else if (this.specs.prototypes[value] !== undefined) {
                                    built.push('.' + value);
                                    context.push('PROTOTYPE::CALL');
                                    this.specs.currents.prototype = value;
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).filter(function (x) { return x.token === 'CALL'; }).length === 0) {
                                        built.push('()');
                                    }
                                }
                                else if (context.slice(-1)[0] === 'FUNCTION::DECLARE') {
                                    context.push('FUNCTION::NAME');
                                    built.push(value);
                                    this.specs.functions[value] = {};
                                    this.specs.currents["function"] = value;
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).filter(function (x) { return x.token === 'CALL'; }).length === 0) {
                                        built.push('():');
                                    }
                                }
                                else {
                                    built.push("var " + value + " ");
                                    this.specs.variables[value] = '';
                                    this.specs.currents.variable = value;
                                    context.push('VARIABLE::DECLARE');
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
                                else if (context.slice(-1)[0] === 'PROTOTYPE::CALL') {
                                    built.push('(');
                                    context.push('PROTOTYPE::CALL::ARGUMENTS');
                                }
                                else if (context.slice(-1)[0] === 'FUNCTION::NAME') {
                                    built.push('(');
                                    context.push('FUNCTION::ARGUMENTS');
                                }
                                break;
                            }
                            case 'ALIASE': {
                                built.push('.prototype');
                                context.push('ALIASE::DECLARE');
                                break;
                            }
                            case 'STRING':
                            case 'INT': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::CALL::ARGUMENTS') {
                                    built.push(value);
                                    this.specs.prototypes[this.specs.currents.prototype].arguments[Object.keys(this.specs.prototypes[this.specs.currents.prototype].arguments)[this.specs.currents.count_args]] = 'string';
                                    ++this.specs.currents.count_args;
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).length > 0) {
                                        built.push(', ');
                                    }
                                    else if (this.specs.currents.count_args === Object.values(this.specs.prototypes[this.specs.currents.prototype].arguments).length) {
                                        built.push(')');
                                    }
                                    else {
                                        built.push(')');
                                    }
                                }
                                else if (context.slice(-1)[0] === 'VARIABLE::DECLARE') {
                                    this.specs.variables[this.specs.currents.variable] = 'string';
                                    built.push(value);
                                }
                                else {
                                    if (token === 'INT')
                                        built.push('(' + value + ')');
                                    else
                                        built.push(value);
                                    var prototype_name = tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['TABS', 'SPACE', 'CALL'].includes(x.token); });
                                    if (prototype_name && prototype_name[0] && prototype_name[0].token === 'WORD') {
                                        if (this.specs.prototypes[prototype_name[0].value]) {
                                            var type = this.specs.prototypes[prototype_name[0].value].type;
                                            if (type !== 'any') {
                                                if (type !== token.toLowerCase()) {
                                                    throw new Error('Property type is ' + type + ' and value is ' + token.toLowerCase() + '!');
                                                }
                                            }
                                        }
                                        else {
                                            throw new Error('Property ' + prototype_name[0].value + 'does not exists!');
                                        }
                                    }
                                    else if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return x.token === 'CALL'; }).filter(function (x) { return !['TABS', 'SPACE'].includes(x.token); }).length > 0) {
                                        throw new Error('No properties were specified!');
                                    }
                                }
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
                                    this.specs.prototypes[this.specs.currents.prototype].type = value;
                                    if (tokens.slice(parseInt(token_index) + 1).filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).filter(function (x) { return x.token === 'CALL'; }).length === 0) {
                                        built.push(' = function ():');
                                    }
                                }
                                break;
                            }
                            case 'FUNCTION': {
                                context.push('FUNCTION::DECLARE');
                                built.push('function ');
                                break;
                            }
                            case 'SIGNS': {
                                built.push(value);
                                break;
                            }
                            case 'SPACE': {
                                break;
                            }
                            case 'TABS': {
                                if (parseInt(token_index) === 0) {
                                    built.push(value);
                                }
                                break;
                            }
                        }
                    }
                }
                context = [];
                this.code.push(built.join(''));
            }
        }
        console.log(new tabdown_1["default"](this.code).tab());
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
