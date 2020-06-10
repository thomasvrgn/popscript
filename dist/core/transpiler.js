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
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function () {
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
                        break;
                    }
                    case 'STRING': {
                        built.push(value);
                        break;
                    }
                }
            }
            for (var context_item in context) {
                context.splice(Number(context_item), 1);
                built.push(')');
            }
            eval(built.join(''));
            built = [];
        }
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
