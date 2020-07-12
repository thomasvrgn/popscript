"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Native = /** @class */ (function () {
    function Native() {
    }
    Native.prototype.exec = function (token, value, context, specs, tokens, index) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        return value.split(/"/g).slice(1, value.split(/"/g).length - 1).join('"');
    };
    return Native;
}());
exports["default"] = Native;
