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

        const code = []

        for (const index in this.content) {

            const line    : string        = this.content[index]
            const tokens  : Array<Token>  = Tokenizer.tokenize(line)
            let   context : Array<string> = [],
                  built   : Array<string> = []
            for (const item_token in tokens) {

                let item  : Token  = tokens[item_token],
                    value : string = item.value,
                    token : string = item.token
                switch (token) {

                    case 'PRINT': {
                        context.push(token)
                        built.push('console.log(')
                        break
                    }

                    case 'SPACE': {
                        if (context.includes('PRINT') ||
                            context.includes('VARIABLE')) {
                            if (!['PRINT', 'SIGNS'].includes(tokens.slice(parseInt(item_token) - 1).filter(x => x.token !== 'SPACE')[0].token) &&
                                !Array.from(Object.keys(this.variables)).includes(tokens.slice(parseInt(item_token) - 1).filter(x => x.token !== 'SPACE')[0].value)) {
                                built.push(', ')
                            } else if (tokens.slice(parseInt(item_token) - 1).filter(x => x.token !== 'SPACE')[0].token === 'SIGNS' &&
                                       tokens.slice(parseInt(item_token) + 1).filter(x => x.token === 'SPACE').length > 0) {
                                built.push('[')
                                context.push('ARRAY')
                            }
                        }
                        break
                    }

                    case 'STRING': {
                        const match = value.match(/::\w+::?/g)
                        if (match) {
                            for (const occurrence of match) {
                                const variable_name = occurrence.slice(2, occurrence.length - 2)
                                if (Array.from(Object.keys(this.variables)).includes(variable_name)) {
                                    value = value.replace(occurrence, '${' + variable_name + '}')
                                } else {
                                    throw 'VARIABLE CALLED "' + variable_name + '" DOES NOT EXISTS!'
                                }
                            }
                            built.push(value.replace(/"/g, '`'))
                        } else {
                            built.push(value)
                        }
                        break
                    }

                    case 'WORD': {
                        if (Array.from(Object.keys(this.variables)).includes(value)) {
                            built.push(value)
                        } else {
                            if (parseInt(item_token) === 0) {
                                built.push(`var ${value}`)
                                this.variables[value] = ''
                                context.push('VARIABLE')
                            }
                        }
                        break
                    }
                    case 'SIGNS': {
                        built.push(value)
                        break
                    }

                    case 'L_PAREN': {
                        if (context.includes('VARIABLE')) {
                            built.push('[')
                            context.push('ARRAY')
                        }
                        break
                    }

                    case 'R_PAREN': {
                        if (context.includes('VARIABLE')) {
                            built.push(']')
                        }
                        break
                    }

                }

            }

            for (const context_item in context) {
                if (context.includes('ARRAY')) {
                    built.push(']')
                }
                if (!context.includes('VARIABLE')) {
                    built.push(')')
                }
                context.splice(Number(context_item), 1)
            }

            console.log(built.join(''))
            code.push(built.join(''))
            built = []
        }
        //eval(code.join('\n'))

    }

}