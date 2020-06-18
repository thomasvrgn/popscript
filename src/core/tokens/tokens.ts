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
    INDEX       : /:/                 , // Match index
    // TYPES

    STRING      : /(['"])(.*?)(['"])/ , // Match any strings
    INT         : /-?\d+/             , // Match any digits
    TYPE        : /int|str|list/      , // Match any type
    OPTIONAL    : /optional/          , // Match optional type
    BOOLEAN     : /true|false/        , // Match boolean

    // KEYWORDS

    FUNCTION    : /fn/                , // Match function keyword
    IF          : /if/                , // Match if condition
    ELIF        : /elif/              , // Match else if condition
    ELSE        : /else/              , // Match else condition
    PRINT       : /print/             , // Match print keyword
    RETURN      : /return/            , // Match return keyword
    JOIN        : /join/              , // Match join method
    SPLIT       : /split/             , // Match split method
    ADD         : /(\+=|=\+)/         , // Match value adding
    REMOVE      : /(-=|=-)/           , // Match value removing

    // OTHER

    WORD        : /\w+/               , // Match any words
    SIGNS       : /[><=+\-*\/%|]/     , // Match any sign
    NOT         : /not|!/             , // Match not keyword
    AND         : /and|&/             , // Match and keyword
    COMMENT     : /--.*/              , // Match comments
}