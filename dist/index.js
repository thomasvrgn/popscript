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
var Popscript = /** @class */ (function () {
    function Popscript() {
        this.modules = [];
        this.content = [];
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
    }
    Popscript.prototype.file = function (file, callback) {
        var _this = this;
        if (file === void 0) { file = ''; }
        if (callback === void 0) { callback = function () { }; }
        var readFile = function (file) {
            var e_1, _a, e_2, _b;
            var cntnt = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n');
            _this.content.push(cntnt);
            try {
                for (var cntnt_1 = __values(cntnt), cntnt_1_1 = cntnt_1.next(); !cntnt_1_1.done; cntnt_1_1 = cntnt_1.next()) {
                    var line = cntnt_1_1.value;
                    var context = [];
                    try {
                        for (var _c = (e_2 = void 0, __values(parser_1.Tokenizer.tokenize(line))), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var item = _d.value;
                            var token = item.token, value = item.value;
                            if (token === 'IMPORT') {
                                context.push('MODULE::REQUIRE');
                            }
                            else if (token === 'WORD') {
                                if (context.includes('MODULE::REQUIRE')) {
                                    context.pop();
                                    _this.modules.push(PATH.join(PATH.dirname(file), value + '.ps'));
                                    readFile(PATH.join(PATH.dirname(file), value + '.ps'));
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
                    if (cntnt_1_1 && !cntnt_1_1.done && (_a = cntnt_1["return"])) _a.call(cntnt_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        readFile(file);
        new transpiler_1["default"](this.content.map(function (x) { return x.join('\n'); }).join('\n')).transpile();
    };
    return Popscript;
}());
exports["default"] = Popscript;
new Popscript().file(PATH.join(__dirname, '..', 'example', 'index.ps'), function () { });
