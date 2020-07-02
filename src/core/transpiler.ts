/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

import { Tokenizer } from './parser'
import Tokens        from './tokens/tokens'
import {Token}       from './scanner'
import Tabdown       from './tabdown'



export default class Transpiler {

    private content : Array<string> = []
    private specs   : Object        = {
        variables: {

        },
        functions: {

        },
    }

    constructor (file_content) {

        Tokenizer.addTokenSet(Tokens)

        this.content = file_content.split(/\n/g)

    }

    transpile () {
        
        for (const index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                const line    : string        = this.content[index],
                      tokens  : Array<Token>  = Tokenizer.tokenize(line),
                      context : Array<string> = [],
                      built   : any           = []

                for (const token_index in tokens) {
                    if (tokens.hasOwnProperty(token_index)) {
                        const item  : Token  = tokens[token_index],
                              value : string = item.value,
                              token : string = item.token

                    }
                }
            }
        }

    }

}