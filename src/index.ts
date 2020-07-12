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
            this.content.push(cntnt)
            for (const line of cntnt) {
                let context: Array<string> = []
                for (const item of Tokenizer.tokenize(line)) {
                    const token = item.token,
                          value = item.value
        
                    if (token === 'IMPORT') {
                        context.push('MODULE::REQUIRE')
                    } else if (token === 'WORD') {
                        if (context.includes('MODULE::REQUIRE')) {
                            context.pop()
                            this.modules.push(PATH.join(PATH.dirname(file), value!  + '.ps'))
                            readFile(PATH.join(PATH.dirname(file), value + '.ps'))
                        }
                    }
        
                }
            }
        }

        readFile(file)

        new Transpiler(this.content.map(x => x.join('\n')).join('\n')).transpile()

    }

}

new Popscript().file(PATH.join(__dirname, '..', 'example', 'index.ps'), () => {})
