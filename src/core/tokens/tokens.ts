/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Tokens
//////////////////////////////////*/

export default {

    // BASIC

    SPACE       : /\s/                    , // Match any spaces
    TABS        : /^\s+/                  , // Match start tabs
    DOT         : /\./                    , // Match any dots
    COMMA       : /,/                     , // Match any comma
    L_PAREN     : /\(/                    , // Match any left parenthesis
    R_PAREN     : /\)/                    , // Match any right parenthesis
    ARGUMENTS   : /=>/                    , // Match arguments start like fn test => coucou
    PROPERTY    : /:\w+/                  , // Match property
    INDEX       : /<.*?>/                 , // Match index
    CALL        : /->\w+/                 , // Match module call

    // TYPES

    STRING      : /(['"])(.*?)(['"])/     , // Match any strings
    INT         : /-?\d+/                 , // Match any digits
    OPTIONAL    : /opt/                   , // Match optional type
    BOOLEAN     : /true|false/            , // Match boolean

    // KEYWORDS

    CONVERSION  : /(int|string)+\s?:/      ,
    FUNCTION    : /fn/                    , // Match function keyword
    IF          : /if/                    , // Match if condition
    ELIF        : /elif/                  , // Match else if condition
    ELSE        : /else/                  , // Match else condition
    WHILE       : /while/                 , // Match while keyword
    LOOP        : /loop/                  , // Match loop keyword
    IN          : /in/                    , // Match "in" in loop keyword
    PRINT       : /print/                 , // Match print keyword
    RETURN      : /return/                , // Match return keyword
    ADD         : /(\+=|=\+)/             , // Match value adding
    REMOVE      : /(-=|=-)/               , // Match value removing
    IMPORT      : /import/                , // Match import keyword
    EXPORT      : /export/                , // Match export keyword
    FROM        : /from/                  , // Match import source
    ARRAY       : /(:=|=:)/               , // Match array
    JAVASCRIPT  : /as (javascript|js)/    , // Match javascript module

    // OTHER

    THEN        : /then/                  , // Match then keyword
    AND         : /and|&/                 , // Match and keyword
    WORD        : /\w+/                   , // Match any words
    SIGNS       : /[><=+\-*\/%|]/         , // Match any sign
    NOT         : /not|!/                 , // Match not keyword
    COMMENT     : /;.*/                  , // Match comments

}