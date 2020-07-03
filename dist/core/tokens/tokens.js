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
    // TYPES
    STRING: /(['"])(.*?)(['"])/,
    INT: /-?\d+/,
    OPTIONAL: /opt/,
    BOOLEAN: /true|false/,
    TYPES: /string|int|array/,
    // KEYWORDS
    CONVERSION: /(int|str)+\s?:/,
    FUNCTION: /fn/,
    PROTOTYPE: /prop/,
    ALIASE: /aliase/,
    IF: /if/,
    ELIF: /elif/,
    ELSE: /else/,
    WHILE: /while/,
    LOOP: /loop/,
    IN: /in/,
    PRINT: /print/,
    RETURN: /return/,
    SELF: /self/,
    // OTHER
    AFTER: /then|and/,
    ARGUMENT: /&/,
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]/,
    NOT: /not|!/,
    COMMENT: /;.*/
};
