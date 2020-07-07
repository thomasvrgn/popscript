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
                                if (!this.specs.variables[value]) {
                                    this.specs.variables[value] = {
                                        type: ''
                                    };
                                }
                                break;
                            }
                            case 'TABS': {
                                if (!this.tabsize)
                                    this.tabsize = value.length;
                                depth = value.length / this.tabsize;
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
        console.log(this.code);
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
