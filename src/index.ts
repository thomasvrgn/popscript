/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler'
import { Tokenizer } from './core/parser'
import Tokens from './core/tokens/tokens'
import * as FS from 'fs'
import * as PATH from 'path'

const input   : string        = PATH.join(__dirname, '..', 'example', 'index.ps')
let   modules : Array<string> = []

export default class Popscript {

    constructor () {
        Tokenizer.addTokenSet(Tokens)
    }

    public file (path) {
        function readFile (file) {
            const content: any = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n')
            modules.push(content)
            for (const line of content) {
                let context: Array<string> = []
                for (const item of Tokenizer.tokenize(line)) {
                    const token = item.token,
                        value = item.value

                    if (token === 'IMPORT') {
                        context.push('IMPORT::DECLARE')
                    } else if (token === 'STRING') {
                        if (context.includes('IMPORT::DECLARE')) {

                            readFile(PATH.join(PATH.dirname(path), value.slice(1, value.length - 1)))

                        }
                    }

                }
            }
        }

        FS.exists (path, bool => {
            if (bool) {
                readFile(path)
                const code = new Transpiler(modules.reverse().map(x => x.join('\n')).join('\n')).transpile()

                console.log(code)
            
            }
        })

    }

    public text (content) {

        new Transpiler(content).transpile()

    }

}

new Popscript().file(input)
