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
    private specs                   = {
        currents : {
            variable  : '',
            prototype : '',
            function  : ''
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
                        switch (token) {

                            case 'PROTOTYPE': {
                                built.push('.prototype')
                                context.push('PROTOTYPE::DECLARE')
                                break
                            }

                            case 'WORD': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::INFORMATIONS') {
                                    built.push(value)
                                    this.specs.prototypes[value] = {}
                                    this.specs.currents.prototype = value
                                    context.push('PROTOTYPE::TYPE')
                                } else if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    built.unshift(value)
                                    if (tokens.slice(parseInt(token_index) + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).filter(x => x.token === 'CALL').length === 0) {
                                        built.push(' = function ():')
                                    }
                                } else if (context.slice(-1)[0] === 'PROTOTYPE::ARGUMENTS') {
                                    if (!this.specs.prototypes[this.specs.currents.prototype].arguments) this.specs.prototypes[this.specs.currents.prototype].arguments = []
                                    if (tokens.slice(parseInt(token_index) + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).length > 0) {
                                        built.push(value + ', ')
                                    } else {
                                        built.push(value + '):')
                                    }
                                    this.specs.prototypes[this.specs.currents.prototype].arguments.push(value)
                                }
                                break
                            }

                            case 'CALL': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::DECLARE') {
                                    built.push('.')
                                    context.push('PROTOTYPE::INFORMATIONS')
                                } else if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    built.push(' = function (')
                                    context.push('PROTOTYPE::ARGUMENTS')
                                }
                                break
                            }

                            case 'TYPES': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    if (value === 'string') built.unshift('String')
                                    else if (value === 'array') built.unshift('Array')
                                    else if (value === 'int') built.unshift('Number')
                                    else if (value === 'any') built.unshift('Object')

                                    this.specs.prototypes[this.specs.currents.prototype].type = value
                                }
                                break
                            }

                        }
                    }
                }
            }
            console.log(built.join(''))
        }

    }

}