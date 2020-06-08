"use strict";
exports.__esModule = true;
exports.Tokenizer = void 0;
var scanner_1 = require("./scanner");
var Tokenizer = /** @class */ (function () {
    function Tokenizer() {
    }
    Tokenizer.prototype.addTokenSet = function (tokenSet) {
        for (var key in tokenSet)
            this.tokens[key] = tokenSet[key];
    };
    Tokenizer.prototype.tokenize = function (string) {
        return scanner_1.scanner(string, this);
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
