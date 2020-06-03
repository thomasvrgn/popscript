/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Tokens
//////////////////////////////////*/

module.exports = {

  // BASIC

  SPACE       : /\s/,
  PROPERTY    : /:\w+/,
  TABS        : /^\s+/,
  COLON       : /:/,
  DOT         : /\./,
  COMMA       : /,/,

  // TYPES

  STRING      : /('|")(.*?)('|")/,
  INT         : /\d+/,
  ARRAY_START : /:-/,
  ARRAY_END   : /-:/,
  TYPE        : /int|str|list/,
  OPTIONAL    : /optional/,
  BOOLEAN     : /true|false/,

}