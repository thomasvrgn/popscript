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
    private tabsize : number        = 0
    private code    : Array<string> = []
    private specs                   = {
        currents : {
            variable   : '',
            prototype  : '',
            function   : '',
            count_args : 0 
        },
        variables: {

        },
        functions: {

        },
        prototypes: {

        }
    }

    constructor (file_content) {

        Tokenizer.addTokenSet(Tokens)

        this.content = file_content.split(/\n/g).filter(x => x.trim().length > 0)

    }

    transpile () {
        
        for (const index in this.content) {
            if (this.content.hasOwnProperty(index)) {
                let   line    : string        = this.content[index],
                      tokens  : Array<Token>  = Tokenizer.tokenize(line),
                      context : Array<string> = [],
                      built   : any           = [],
                      depth   : number        = 0
                
                for (const token_index in tokens) {
                    if (tokens.hasOwnProperty(token_index)) {
                        const item  : Token  = tokens[token_index],
                              value : string = item.value,
                              token : string = item.token
                        switch (token) {

                            case 'WORD': {

                                if (!this.specs.variables[value]) {
                                    this.specs.variables[value] = {
                                        type  : ''
                                    }
                                }

                                break
                            }

                            case 'TABS': {

                                if (!this.tabsize) this.tabsize = value.length
                                depth = value.length / this.tabsize
                                
                                break
                            }
                        }
                    }
                }

                context = []
                this.code.push(built.join(''))

            }

        }

        this.code.unshift('var ' + Object.keys(this.specs.variables).join(', '))

        console.log(this.code)

    }

}