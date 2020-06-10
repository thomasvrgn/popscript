/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

import { Tokenizer } from './parser'
import Tokens        from './tokens/tokens'
import {Token}       from './scanner';

export default class Transpiler {

    private readonly content   : any
    private readonly variables : Object = {}

    constructor (content) {

        Tokenizer.addTokenSet(Tokens)

        this.content = content.split(/\n/g)


    }

    transpile () {

        for (const index in this.content) {

            const line    : string        = this.content[index]
            const tokens  : Array<Token>  = Tokenizer.tokenize(line)
            let   context : Array<string> = [],
                  built   : Array<string> = []
            for (const item_token in tokens) {

                const item  : Token = tokens[item_token],
                      value : string = item.value,
                      token : string = item.token
                switch (token) {

                    case 'PRINT': {
                        context.push(token)
                        built.push('console.log(')
                        break
                    }

                    case 'SPACE': {

                        break
                    }

                    case 'STRING': {
                        built.push(value)
                        break
                    }

                    case 'WORD': {
                        if (Array.from(Object.keys(this.variables)).includes(value)) {
                            built.push(value)
                        } else {
                            if (parseInt(item_token) === 0) {
                                built.push(`var ${value}`)
                            }
                        }
                        break
                    }
                    case 'SIGNS': {
                        built.push(value)
                        break
                    }

                }



            }
            for (const context_item in context) {
                context.splice(Number(context_item), 1)
                built.push(')')
            }
            eval(built.join(''))
            built = []
        }

    }

}