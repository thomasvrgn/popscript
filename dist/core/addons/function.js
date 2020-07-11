"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Function = /** @class */ (function () {
    function Function() {
    }
    Function.prototype.exec = function (token, value, context, specs) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        context.push('FUNCTION::DECLARE');
        return;
    };
    return Function;
}());
exports["default"] = Function;
