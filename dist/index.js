"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/
exports.__esModule = true;
var transpiler_1 = require("./core/transpiler");
new transpiler_1["default"]('test = "world"\nprint "hello ::test::!"').transpile();
