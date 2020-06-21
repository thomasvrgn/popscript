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
var FS = require("fs");
var PATH = require("path");
var GLOB = require("glob");
var input = PATH.resolve('example/index.ps');
FS.exists(input, function (bool) {
    if (!bool)
        return;
    FS.stat(input, function (error, stats) {
        if (error)
            throw error;
        if (stats.isFile()) {
            var filename = PATH.basename(input), foldername = PATH.dirname(input);
            GLOB(PATH.join(foldername, '**', '*.ps'), function (error, content) {
                var e_1, _a;
                if (error)
                    throw error;
                var _loop_1 = function (file) {
                    FS.readFile(file, 'UTF-8', function (error, content) {
                        if (error)
                            throw error;
                        var code = new transpiler_1["default"](content.split(/\r?\n/g).join('\n')).transpile(file);
                        FS.writeFile(file.replace('.ps', '.js'), code, function (error) {
                            if (error)
                                throw error;
                        });
                    });
                };
                try {
                    for (var content_1 = __values(content), content_1_1 = content_1.next(); !content_1_1.done; content_1_1 = content_1.next()) {
                        var file = content_1_1.value;
                        _loop_1(file);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (content_1_1 && !content_1_1.done && (_a = content_1["return"])) _a.call(content_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        }
        else if (stats.isDirectory()) {
            return new Error('Can\t compile folder!');
        }
    });
});
