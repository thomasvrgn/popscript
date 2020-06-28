/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler  from './core/transpiler'
import {Tokenizer} from './core/parser'
import Tokens      from './core/tokens/tokens'
import * as FS     from 'fs'
import * as PATH   from 'path'

const input        = PATH.resolve('example/index.ps')
let   module_count = 0,
      modules      = []

Tokenizer.addTokenSet(Tokens)

function readFile (file) {
    const content: any = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n')
    for (const line of content) {
        let context: Array<string> = []
        for (const item of Tokenizer.tokenize(line)) {
            const token = item.token,
                  value = item.value

            if (token === 'IMPORT') {
                ++module_count
                context.push('MODULE::REQUIRE')
            } else if (token === 'STRING') {
                if (context.includes('MODULE::REQUIRE')) {
                    modules.push(PATH.join(PATH.dirname(input), value.slice(1, value.length - 1) + '.ps'))
                    readFile(PATH.join(PATH.dirname(input), value.slice(1, value.length - 1) + '.ps'))
                }
            }

        }
    }
}

FS.exists(input, bool => {
    if (bool) {
        readFile(input)
        FS.readFile(input, 'utf-8', (error, content) => {
            if (error) throw error
            new Transpiler(content).transpile(input, undefined, module_count, code => {
                eval(code)
            })
        })
    }
})