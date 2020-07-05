"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Tokens
//////////////////////////////////*/
exports.__esModule = true;
exports["default"] = {
    // BASIC
    SPACE: /\s/,
    TABS: /^\s+/,
    DOT: /\./,
    COMMA: /,/,
    L_PAREN: /\(/,
    R_PAREN: /\)/,
    COLON: /:/,
    CALL: /=>/,
    MODULE: /->/,
    PROCESS: /process/,
    // TYPES
    STRING: /(['"])(.*?)(['"])/,
    INT: /-?\d+/,
    OPTIONAL: /opt/,
    BOOLEAN: /true|false/,
    TYPES: /string|int|array|any/,
    // KEYWORDS
    CONVERSION: /(int|str)+\s?:/,
    FUNCTION: /fn/,
    PROTOTYPE: /prop/,
    ALIASE: /aliase/,
    MULTIPLES: /mul/,
    IF: /if/,
    ELIF: /elif/,
    ELSE: /else/,
    WHILE: /while/,
    LOOP: /loop/,
    IN: /in/,
    RETURN: /return/,
    SELF: /self/,
    IMPORT: /import/,
    // OTHER
    AFTER: /then|and/,
    ARGUMENT: /&/,
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]/,
    NOT: /not|!/,
    COMMENT: /;.*/
};
