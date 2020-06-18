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
    ARGUMENTS: /=>/,
    INDEX: /:/,
    // TYPES
    STRING: /(['"])(.*?)(['"])/,
    INT: /-?\d+/,
    TYPE: /int|str|list/,
    OPTIONAL: /optional/,
    BOOLEAN: /true|false/,
    // KEYWORDS
    FUNCTION: /fn/,
    IF: /if/,
    ELIF: /elif/,
    ELSE: /else/,
    PRINT: /print/,
    RETURN: /return/,
    JOIN: /join/,
    SPLIT: /split/,
    ADD: /\+=/,
    REMOVE: /-=/,
    // OTHER
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]/,
    NOT: /not|!/,
    AND: /and|&/,
    COMMENT: /--.*/
};
