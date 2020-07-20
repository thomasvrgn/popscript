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
    STRING: /(["])(.*?)(["])/,
    INT: /-?\d+/,
    OPTIONAL: /opt/,
    BOOLEAN: /true|false/,
    TYPES: /string|int|array|any/,
    TYPE: /type/,
    // KEYWORDS
    FUNCTION: /fn/,
    ALIASE: /aliase/,
    NATIVE: /native\s+".*?"/,
    PROP: /prop/,
    SELF: /self/,
    MUTABLE: /mut/,
    IF: /if/,
    ELIF: /elif/,
    ELSE: /else/,
    WHILE: /while/,
    LOOP: /for/,
    IN: /in/,
    RETURN: /return/,
    IMPORT: /import/,
    // OTHER
    AFTER: /then|after/,
    ARGUMENT: /and/,
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]+/,
    NOT: /not|!/,
    COMMENT: /;.*/
};
