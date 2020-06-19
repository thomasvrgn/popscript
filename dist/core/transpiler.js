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
        this.functions = [];
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function () {
        var code = [];
        for (var index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                var line = this.content[index];
                var tokens = parser_1.Tokenizer.tokenize(line);
                var context = [], built = [], var_name = '';
                for (var item_token in tokens) {
                    if (tokens.hasOwnProperty(item_token)) {
                        var item = tokens[item_token], value = item.value, token = item.token;
                        if (!token)
                            return console.log('Can\'t understand this keyword "' + value + '" at line', index);
                        switch (token) {
                            case 'STRING': {
                                built.push(value);
                                break;
                            }
                            case 'COMMENT': {
                                built.push('//' + value.trim().slice(2));
                                break;
                            }
                        }
                    }
                }
                code.push(built.join(''));
                built = [];
                context = [];
            }
        }
        //console.log(code)
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
