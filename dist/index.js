"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var transpiler_1 = require("./core/transpiler");
var parser_1 = require("./core/parser");
var tokens_1 = require("./core/tokens/tokens");
var FS = require("fs");
var PATH = require("path");
var input = PATH.resolve('example/index.ps');
var module_count = 0, modules = [];
parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
var Popscript = /** @class */ (function () {
    function Popscript() {
    }
    Popscript.prototype.file = function (path) {
        function readFile(file) {
            var e_1, _a, e_2, _b;
            var content = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n');
            try {
                for (var content_1 = __values(content), content_1_1 = content_1.next(); !content_1_1.done; content_1_1 = content_1.next()) {
                    var line = content_1_1.value;
                    var context = [];
                    try {
                        for (var _c = (e_2 = void 0, __values(parser_1.Tokenizer.tokenize(line))), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var item = _d.value;
                            var token = item.token, value = item.value;
                            if (token === 'IMPORT') {
                                ++module_count;
                                context.push('MODULE::REQUIRE');
                            }
                            else if (token === 'STRING') {
                                if (context.includes('MODULE::REQUIRE')) {
                                    modules.push(PATH.join(PATH.dirname(input), value.slice(1, value.length - 1) + '.ps'));
                                    readFile(PATH.join(PATH.dirname(input), value.slice(1, value.length - 1) + '.ps'));
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (content_1_1 && !content_1_1.done && (_a = content_1["return"])) _a.call(content_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        FS.exists(input, function (bool) {
            if (bool) {
                readFile(input);
                FS.readFile(input, 'utf-8', function (error, content) {
                    if (error)
                        throw error;
                    new transpiler_1["default"](content).transpile(input, undefined, module_count, function (code) {
                        eval(code);
                    });
                });
            }
        });
    };
    Popscript.prototype.text = function (content) {
        new transpiler_1["default"](content).transpile(undefined, undefined, 0, function (code) {
            eval(code);
        });
    };
    return Popscript;
}());
exports["default"] = Popscript;
new Popscript().file('example/index.ps');
