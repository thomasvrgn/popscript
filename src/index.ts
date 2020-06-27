/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler'
import * as FS    from 'fs'
import * as PATH  from 'path'

const input = PATH.resolve('example/index.ps')

FS.exists(input, bool => {
    if (bool) {
        FS.readFile(input, 'UTF-8', (error, content) => {
            if (error) throw error
            new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(input)
        })
    }
})