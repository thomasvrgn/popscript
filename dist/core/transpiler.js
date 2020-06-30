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
var mod_count = undefined;
var imported = 0;
var Transpiler = /** @class */ (function () {
    function Transpiler(file_content) {
        parser_1.Tokenizer.addTokenSet(tokens_1["default"]);
        content = file_content.split(/\n/g);
    }
    Transpiler.prototype.transpile = function (filename, modname, module_cnt, callback) {
        if (modname === void 0) { modname = undefined; }
        if (callback === void 0) { callback = Function; }
        if (!folder && filename)
            folder = PATH.dirname(filename);
        var mod_name = modname, temp_code = [];
        if (modname) {
            temp_code.push("var " + mod_name + " = {}");
            imported += 1;
        }
        if (module_cnt && !mod_count)
            mod_count = module_cnt;
        else
            mod_count = 0;
        var _loop_1 = function (index) {
            if (content.hasOwnProperty(index)) {
                var line = content[index];
                var tokens = parser_1.Tokenizer.tokenize(line);
                var context = [], built_1 = [], var_name_1 = '';
                var array_cnt = 0, item_cnt = 0;
                var _loop_2 = function (item_token) {
                    if (tokens.hasOwnProperty(item_token)) {
                        var item = tokens[item_token], value_1 = item.value, token = item.token;
                        if (!token)
                            return { value: console.log('Can\'t understand this keyword "' + value_1 + '" at line', index) };
                        switch (token) {
                            case 'STRING':
                            case 'INT': {
                                if (context.filter(function (x) { return ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x); }).length > 0 &&
                                    variables[var_name_1] !== 'array') {
                                    variables[var_name_1] = token.toLowerCase();
                                    if (context.includes('MODULE::REQUIRE')) {
                                        variables[var_name_1] = 'module';
                                        built_1 = [];
                                        if (context.includes('MODULE::JAVASCRIPT')) {
                                            built_1.push(value_1);
                                            fs.readFile(PATH.join(folder, value_1.slice(1, value_1.length - 1)), 'UTF-8', function (error, content) {
                                                if (error)
                                                    throw error;
                                                built_1.push(content);
                                            });
                                        }
                                        else {
                                            fs.readFile(folder + '\\' + value_1.slice(1, value_1.length - 1) + '.ps', 'UTF-8', function (error, content) {
                                                if (error)
                                                    throw error;
                                                new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(folder + '\\' + value_1.slice(1, value_1.length - 1) + '.ps', var_name_1, mod_count, function (code) {
                                                    if (mod_count === imported) {
                                                        callback(code);
                                                    }
                                                });
                                            });
                                        }
                                        context = [];
                                    }
                                    else {
                                        if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                            built_1.push(value_1);
                                        }
                                        else {
                                            built_1.push(value_1);
                                        }
                                    }
                                }
                                else {
                                    built_1.push(value_1);
                                    if (variables[var_name_1] === 'array' && array_cnt > 0) {
                                        variables[var_name_1 + (array_cnt > 1 ? '[' + (array_cnt + 1) + ']' : '') + '[' + (item_cnt) + ']'] = token.toLowerCase();
                                        item_cnt += 1;
                                    }
                                }
                                if (context.includes('CONVERSION::INT')) {
                                    built_1.push(')');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::INT'; }), 1);
                                }
                                else if (context.includes('CONVERSION::STRING')) {
                                    built_1.push('.toString()');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::STRING'; }), 1);
                                }
                                break;
                            }
                            case 'OPTIONAL': {
                                context.push('FUNCTION::OPTIONAL');
                                break;
                            }
                            case 'COMMENT': {
                                built_1.push('//' + value_1.trim().slice(2));
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
                                            built_1.push(value_1);
                                        }
                                        else {
                                            built_1.push(value_1);
                                        }
                                    }
                                    else if (functions.includes(value_1)) {
                                        built_1.push(value_1);
                                        context.push('FUNCTION::CALL');
                                    }
                                    else {
                                        if (variables[value_1] === 'module') {
                                            built_1.push(value_1);
                                        }
                                        else {
                                            built_1.push("var " + value_1);
                                            variables[value_1] = '';
                                            context.push('VARIABLE::DECLARATION');
                                        }
                                    }
                                }
                                else if (context.includes('FUNCTION::START')) {
                                    if (!context.includes('FUNCTION::ARGUMENTS')) {
                                        if (mod_name) {
                                            built_1.push(mod_name + '.' + value_1 + '= function');
                                        }
                                        else {
                                            built_1.push(value_1);
                                        }
                                        functions.push(value_1);
                                    }
                                    else {
                                        built_1.push(value_1);
                                        variables[value_1] = '';
                                        if (context.includes('FUNCTION::OPTIONAL')) {
                                            built_1.push(' = \'\',');
                                            context.splice(context.findIndex(function (x) { return x === 'FUNCTION::OPTIONAL'; }), 1);
                                        }
                                        else {
                                            built_1.push(',');
                                        }
                                    }
                                }
                                else {
                                    built_1.push(value_1);
                                }
                                if (context.includes('CONVERSION::INT')) {
                                    built_1.push(')');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::INT'; }), 1);
                                }
                                else if (context.includes('CONVERSION::STRING')) {
                                    built_1.push('.toString()');
                                    context.splice(context.findIndex(function (x) { return x === 'CONVERSION::STRING'; }), 1);
                                }
                                var_name_1 = value_1;
                                break;
                            }
                            case 'ARGUMENTS': {
                                built_1.push('(');
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
                                    built_1.push('= require(');
                                    context.push('MODULE::REQUIRE');
                                }
                                break;
                            }
                            case 'SIGNS': {
                                if (value_1 === '=') {
                                    if (context.includes('CONDITION::START')) {
                                        built_1.push('==');
                                    }
                                    else if (context.filter(function (x) { return ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x); }).length > 0) {
                                        built_1.push('=');
                                    }
                                }
                                else {
                                    if (value_1 === '-') {
                                        if (!var_name_1)
                                            break;
                                        if (!variables[var_name_1])
                                            break;
                                        switch (variables[var_name_1]) {
                                            case 'string': {
                                                built_1.push('.replace(');
                                                context.push('STRING::REMOVE');
                                                break;
                                            }
                                            case 'array': {
                                                built_1.push('.filter(x => x !== ');
                                                context.push('ARRAY::REMOVE');
                                                break;
                                            }
                                            case 'int': {
                                                built_1.push(value_1);
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        built_1.push(value_1);
                                    }
                                }
                                break;
                            }
                            case 'PROPERTY': {
                                if (Number.isNaN(value_1.slice(1))) {
                                    built_1.push('.' + value_1.slice(1));
                                }
                                else {
                                    built_1.push('[' + value_1.slice(1) + ']');
                                }
                                break;
                            }
                            case 'CALL': {
                                context.push('FUNCTION::CALL');
                                var_name_1 = value_1.split('->')[0];
                                built_1.push(value_1.replace('->', '.'));
                                break;
                            }
                            case 'L_PAREN':
                            case 'R_PAREN': {
                                if (context.slice(-1)[0] === 'FUNCTION::CALL' || context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                    built_1.push(value_1);
                                    context.push('FUNCTION::CALL_ARGUMENTS');
                                }
                                else {
                                    if (value_1 === '(') {
                                        built_1.push('[');
                                        context.push('ARRAY::START');
                                        if (array_cnt > 0) {
                                            variables[var_name_1 + (array_cnt > 1 ? '[' + (array_cnt - 1) + ']' : '') + '[' + (item_cnt) + ']'] = 'array';
                                        }
                                        item_cnt = 0;
                                        array_cnt += 1;
                                    }
                                    else if (value_1 === ')') {
                                        built_1.push(']');
                                        context.push('ARRAY::END');
                                        array_cnt -= 1;
                                        item_cnt = 0;
                                    }
                                    variables[var_name_1] = 'array';
                                }
                                break;
                            }
                            case 'COMMA': {
                                built_1.push(value_1);
                                break;
                            }
                            case 'CONVERSION': {
                                var type = __spread(value_1).reverse().slice(1).reverse().join('').trim();
                                switch (type) {
                                    case 'int': {
                                        built_1.push('parseInt(');
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
                                var_name_1 = built_1.slice(built_1.indexOf(var_name_1)).join('');
                                switch (variables[var_name_1]) {
                                    case 'string':
                                    case 'int': {
                                        built_1.push('+=');
                                        break;
                                    }
                                    case 'array': {
                                        built_1.push('.push(');
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
                                            built_1.push(', ');
                                        }
                                    }
                                    else {
                                        built_1.push(value_1);
                                    }
                                }
                                else if (context.includes('PRINT::START')) {
                                    if (['STRING', 'INT', 'WORD', 'L_PAREN', 'R_PAREN'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        if (!functions.includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].value)) {
                                            built_1.push(', ');
                                        }
                                    }
                                    else {
                                        built_1.push(value_1);
                                    }
                                }
                                else {
                                    built_1.push(value_1);
                                }
                                break;
                            }
                            case 'REMOVE': {
                                var_name_1 = built_1.slice(built_1.indexOf(var_name_1)).join('');
                                switch (variables[var_name_1]) {
                                    case 'int': {
                                        built_1.push('-=');
                                        break;
                                    }
                                    case 'string': {
                                        built_1.push(' = ' + var_name_1 + '.replace(');
                                        context.push('STRING::REMOVE');
                                        break;
                                    }
                                    case 'array': {
                                        built_1.push(' = ' + var_name_1 + '.filter(x => x !== ');
                                        context.push('ARRAY::REMOVE');
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'IF': {
                                if (context.includes('VARIABLE::DECLARATION')) {
                                    context.push('VARIABLE::CONDITION');
                                }
                                else {
                                    context.push('CONDITION::START');
                                    built_1.push('if(');
                                }
                                break;
                            }
                            case 'ELIF': {
                                built_1.push('else if(');
                                context.push('CONDITION::START');
                                break;
                            }
                            case 'ELSE': {
                                built_1.push('else:');
                                break;
                            }
                            case 'TABS': {
                                if (parseInt(item_token) === 0) {
                                    built_1.push(value_1);
                                }
                                else if (context.includes('ARRAY::START')) {
                                    if (['STRING', 'INT'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        built_1.push(', ');
                                    }
                                }
                                else if (context.includes('PRINT::START')) {
                                    if (['STRING', 'INT', 'WORD', 'L_PAREN', 'R_PAREN'].includes(tokens.slice(0, parseInt(item_token)).filter(function (x) { return x.token !== 'SPACE'; }).slice(-1)[0].token)) {
                                        built_1.push(', ');
                                    }
                                }
                                break;
                            }
                            case 'ARGUMENT': {
                                if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                    built_1.push(', ');
                                }
                                break;
                            }
                            case 'AND':
                            case 'THEN': {
                                for (var i = 0; i < context.length; i++) {
                                    if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                        built_1.push(')');
                                        context.splice(context.findIndex(function (x) { return x === 'FUNCTION::CALL_ARGUMENTS'; }), 1);
                                    }
                                    if (context.includes('STRING::REMOVE')) {
                                        built_1.push(', "") ');
                                        context.splice(context.findIndex(function (x) { return x === 'STRING::REMOVE'; }), 1);
                                    }
                                    if (context.includes('ARRAY::REMOVE')) {
                                        built_1.push(') ');
                                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::REMOVE'; }), 1);
                                    }
                                    if (context.includes('ARRAY::PUSH')) {
                                        built_1.push(') ');
                                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::PUSH'; }), 1);
                                    }
                                    if (context.includes('PRINT::START')) {
                                        built_1.push('); ');
                                        context.splice(context.findIndex(function (x) { return x === 'PRINT::START'; }), 1);
                                    }
                                    if (context.includes('CONDITION::START')) {
                                        built_1.push('&&');
                                    }
                                    if (context.includes('MODULE::REQUIRE')) {
                                        built_1.push('); ');
                                        context.splice(context.findIndex(function (x) { return x === 'MODULE::REQUIRE'; }), 1);
                                    }
                                    if (context.includes('VARIABLE::USE')) {
                                        built_1.push('; ');
                                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::USE'; }), 1);
                                    }
                                    if (context.includes('ARRAY::END')) {
                                        built_1.push('; ');
                                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::USE'; }), 1);
                                    }
                                }
                                break;
                            }
                            case 'LOOP': {
                                built_1.push('for(');
                                context.push('LOOP::START');
                                break;
                            }
                            case 'WHILE': {
                                built_1.push('while(');
                                context.push('LOOP::START');
                                break;
                            }
                            case 'FUNCTION': {
                                if (!mod_name)
                                    built_1.push('function ');
                                context.push('FUNCTION::START');
                                break;
                            }
                            case 'IN': {
                                built_1.push(' in ');
                                break;
                            }
                            case 'PRINT': {
                                built_1.push('console.log(');
                                context.push('PRINT::START');
                                break;
                            }
                            case 'RETURN': {
                                built_1.push('return');
                                break;
                            }
                        }
                    }
                };
                for (var item_token in tokens) {
                    var state_2 = _loop_2(item_token);
                    if (typeof state_2 === "object")
                        return state_2;
                }
                var _loop_3 = function (i) {
                    if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                        built_1.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'FUNCTION::CALL_ARGUMENTS'; }), 1);
                    }
                    if (context.includes('STRING::REMOVE')) {
                        built_1.push(', "")');
                        context.splice(context.findIndex(function (x) { return x === 'STRING::REMOVE'; }), 1);
                    }
                    if (context.includes('ARRAY::REMOVE')) {
                        built_1.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::REMOVE'; }), 1);
                    }
                    if (context.includes('ARRAY::PUSH')) {
                        built_1.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'ARRAY::PUSH'; }), 1);
                    }
                    if (context.includes('PRINT::START')) {
                        built_1.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'PRINT::START'; }), 1);
                    }
                    if (context.includes('MODULE::REQUIRE')) {
                        built_1.push(')');
                        context.splice(context.findIndex(function (x) { return x === 'MODULE::REQUIRE'; }), 1);
                    }
                    if (context.includes('ARRAY::END')) {
                        built_1.push('; ');
                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::USE'; }), 1);
                    }
                    if (context.includes('CONDITION::START')) {
                        built_1.push('):');
                        context.splice(context.findIndex(function (x) { return x === 'CONDITION::START'; }), 1);
                    }
                    if (context.includes('LOOP::START')) {
                        built_1.push('):');
                        context.splice(context.findIndex(function (x) { return x === 'LOOP::START'; }), 1);
                    }
                    if (context.includes('FUNCTION::ARGUMENTS')) {
                        built_1.push('):');
                        context.splice(context.findIndex(function (x) { return x === 'FUNCTION::ARGUMENTS'; }), 1);
                    }
                    if (context.includes('VARIABLE::CONDITION')) {
                        var variable_index = tokens.filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); }).findIndex(function (x) { return x.value === '='; }) + 1, variable_value_1 = tokens.filter(function (x) { return !['SPACE', 'TABS'].includes(x.token); })[variable_index];
                        built_1 = built_1.map(function (x) { return x === variable_value_1.value ? x = '%CONDITION%' : x; });
                        var condition = /%CONDITION%(.*?)(then|and)?$/.exec(built_1.join('').trim())[1];
                        built_1 = built_1.join('').replace(condition, '').replace('%CONDITION%', condition + ' ? ' + variable_value_1.value + ' : undefined').split('');
                        context.splice(context.findIndex(function (x) { return x === 'VARIABLE::CONDITION'; }), 1);
                    }
                };
                for (var i = 0; i < context.length; i++) {
                    _loop_3(i);
                }
                if (mod_name) {
                    temp_code.push(built_1.join(''));
                }
                else {
                    code.push(built_1.join(''));
                }
                built_1 = [];
                context = [];
            }
        };
        for (var index in content) {
            var state_1 = _loop_1(index);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        code = temp_code.concat(code);
        if (mod_count === imported) {
            callback(Beautify(Terser.minify(Beautify(new tabdown_1["default"](code).tab().join('\n'))).code));
            content = '';
            variables = {};
            functions = [];
            folder = '';
            code = [];
            mod_count = 0;
            imported = 0;
        }
    };
    return Transpiler;
}());
exports["default"] = Transpiler;
