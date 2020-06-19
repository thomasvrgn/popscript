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
    PROPERTY: /:\w+/,
    INDEX: /<.*?>/,
    // TYPES
    STRING: /(['"])(.*?)(['"])/,
    INT: /-?\d+/,
    OPTIONAL: /opt/,
    BOOLEAN: /true|false/,
    // KEYWORDS
    FUNCTION: /fn/,
    IF: /if/,
    ELIF: /elif/,
    ELSE: /else/,
    WHILE: /while/,
    LOOP: /loop/,
    IN: /in/,
    PRINT: /print/,
    RETURN: /return/,
    ADD: /(\+=|=\+)/,
    REMOVE: /(-=|=-)/,
    // OTHER
    AND: /and|&/,
    WORD: /\w+/,
    SIGNS: /[><=+\-*\/%|]/,
    NOT: /not|!/,
    COMMENT: /--.*/
};
