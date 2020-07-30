/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler    from './core/transpiler'
import { Tokenizer } from './core/parser'
import Tokens        from './core/tokens/tokens'
import * as FS       from 'fs'
import * as PATH     from 'path'

export default class Popscript {

    private modules : Array<string> = []
    private content : Array<string> = []

    constructor () {
        Tokenizer.addTokenSet(Tokens)
    }

    public file (file = '', callback = () => {}) {

        const readFile = (file) => {
            const cntnt: any = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n')
            for (const line of cntnt) {
                let context: Array<string> = []
                this.content.push(line)
                for (const item of Tokenizer.tokenize(line)) {
                    const token = item.token,
                          value = item.value
        
                    if (token === 'IMPORT') {
                        context.push('MODULE::REQUIRE')
                    } else if (token === 'STRING') {
                        if (context.includes('MODULE::REQUIRE')) {
                            context.pop()
                            this.modules.push(PATH.join(PATH.dirname(file), value.slice(1, value.length - 1)))
                            if (!value.slice(1, value.length - 1).endsWith('.js')) {
                                readFile(PATH.join(PATH.dirname(file), value.slice(1, value.length - 1)))
                            }
                        }
                    }
        
                }
            }
        }

        readFile(file)
        new Transpiler(this.content.join('\n'), this.modules).transpile()

    }

}

new Popscript().file(PATH.join(__dirname, '..', 'example', 'index.ps'), () => {})
