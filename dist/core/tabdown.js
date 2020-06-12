"use strict";
exports.__esModule = true;
var fs = require('fs');
var Tabdown = /** @class */ (function () {
    function Tabdown(content) {
        this.content = content;
        this.AST = {
            root: {}
        };
        this.parents = [];
        this.code = [];
    }
    Tabdown.prototype.writeObject = function (array, property, value) {
        var item = this.AST['root'];
        if (array.length > 0) {
            for (var itemt in array) {
                if (parseInt(itemt) + 1 === array.length)
                    item[array[itemt]][property] = value;
                item = item[array[itemt]];
            }
        }
        else {
            item[property] = value;
        }
    };
    Tabdown.prototype.buildAST = function (index) {
        if (index === void 0) { index = 0; }
        var line = this.content[index], ft_line = this.content[index + 1];
        if (!line)
            return;
        var depth = line.match(/^\s+/) ? line.match(/^\s+/)[0].length / 2 : 0, ft_depth = ft_line ? this.content[index + 1].match(/^\s+/) ? this.content[index + 1].match(/^\s+/)[0].length / 2 : 0 : undefined;
        if (line.trimRight().endsWith(':')) {
            this.writeObject(this.parents, line.trim() + '||' + index + '||' + depth, {});
            this.parents.push(line.trim() + '||' + index + '||' + depth);
        }
        else {
            this.writeObject(this.parents, line.trim() + '||' + index + '||' + depth, '');
        }
        if (ft_depth < depth)
            this.parents = this.parents.slice(0, ft_depth);
        this.buildAST(index + 1);
    };
    Tabdown.prototype.addBrackets = function (item) {
        for (var child in item) {
            if (typeof item[child] === 'object') {
                this.code.push(new Array(parseInt(child.split('||')[2])).fill('  ').join('') + child.split('||')[0].slice(0, child.split('||')[0].length - 1) + '{');
                this.addBrackets(item[child]);
                this.code.push(new Array(parseInt(child.split('||')[2])).fill('  ').join('') + '}');
            }
            else {
                this.code.push(new Array(parseInt(child.split('||')[2])).fill('  ').join('') + child.split('||')[0]);
                this.addBrackets(item[child]);
            }
        }
    };
    Tabdown.prototype.tab = function () {
        this.buildAST(0);
        this.addBrackets(this.AST.root);
        return this.code;
    };
    return Tabdown;
}());
exports["default"] = Tabdown;