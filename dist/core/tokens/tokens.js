"use strict";
/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Tokens
//////////////////////////////////*/
exports.__esModule = true;
exports["default"] = {
    // BASIC
    SPACE: /\s/,
    PROPERTY: /:\w+/,
    TABS: /^\s+/,
    COLON: /:/,
    DOT: /\./,
    COMMA: /,/,
    L_PAREN: /\(/,
    R_PAREN: /\)/,
    ARGUMENTS: /=>/,
    // TYPES
    STRING: /(['"])(.*?)(['"])/,
    INT: /-?\d+/,
    ARRAY_START: /:-/,
    ARRAY_END: /-:/,
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
    // OTHER
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]/,
    NOT: /not|!/,
    AND: /and|&/,
    COMMENT: /--.*/
};
