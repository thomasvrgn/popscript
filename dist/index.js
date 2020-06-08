"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/
exports.__esModule = true;
var parser_1 = require("./core/parser");
var tokens_1 = require("./core/tokens/tokens");
parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
console.log(parser_1.Tokenizer.tokenize("fn coucou => hello"));
