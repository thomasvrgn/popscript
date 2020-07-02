/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler    from './core/transpiler'
import { Tokenizer } from './core/parser'
import Tokens        from './core/tokens/tokens'
import * as FS       from 'fs'
import * as PATH     from 'path'

new Transpiler(FS.readFileSync(PATH.join(__dirname, '..', 'example', 'index.ps'), 'utf-8')).transpile()