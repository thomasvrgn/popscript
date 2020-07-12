/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

import { Tokenizer } from './parser'
import Tokens        from './tokens/tokens'
import {Token}       from './scanner'
import Tabdown       from './tabdown'
import * as Path     from 'path'
import * as FS       from 'fs'

export default class Transpiler {

    private content : Array<string> = []
    private tabsize : number        = 0
    private code    : Array<string> = []
    private specs                   = {
        current   : {
            variable: '',
        },
        variables : {

        }
    }

    constructor (file_content : string = '') {

        Tokenizer.addTokenSet(Tokens)

        this.content = file_content.split(/\n/g).filter(x => x.trim().length > 0)

    }

    public async transpile () {

        const PATH = Path.resolve(Path.join(__dirname, 'addons'))

        for (const index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                let line    : string        = this.content[index],
                    tokens  : Array<Token>  = Tokenizer.tokenize(line),
                    context : Array<string> = [],
                    built   : any           = []
                
                for (const token_index in tokens) {
                    if (tokens.hasOwnProperty(token_index)) {
                        const item  : Token  = tokens[token_index],
                              value : string = item.value,
                              token : string = item.token

                        if (FS.existsSync(Path.join(PATH, token.toLowerCase() + '.js'))) {
                            const addon = require(Path.join(PATH, token.toLowerCase() + '.js')).default
                            built.push(new addon().exec(token, value, context, this.specs, tokens, parseInt(token_index), built))
                        }
                    }
                }

                this.code.push(built.join(''))
                context = []
                
            }

        }

        const variables = Object.keys(this.specs.variables).filter(x => this.specs.variables[x].type !== 'aliase')

        if (variables.length > 0) {
            this.code.unshift('var ' + variables.join(', '))
        }

        console.log(new Tabdown(this.code).tab().join('\n'))

    }

}