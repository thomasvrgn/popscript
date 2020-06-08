"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Parser
//////////////////////////////////*/
exports.__esModule = true;
exports.Tokenizer = void 0;
var scanner_1 = require("./scanner");
var Tokenizer = /** @class */ (function () {
    function Tokenizer() {
    }
    Tokenizer.addTokenSet = function (tokenSet) {
        for (var key in tokenSet) {
            this.tokens[key] = tokenSet[key];
        }
    };
    Tokenizer.tokenize = function (string) {
        return scanner_1.scanner(string, this);
    };
    Tokenizer.tokens = {};
    Tokenizer.customOut = {};
    Tokenizer.ignore = {};
    Tokenizer.functions = {};
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
