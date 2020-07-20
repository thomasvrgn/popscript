"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/
exports.__esModule = true;
var Tabulation = /** @class */ (function () {
    function Tabulation() {
    }
    Tabulation.prototype.exec = function (token, value, context, specs, tokens, index, built) {
        if (token === void 0) { token = ''; }
        if (value === void 0) { value = ''; }
        if (context === void 0) { context = []; }
        if (tokens === void 0) { tokens = []; }
        if (index === void 0) { index = 0; }
        if (built === void 0) { built = []; }
        context.push('FUNCTION::DECLARE');
        return 'function ';
    };
    return Tabulation;
}());
exports["default"] = Tabulation;
