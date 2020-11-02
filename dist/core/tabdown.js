"use strict";
exports.__esModule = true;
var types_1 = require("../interfaces/types");
var Tabdown = /** @class */ (function () {
    function Tabdown(code) {
        this.ast = {
            type: types_1.Types.Program,
            raw: '',
            children: []
        };
        this.parameters = {
            tabsize: 1
        };
        this.code = code;
    }
    Tabdown.prototype.getTabSize = function (line) {
        var preMatch = line.match(/^\s+/g);
        return preMatch ? preMatch[0].length : null;
    };
    Tabdown.prototype.goToParent = function (ast, it) {
        if (it === 0)
            return ast;
        return this.goToParent(ast.parent, it - 1);
    };
    Tabdown.prototype.tab = function () {
        var _this = this;
        var Parser = function (code, index, ast) {
            var line = code[index];
            if (!line)
                return ast;
            var tabSize = _this.getTabSize(line);
            if (tabSize && _this.parameters.tabsize === 0)
                _this.parameters.tabsize = tabSize;
            var amountTabs = tabSize / _this.parameters.tabsize;
            if (!Number.isInteger(amountTabs))
                return ast;
            if (!ast.parent) {
                ast.children.push({
                    type: types_1.Types.Node,
                    raw: line,
                    params: {
                        tabs: amountTabs
                    },
                    children: [],
                    parent: ast
                });
                return Parser(code, index + 1, ast.children.slice(-1)[0]);
            }
            else if (amountTabs > ast.params.tabs) {
                ast.children.push({
                    type: types_1.Types.Node,
                    raw: line,
                    params: {
                        tabs: amountTabs
                    },
                    children: [],
                    parent: ast
                });
                return Parser(code, index + 1, ast.children.slice(-1)[0]);
            }
            else if (amountTabs < ast.params.tabs) {
                return Parser(code, index, _this.goToParent(ast, Math.abs(ast.params.tabs - amountTabs) + 2));
            }
            else if (amountTabs === ast.params.tabs) {
                ast.parent.children.push({
                    type: types_1.Types.Node,
                    raw: line,
                    params: {
                        tabs: amountTabs
                    },
                    children: [],
                    parent: ast
                });
                return Parser(code, index + 1, ast.parent.children.slice(-1)[0]);
            }
            return Parser(code, index + 1, ast);
        };
        var getCircularReplacer = function () {
            var seen = new WeakSet();
            return function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        };
        var parser = Parser(this.code, 0, this.ast);
        console.log(JSON.stringify(parser, getCircularReplacer(), 2));
        return Parser(this.code, 0, this.ast);
    };
    return Tabdown;
}());
exports["default"] = Tabdown;
