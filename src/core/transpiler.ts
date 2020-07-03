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
                                    this.specs.variables[value] = ''
                                } else if (context.slice(-1)[0] === 'PROTOTYPE::CALL::ARGUMENTS') {
                                    built.push(value)
                                    ++this.specs.currents.count_args
                                    if (tokens.slice(parseInt(token_index) + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).length > 0) {
                                        built.push(', ')
                                    } else {
                                        built.push(')')
                                    }
                                } else if (this.specs.variables[value] !== undefined) {
                                    built.push(value)
                                } else if (this.specs.prototypes[value] !== undefined) {
                                    built.push('.' + value)
                                    context.push('PROTOTYPE::CALL')
                                    this.specs.currents.prototype = value
                                    if (tokens.slice(parseInt(token_index) + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).filter(x => x.token === 'CALL').length === 0) {
                                        built.push('()')
                                    }
                                } else {
                                    built.push(`var ${value}`)
                                    this.specs.variables[value] = ''
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
                                } else if (context.slice(-1)[0] === 'PROTOTYPE::CALL') {
                                    built.push('(')
                                    context.push('PROTOTYPE::CALL::ARGUMENTS')
                                }
                                break
                            }

                            case 'STRING': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::CALL::ARGUMENTS') {
                                    built.push(value)
                                    ++this.specs.currents.count_args
                                    if (tokens.slice(parseInt(token_index) + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).length > 0) {
                                        built.push(', ')
                                    } else if (this.specs.currents.count_args === this.specs.prototypes[this.specs.currents.prototype].arguments.length) {
                                        built.push(')')   
                                    } else {
                                        built.push(')')
                                    }
                                }
                            }

                            case 'TYPES': {
                                if (context.slice(-1)[0] === 'PROTOTYPE::TYPE') {
                                    if (value === 'string') built.unshift('String')
                                    else if (value === 'array') built.unshift('Array')
                                    else if (value === 'int') built.unshift('Number')
                                    else if (value === 'any') built.unshift('Object')

                                    this.specs.prototypes[this.specs.currents.prototype].type = value
                                    
                                    if (tokens.slice(parseInt(token_index) + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).filter(x => x.token === 'CALL').length === 0) {
                                        built.push(' = function ():')
                                    }
                                }

                                break
                            }

                        }
                    }
                }
            }

            context = []
            console.log(built.join(''))
        }

    }

}