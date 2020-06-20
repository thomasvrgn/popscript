/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler';
import * as FS    from 'fs'

FS.readFile('./index.ps', 'UTF-8', (error, content) => {
    if (error) throw error
    new Transpiler(content.split(/\r?\n/g).join('\n')).transpile('index.js')
})