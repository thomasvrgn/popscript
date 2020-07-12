"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var parser_1 = require("./parser");
var tokens_1 = require("./tokens/tokens");
var tabdown_1 = require("./tabdown");
var Path = require("path");
var FS = require("fs");
var Transpiler = /** @class */ (function () {
    function Transpiler(file_content) {
        if (file_content === void 0) { file_content = ''; }
        this.content = [];
        this.tabsize = 0;
        this.code = [];
        this.specs = {
            current: {
                variable: ''
            },
            variables: {}
        };
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        this.content = file_content.split(/\n/g).filter(function (x) { return x.trim().length > 0; });
    }
    Transpiler.prototype.transpile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var PATH, index, line, tokens, context, built, token_index, item, value, token, addon, variables;
            var _this = this;
            return __generator(this, function (_a) {
                PATH = Path.resolve(Path.join(__dirname, 'addons'));
                for (index in this.content) {
                    if (this.content.hasOwnProperty(index)) {
                        line = this.content[index], tokens = parser_1.Tokenizer.tokenize(line), context = [], built = [];
                        for (token_index in tokens) {
                            if (tokens.hasOwnProperty(token_index)) {
                                item = tokens[token_index], value = item.value, token = item.token;
                                if (FS.existsSync(Path.join(PATH, token.toLowerCase() + '.js'))) {
                                    addon = require(Path.join(PATH, token.toLowerCase() + '.js'))["default"];
                                    built.push(new addon().exec(token, value, context, this.specs, tokens, parseInt(token_index)));
                                }
                            }
                        }
                        this.code.push(built.join(''));
                        context = [];
                    }
                }
                variables = Object.keys(this.specs.variables).filter(function (x) { return _this.specs.variables[x].type !== 'aliase'; });
                if (variables.length > 0) {
                    this.code.unshift('var ' + variables.join(', '));
                }
                console.log(new tabdown_1["default"](this.code).tab().join('\n'));
                return [2 /*return*/];
            });
        });
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
