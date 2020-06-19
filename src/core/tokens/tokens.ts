/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Tokens
//////////////////////////////////*/

export default {

    // BASIC

    SPACE       : /\s/                , // Match any spaces
    TABS        : /^\s+/              , // Match start tabs
    DOT         : /\./                , // Match any dots
    COMMA       : /,/                 , // Match any comma
    L_PAREN     : /\(/                , // Match any left parenthesis
    R_PAREN     : /\)/                , // Match any right parenthesis
    ARGUMENTS   : /=>/                , // Match arguments start like fn test => coucou
    PROPERTY    : /:/                 , // Match property
    INDEX       : /<.*?>/             , // Match index

    // TYPES

    STRING      : /(['"])(.*?)(['"])/ , // Match any strings
    INT         : /-?\d+/             , // Match any digits
    OPTIONAL    : /opt/               , // Match optional type
    BOOLEAN     : /true|false/        , // Match boolean

    // KEYWORDS

    FUNCTION    : /fn/                , // Match function keyword
    IF          : /if/                , // Match if condition
    ELIF        : /elif/              , // Match else if condition
    ELSE        : /else/              , // Match else condition
    WHILE       : /while/             , // Match while keyword
    LOOP        : /loop/              , // Match loop keyword
    AS          : /as/                , // Match as in loop keyword
    PRINT       : /print/             , // Match print keyword
    RETURN      : /return/            , // Match return keyword
    ADD         : /(\+=|=\+)/         , // Match value adding
    REMOVE      : /(-=|=-)/           , // Match value removing

    // OTHER

    WORD        : /\w+/               , // Match any words
    SIGNS       : /[><=+\-*\/%|]/     , // Match any sign
    NOT         : /not|!/             , // Match not keyword
    AND         : /and|&/             , // Match and keyword
    COMMENT     : /--.*/              , // Match comments

}