"use strict";
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/*//////////////////////////////////////
               Quark lang
                 Parser
//////////////////////////////////////*/
exports.__esModule = true;
var tokenizer_1 = require("./tokenizer");
var tokens_1 = require("./tokens/tokens");
var types_1 = require("../interfaces/types");
var Parser = /** @class */ (function () {
    function Parser(code) {
        this.ast = {
            type: types_1.Types.Program,
            raw: '',
            children: []
        };
        this.tokens = [];
        this.code = code
            .split(/\r?\n/g)
            .filter(function (x) { return x.length > 0; })
            .join('');
        tokenizer_1["default"].addTokenSet(tokens_1["default"]);
        this.tokens = tokenizer_1["default"].tokenize(this.code);
    }
    Parser.prototype.init = function () {
        this.tokens = this.tokens.filter(function (x) { return x.token !== 'SPACE'; });
        return this.ast;
    };
    return Parser;
}());
exports["default"] = Parser;
