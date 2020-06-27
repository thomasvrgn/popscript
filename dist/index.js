"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/
exports.__esModule = true;
var transpiler_1 = require("./core/transpiler");
var FS = require("fs");
var PATH = require("path");
var input = PATH.resolve('example/index.ps');
FS.exists(input, function (bool) {
    if (bool) {
        FS.readFile(input, 'UTF-8', function (error, content) {
            if (error)
                throw error;
            new transpiler_1["default"](content.split(/\r?\n/g).join('\n')).transpile(input);
        });
    }
});
