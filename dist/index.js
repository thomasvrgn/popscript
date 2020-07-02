"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/
exports.__esModule = true;
var transpiler_1 = require("./core/transpiler");
var FS = require("fs");
var PATH = require("path");
new transpiler_1["default"](FS.readFileSync(PATH.join(__dirname, '..', 'example', 'index.ps'), 'utf-8')).transpile();
