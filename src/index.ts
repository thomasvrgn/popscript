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

    private module_count : number        = 0
    private modules      : Array<string> = []

    constructor () {
        Tokenizer.addTokenSet(Tokens)
    }

    public file (path, callback) {
        function readFile (file) {
            const content: any = FS.readFileSync(file, 'utf-8').split(/\r?\n/).join('\n').split('\n')
            for (const line of content) {
                let context: Array<string> = []
                for (const item of Tokenizer.tokenize(line)) {
                    const token = item.token,
                          value = item.value
        
                    if (token === 'IMPORT') {
                        ++this.module_count
                        context.push('MODULE::REQUIRE')
                    } else if (token === 'STRING') {
                        if (context.includes('MODULE::REQUIRE')) {
                            this.modules.push(PATH.join(PATH.dirname(path), value.slice(1, value.length - 1) + '.ps'))
                            readFile(PATH.join(PATH.dirname(path), value.slice(1, value.length - 1) + '.ps'))
                        }
                    }
        
                }
            }
        }
        
        FS.exists(path, bool => {
            if (bool) {
                readFile(path)
                FS.readFile(path, 'utf-8', (error, content) => {
                    if (error) throw error
                    new Transpiler(content).transpile(path, undefined, this.module_count, code => {
                        eval(code)
                        callback()
                    })
                })
            }
        })
        
    }

    public text (content, callback) {

        new Transpiler(content).transpile(undefined, undefined, 0, code => {
            eval(code)
            callback()
        })

    }

}
