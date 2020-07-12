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
    TYPES: /string|int|array|any/,
    // KEYWORDS
    FUNCTION: /fn/,
    ALIASE: /aliase/,
    MULTIPLES: /mul/,
    NATIVE: /native\s+".*?"/,
    prop: /prop/,
    IF: /if/,
    ELIF: /elif/,
    ELSE: /else/,
    WHILE: /while/,
    LOOP: /for/,
    IN: /in/,
    RETURN: /return/,
    IMPORT: /import/,
    // OTHER
    AFTER: /then|and/,
    ARGUMENT: /&/,
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]+/,
    NOT: /not|!/,
    COMMENT: /;.*/
};
