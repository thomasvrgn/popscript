/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import { Tokenizer } from './core/parser'
import Tokens        from './core/tokens/tokens'

Tokenizer.addTokenSet(Tokens)
console.log(Tokenizer.tokenize("fn coucou => hello"))