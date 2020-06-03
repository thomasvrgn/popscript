/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Tokens
//////////////////////////////////*/

module.exports = {

  // BASIC

  SPACE       : /\s/                  , // Match any spaces
  PROPERTY    : /:\w+/                , // Match properties like :length
  TABS        : /^\s+/                , // Match start tabs
  COLON       : /:/                   , // Matchs colons like test : str
  DOT         : /\./                  , // Match any dots
  COMMA       : /,/                   , // Match any comma
  L_PAREN     : /\(/                  , // Match any left parenthesis
  R_PAREN     : /\)/                  , // Match any right parenthesis
  ARGUMENTS   : /=>/                  , // Match arguments start like fn test => coucou

  // TYPES

  STRING      : /('|")(.*?)('|")/     , // Match any strings
  INT         : /-?\d+/               , // Match any digits
  ARRAY_START : /:-/                  , // Match array start
  ARRAY_END   : /-:/                  , // Match array end
  TYPE        : /int|str|list/        , // Match any type
  OPTIONAL    : /optional/            , // Match optional type
  BOOLEAN     : /true|false/          , // Match boolean

  // KEYWORDS

  FUNCTION    : /fn/                  , // Match function keyword
  IF          : /if/                  , // Match if condition
  ELIF        : /elif/                , // Match else if condition
  ELSE        : /else/                , // Match else condition
  PRINT       : /print/               , // Match print keyword
  RETURN      : /return/              , // Match return keyword

  // OTHER

  WORD        : /\w+/                 , // Match any words
  SIGNS       : />|<|=|\+|\-|\*|\/|%/ , // Match any sign
  NOT         : /not|!/               , // Match not keyword
  AND         : /and|&/               , // Match and keyword
  COMMENT     : /;.*/                 , // Match comments

}