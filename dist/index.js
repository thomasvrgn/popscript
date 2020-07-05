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
var input = PATH.join(__dirname, '..', 'example', 'index.ps');
var modules = [];
var Popscript = /** @class */ (function () {
    function Popscript() {
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
    }
    Popscript.prototype.file = function (path) {
        function readFile(file) {
            var e_1, _a, e_2, _b;
            var content = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n');
            modules.push(content);
            try {
                for (var content_1 = __values(content), content_1_1 = content_1.next(); !content_1_1.done; content_1_1 = content_1.next()) {
                    var line = content_1_1.value;
                    var context = [];
                    try {
                        for (var _c = (e_2 = void 0, __values(parser_1.Tokenizer.tokenize(line))), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var item = _d.value;
                            var token = item.token, value = item.value;
                            if (token === 'IMPORT') {
                                context.push('IMPORT::DECLARE');
                            }
                            else if (token === 'STRING') {
                                if (context.includes('IMPORT::DECLARE')) {
                                    readFile(PATH.join(PATH.dirname(path), value.slice(1, value.length - 1)));
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
        FS.exists(path, function (bool) {
            if (bool) {
                readFile(path);
                var code = new transpiler_1["default"](modules.reverse().map(function (x) { return x.join('\n'); }).join('\n')).transpile();
                console.log(code);
            }
        });
    };
    Popscript.prototype.text = function (content) {
        new transpiler_1["default"](content).transpile();
    };
    return Popscript;
}());
exports["default"] = Popscript;
new Popscript().file(input);
