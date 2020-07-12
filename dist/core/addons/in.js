"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var In = /** @class */ (function () {
    function In() {
    }
    In.prototype.exec = function (token, value, context, specs, tokens, index) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (context.includes('LOOP::DECLARE')) {
            context.pop();
            context.push('LOOP::ARRAY');
            return ' of ';
        }
    };
    return In;
}());
exports["default"] = In;
