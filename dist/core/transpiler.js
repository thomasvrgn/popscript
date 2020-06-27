"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var parser_1 = require("./parser");
var tokens_1 = require("./tokens/tokens");
var tabdown_1 = require("./tabdown");
var fs = require("fs");
var PATH = require("path");
var Beautify = require("js-beautify");
var Terser = require("terser");
var content;
var variables = {};
var functions = [];
var folder;
var code = [];
var Transpiler = /** @class */ (function () {
    function Transpiler(file_content) {
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        content = file_content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function (filename) {
        if (!folder)
            folder = PATH.dirname(filename);
        for (var index in content) {
            if (content.hasOwnProperty(index)) {
                var line = content[index];
                var tokens = parser_1.Tokenizer.tokenize(line);
                var context = [], built = [], var_name = '';
                var array_cnt = 0, item_cnt = 0;
                var _loop_1 = function (item_token) {
                    if (tokens.hasOwnProperty(item_token)) {
                        var item = tokens[item_token], value_1 = item.value, token = item.token;
                        if (!token)
                            return { value: console.log('Can\'t understand this keyword "' + value_1 + '" at line', index) };
                        switch (token) {
                            case 'STRING':
                            case 'INT': {
                                if (context.filter(function (x) { return ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x); }).length > 0 &&
                                    variables[var_name] !== 'array') {
                                    variables[var_name] = token.toLowerCase();
                                    if (context.includes('MODULE::REQUIRE')) {
                                        if (context.includes('MODULE::JAVASCRIPT')) {
                                            built.push(value_1);
                                        }
                                        else {
                                            fs.readFile(folder + '\\' + value_1.slice(1, value_1.length - 1) + '.ps', 'UTF-8', function (error, content) {
                                                if (error)
                                                    throw error;
                                                new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(folder + '\\' + value_1.slice(1, value_1.length - 1) + '.ps');
                                            });
                                            built = [];
                                            context = [];
                                            variables[var_name] = 'module';
                                        }
                                    }
                                    else {
                                        if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                            built.push(value_1);
                                        }
                                        else {
                                            built.push(value_1);
                                        }
                                    }
                                }
                                else {
                                    built.push(value_1);
                                    if (variables[var_name] === 'array' && array_cnt > 0) {
                                        variables[var_name + (array_cnt > 1 ? '[' + (array_cnt + 1) + ']' : '') + '[' + (item_cnt) + ']'] = token.toLowerCase();
                                        item_cnt += 1;
                                    }
                                }
                                if (context.includes('CONVERSION::INT')) {
                                    built.push(')');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::INT'; }), 1);
                                }
                                else if (context.includes('CONVERSION::STRING')) {
                                    built.push('.toString()');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::STRING'; }), 1);
                                }
                                break;
                            }
                            case 'OPTIONAL': {
                                context.push('FUNCTION::OPTIONAL');
                                break;
                            }
                            case 'COMMENT': {
                                built.push('//' + value_1.trim().slice(2));
                                break;
                            }
                            case 'JAVASCRIPT': {
                                context.push('MODULE::JAVASCRIPT');
                                break;
                            }
                            case 'WORD': {
                                if (!context.includes('FUNCTION::START')) {
                                    if (variables[value_1] !== undefined) {
                                        context.push('VARIABLE::USE');
                                        if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                            built.push(value_1);
                                        }
                                        else {
                                            if (variables[value_1] !== 'module') {
                                                built.push(value_1);
                                            }
                                        }
                                    }
                                    else if (functions.includes(value_1)) {
                                        built.push(value_1);
                                        context.push('FUNCTION::CALL');
                                    }
                                    else {
                                        built.push("var " + value_1);
                                        variables[value_1] = '';
                                        context.push('VARIABLE::DECLARATION');
                                    }
                                }
                                else if (context.includes('FUNCTION::START')) {
                                    if (!context.includes('FUNCTION::ARGUMENTS')) {
                                        built.push(value_1);
                                        functions.push(value_1);
                                    }
                                    else {
                                        built.push(value_1);
                                        variables[value_1] = '';
                                        if (context.includes('FUNCTION::OPTIONAL')) {
                                            built.push(' = \'\',');
                                            context.splice(context.findIndex(function (x) { return x === 'FUNCTION::OPTIONAL'; }), 1);
                                        }
                                        else {
                                            built.push(',');
                                        }
                                    }
                                }
                                else {
                                    built.push(value_1);
                                }
                                if (context.includes('CONVERSION::INT')) {
                                    built.push(')');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::INT'; }), 1);
                                }
                                else if (context.includes('CONVERSION::STRING')) {
                                    built.push('.toString()');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::STRING'; }), 1);
                                }
                                var_name = value_1;
                                break;
                            }
                            case 'ARGUMENTS': {
                                built.push('(');
                                if (context.includes('FUNCTION::START')) {
                                    context.push('FUNCTION::ARGUMENTS');
                                }
                                else {
                                    context.push('FUNCTION::CALL_ARGUMENTS');
                                }
                                break;
                            }
                            case 'IMPORT': {
                                context.push('MODULE::IMPORT');
                                break;
                            }
                            case 'FROM': {
                                if (context.includes('MODULE::IMPORT')) {
                                    built.push('= require(');
                                    context.push('MODULE::REQUIRE');
                                }
                                break;
                            }
                            case 'SIGNS': {
                                if (value_1 === '=') {
                                    if (context.includes('CONDITION::START')) {
                                        built.push('==');
                                    }
                                    else if (context.filter(function (x) { return ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x); }).length > 0) {
                                        built.push('=');
                                    }
                                }
                                else {
                                    if (value_1 === '-') {
                                        if (!var_name)
                                            break;
                                        if (!variables[var_name])
                                            break;
                                        switch (variables[var_name]) {
                                            case 'string': {
                                                built.push('.replace(');
                                                context.push('STRING::REMOVE');
                                                break;
                                            }
                                            case 'array': {
                                                built.push('.filter(x => x !== ');
                                                context.push('ARRAY::REMOVE');
                                                break;
                                            }
                                            case 'int': {
                                                built.push(value_1);
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        built.push(value_1);
                                    }
                                }
                                break;
                            }
                            case 'PROPERTY': {
                                if (Number.isNaN(value_1.slice(1))) {
                                    built.push('.' + value_1.slice(1));
                                }
                                else {
                                    built.push('[' + value_1.slice(1) + ']');
                                }
                                break;
                            }
                            case 'CALL': {
                                context.push('FUNCTION::CALL');
                                if (variables[var_name] === 'module') {
                                    built.push(value_1.slice(2));
                                }
                                break;
                            }
                            case 'L_PAREN':
                            case 'R_PAREN': {
                                if (context.slice(-1)[0] === 'FUNCTION::CALL' || context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                    built.push(value_1);
                                    context.push('FUNCTION::CALL_ARGUMENTS');
                                }
                                else {
                                    if (value_1 === '(') {
                                        built.push('[');
                                        context.push('ARRAY::START');
                                        if (array_cnt > 0) {
                                            variables[var_name + (array_cnt > 1 ? '[' + (array_cnt - 1) + ']' : '') + '[' + (item_cnt) + ']'] = 'array';
                                        }
                                        item_cnt = 0;
                                        array_cnt += 1;
                                    }
                                    else if (value_1 === ')') {
                                        built.push(']');
                                        context.push('ARRAY::END');
                                        array_cnt -= 1;
                                        item_cnt = 0;
                                    }
                                    variables[var_name] = 'array';
                                }
                                break;
                            }
                            case 'COMMA': {
                                built.push(value_1);
                                break;
                            }
                            case 'CONVERSION': {
                                var type = __spread(value_1).reverse().slice(1).reverse().join('').trim();
                                switch (type) {
                                    case 'int': {
                                        built.push('parseInt(');
                                        context.push('CONVERSION::INT');
                                        break;
                                    }
                                    case 'string': {
                                        context.push('CONVERSION::STRING');
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'ADD': {
                                var_name = built.slice(built.indexOf(var_name)).join('');
                                switch (variables[var_name]) {
                                    case 'string':
                                    case 'int': {
                                        built.push('+=');
                                        break;
                                    }
                                    case 'array': {
                                        built.push('.push(');
                                        context.push('ARRAY::PUSH');
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'SPACE': {
                                if (context.includes('ARRAY::START')) {
                                    if (['STRING', 'INT'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        if (!functions.includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].value)) {
                                            built.push(', ');
                                        }
                                    }
                                    else {
                                        built.push(value_1);
                                    }
                                }
                                else if (context.includes('PRINT::START')) {
                                    if (['STRING', 'INT', 'WORD', 'L_PAREN', 'R_PAREN'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        if (!functions.includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].value)) {
                                            built.push(', ');
                                        }
                                    }
                                    else {
                                        built.push(value_1);
                                    }
                                }
                                else {
                                    built.push(value_1);
                                }
                                break;
                            }
                            case 'REMOVE': {
                                var_name = built.slice(built.indexOf(var_name)).join('');
                                switch (variables[var_name]) {
                                    case 'int': {
                                        built.push('-=');
                                        break;
                                    }
                                    case 'string': {
                                        built.push(' = ' + var_name + '.replace(');
                                        context.push('STRING::REMOVE');
                                        break;
                                    }
                                    case 'array': {
                                        built.push(' = ' + var_name + '.filter(x => x !== ');
                                        context.push('ARRAY::REMOVE');
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'IF': {
                                built.push('if(');
                                context.push('CONDITION::START');
                                break;
                            }
                            case 'ELIF': {
                                built.push('else if(');
                                context.push('CONDITION::START');
                                break;
                            }
                            case 'ELSE': {
                                built.push('else:');
                                break;
                            }
                            case 'TABS': {
                                if (parseInt(item_token) === 0) {
                                    built.push(value_1);
                                }
                                else if (context.includes('ARRAY::START')) {
                                    if (['STRING', 'INT'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        built.push(', ');
                                    }
                                }
                                else if (context.includes('PRINT::START')) {
                                    if (['STRING', 'INT', 'WORD', 'L_PAREN', 'R_PAREN'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        built.push(', ');
                                    }
                                }
                                break;
                            }
                            case 'ARGUMENT': {
                                if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                    built.push(', ');
                                }
                                break;
                            }
                            case 'AND':
                            case 'THEN': {
                                for (var i = 0; i < context.length; i++) {
                                    if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                        built.push(')');
                                        context.splice(context.findIndex(function (x) { return x === 'FUNCTION::CALL_ARGUMENTS'; }), 1);
                                    }
                                    if (context.includes('STRING::REMOVE')) {
                                        built.push(', "") ');
                                        context.splice(context.findIndex(function (x) { return x === 'STRING::REMOVE'; }), 1);
                                    }
                                    if (context.includes('ARRAY::REMOVE')) {
                                        built.push(') ');
                                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::REMOVE'; }), 1);
                                    }
                                    if (context.includes('ARRAY::PUSH')) {
                                        built.push(') ');
                                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::PUSH'; }), 1);
                                    }
                                    if (context.includes('PRINT::START')) {
                                        built.push('); ');
                                        context.splice(context.findIndex(function (x) { return x === 'PRINT::START'; }), 1);
                                    }
                                    if (context.includes('CONDITION::START')) {
                                        built.push('&&');
                                    }
                                    if (context.includes('MODULE::REQUIRE')) {
                                        built.push('); ');
                                        context.splice(context.findIndex(function (x) { return x === 'MODULE::REQUIRE'; }), 1);
                                    }
                                    if (context.includes('VARIABLE::USE')) {
                                        built.push('; ');
                                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::USE'; }), 1);
                                    }
                                    if (context.includes('ARRAY::END')) {
                                        built.push('; ');
                                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::USE'; }), 1);
                                    }
                                }
                                break;
                            }
                            case 'LOOP': {
                                built.push('for(');
                                context.push('LOOP::START');
                                break;
                            }
                            case 'WHILE': {
                                built.push('while(');
                                context.push('LOOP::START');
                                break;
                            }
                            case 'FUNCTION': {
                                built.push('function ');
                                context.push('FUNCTION::START');
                                break;
                            }
                            case 'IN': {
                                built.push(' in ');
                                break;
                            }
                            case 'PRINT': {
                                built.push('console.log(');
                                context.push('PRINT::START');
                                break;
                            }
                            case 'RETURN': {
                                built.push('return');
                                break;
                            }
                        }
                    }
                };
                for (var item_token in tokens) {
                    var state_1 = _loop_1(item_token);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                for (var i = 0; i < context.length; i++) {
                    if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                        built.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'FUNCTION::CALL_ARGUMENTS'; }), 1);
                    }
                    if (context.includes('STRING::REMOVE')) {
                        built.push(', "")');
                        context.splice(context.findIndex(function (x) { return x === 'STRING::REMOVE'; }), 1);
                    }
                    if (context.includes('ARRAY::REMOVE')) {
                        built.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::REMOVE'; }), 1);
                    }
                    if (context.includes('ARRAY::PUSH')) {
                        built.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::PUSH'; }), 1);
                    }
                    if (context.includes('PRINT::START')) {
                        built.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'PRINT::START'; }), 1);
                    }
                    if (context.includes('MODULE::REQUIRE')) {
                        built.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'MODULE::REQUIRE'; }), 1);
                    }
                    if (context.includes('ARRAY::END')) {
                        built.push('; ');
                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::USE'; }), 1);
                    }
                    if (context.includes('CONDITION::START')) {
                        built.push('):');
                        context.splice(context.findIndex(function (x) { return x === 'CONDITION::START'; }), 1);
                    }
                    if (context.includes('LOOP::START')) {
                        built.push('):');
                        context.splice(context.findIndex(function (x) { return x === 'LOOP::START'; }), 1);
                    }
                    if (context.includes('FUNCTION::ARGUMENTS')) {
                        built.push('):');
                        context.splice(context.findIndex(function (x) { return x === 'FUNCTION::ARGUMENTS'; }), 1);
                    }
                }
                code.push(built.join(''));
                built = [];
                context = [];
            }
        }
        fs.writeFile(PATH.join(folder, 'output.js'), Beautify(Terser.minify(Beautify(new tabdown_1["default"](code).tab().join('\n'))).code), function (error) {
            if (error)
                throw error;
        });
        return Beautify(Terser.minify(Beautify(new tabdown_1["default"](code).tab().join('\n'))).code);
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
