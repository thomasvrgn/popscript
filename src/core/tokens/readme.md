# Tokens

Tokens are one of the most important elements of the Quark project. They are used in particular during the compilation of the code in bytecode in the lexering process.

The list of the tokens thus allows the classification of the various elements of the code in key words, here is the list of these various tokens:

| Token | RegExp | Signification |
|--|--|--|
| COMMENT | `/#.*?/` | Match comments. |
| STRING | `/".*?"/` | Match quoted texts. |
| NUMBER | `/\d+/` | Match numbers |
| PRINT | `/print/` | Match print keyword |
| ADD | /\+/ | Math addition operator |
| MUL | /\*/ | Math multiplication operator |
| DIV | /\\/ | Math division operator |
| SUB | /-/ | Math substraction operator |
