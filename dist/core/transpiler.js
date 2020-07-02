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
                    }
                }
            }
        }
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
