/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

import { Tokenizer } from './parser'
import Tokens        from './tokens/tokens'
import {Token}       from './scanner'
import Tabdown       from './tabdown'

export default class Transpiler {

    private readonly content   : any
    private readonly variables : Object = {}
    private readonly functions : Array<string> = []

    constructor (content) {

        Tokenizer.addTokenSet(Tokens)

        this.content = content.split(/\n/g)

    }

    transpile () {

        const code = []

        for (const index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                const line     : string        = this.content[index]
                const tokens   : Array<Token>  = Tokenizer.tokenize(line)
                let   context  : Array<string> = [],
                      built    : Array<string> = [],
                      var_name : string        = ''

                for (const item_token in tokens) {
                    if (tokens.hasOwnProperty(item_token)) {
                        let item  : Token  = tokens[item_token],
                            value : string = item.value,
                            token : string = item.token

                        if (!token) return console.log('Can\'t understand this keyword "' + value + '" at line', index)

                        switch (token) {

                            case 'STRING': case 'INT': {
                                built.push(value)
                                break
                            }

                            case 'COMMENT': {
                                built.push('//' + value.trim().slice(2))
                                break
                            }

                            case 'WORD': {
                                if (this.variables[value] !== undefined) {
                                    built.push(value)
                                    context.push('VARIABLE::USE')
                                } else {
                                    built.push(`var ${value}`)
                                    this.variables[value] = ''
                                    context.push('VARIABLE::DECLARATION')
                                }
                                var_name = value
                                break
                            }

                        }

                    }

                }

                code.push(built.join(''))

                built   = []
                context = []

            }


        }

        //console.log(code)

    }

}