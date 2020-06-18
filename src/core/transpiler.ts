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
                const line    : string        = this.content[index]
                const tokens  : Array<Token>  = Tokenizer.tokenize(line)
                let   context : Array<string> = [],
                      built   : Array<string> = [],
                      var_name : string

                for (const item_token in tokens) {
                    if (tokens.hasOwnProperty(item_token)) {
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
                                if (context.includes('PRINT')    ||
                                    context.includes('VARIABLE')) {
                                    if (tokens.slice(parseInt(item_token) - 1)
                                        .filter(x => x.token !== 'SPACE')
                                        .filter(x => ['PRINT', 'SIGNS'].includes(x.token)).length === 0) {
                                        built.push(', ')
                                    } else if (tokens.slice(parseInt(item_token) - 1).filter(x => x.token !== 'SPACE')[0].token === 'SIGNS' &&
                                        tokens.slice(parseInt(item_token) + 1).filter(x => x.token === 'SPACE').length > 0) {
                                        this.variables[built[0].replace('var ', '')] = 'array'
                                    }
                                } else {
                                    if (context.includes('ARGUMENTS')) {
                                        if (tokens.slice(parseInt(item_token) - 1).filter(x => x.token !== 'SPACE')[0].token !== 'ARGUMENTS' &&
                                            tokens.slice(parseInt(item_token)).filter(x => x.token !== 'SPACE').length > 0) {
                                            built.push(', ')
                                        }
                                    } else {
                                        built.push(' ')
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
                                if (context.includes('VARIABLE')) {
                                    if (this.variables[var_name] !== 'array') {
                                        this.variables[var_name] = 'string'
                                    }
                                }
                                if (['JOIN', 'SPLIT'].includes(context[context.length - 1])) {
                                    built.push(')')
                                }
                                break
                            }

                            case 'JOIN': case 'SPLIT': {
                                built.push(`.${value.toLowerCase()}(`)
                                context.push(token)
                                break
                            }

                            case 'WORD': {
                                if (Array.from(Object.keys(this.variables)).includes(value)) {
                                    built.push(value)
                                } else {
                                    if (parseInt(item_token) === 0) {
                                        if (this.functions.includes(value)) {
                                            built.push(value)
                                            context.push('FUNCTION_CALL')
                                        } else {
                                            built.push(`var ${value}`)
                                            this.variables[value] = ''
                                            context.push('VARIABLE')
                                            var_name = value
                                        }
                                    } else {
                                        if (context[context.length - 1] === 'FUNCTION') {
                                            built.push(value)
                                            this.functions.push(value)
                                        } else if (context.includes('ARGUMENTS')) {
                                            built.push(value)
                                            this.variables[value] = ''
                                            if (tokens.slice(parseInt(item_token) + 1).filter(x => x.token !== 'SPACE').length === 0) {
                                                built.push('):')
                                            }
                                        } else {
                                            built.push(value)
                                        }
                                    }
                                }
                                break
                            }

                            case 'SIGNS': {
                                built.push(value)
                                break
                            }

                            case 'ADD': {
                                const variable = tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').reverse()[0]
                                if (!variable) break
                                var_name = variable.value
                                console.log(this.variables)
                                if (this.variables[var_name] === 'string') built.push('+=')
                                else if (this.variables[var_name] === 'array') {
                                    built.push('.push(')
                                    context.push('ADD')
                                } else if (this.variables[var_name] === 'number') built.push('+=')
                                break
                            }

                            case 'REMOVE': {
                                const variable = tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').reverse()[0]
                                if (!variable) break
                                var_name = variable.value
                                if (this.variables[var_name] === 'string') {
                                    built.push(`= ${var_name}.replace(`)
                                    context.push('REMOVE')
                                } else if (this.variables[var_name] === 'array') {
                                    built.push(`= ${var_name}.filter(x => x !== `)
                                    context.push('REMOVE')
                                } else if (this.variables[var_name] === 'number') built.push('-=')
                                break
                            }

                            case 'INDEX': {
                                if (tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').pop().token === 'WORD' &&
                                    tokens.slice(parseInt(item_token)).filter(x => x.token !== 'SPACE')[0].token === 'INT') {
                                    if (this.variables[tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').pop().value] === 'array') {
                                        built.push('[')
                                        context.push('INDEX')
                                    }
                                } else if (['WORD', 'STRING'].includes(tokens.slice(0, parseInt(item_token) - 1)
                                        .filter(x => x.token !== 'SPACE')[tokens.slice(0, parseInt(item_token) - 1)
                                        .filter(x => x.token !== 'SPACE').length - 1].token) ||
                                    ['WORD', 'STRING'].includes(tokens.slice(0, parseInt(item_token))
                                        .filter(x => x.token !== 'SPACE')[tokens.slice(0, parseInt(item_token))
                                        .filter(x => x.token !== 'SPACE').length - 1].token)) {
                                    built.push('.')
                                }

                                break
                            }

                            case 'INT': {
                                built.push(value)
                                context.filter(x => x === 'INDEX').map(x => built.push(']'))
                                if (context.includes('VARIABLE')) {
                                    this.variables[var_name] = 'number'
                                }
                                break
                            }

                            case 'L_PAREN': {
                                if (context.includes('VARIABLE')) {
                                    built.push('[')
                                    context.push('ARRAY')
                                    this.variables[var_name] = 'array'
                                } else if (context[context.length - 1] === 'FUNCTION_CALL') {
                                    built.push('(')
                                }
                                break
                            }

                            case 'R_PAREN': {
                                if (context.includes('VARIABLE')) {
                                    built.push(']')
                                } else if (context[context.length - 1] === 'FUNCTION_CALL') {
                                    built.push(')')
                                }
                                break
                            }

                            case 'FUNCTION': {
                                built.push('function')
                                context.push('FUNCTION')
                                break
                            }

                            case 'ARGUMENTS': {
                                if (context[context.length - 1] === 'FUNCTION') {
                                    built.push('(')
                                    context.push(token)
                                }
                                break
                            }

                            case 'TABS': {
                                built.push(value)
                                break
                            }

                        }

                    }

                }
                for (const context_item in context) {
                    if (context.hasOwnProperty(context_item)) {
                        if (!context.includes('VARIABLE')      &&
                            !context.includes('FUNCTION')      &&
                            !context.includes('FUNCTION_CALL') &&
                            !context.includes('JOIN')          &&
                            !context.includes('SPLIT')) {
                            if (context.includes('ADD') || context.includes('REMOVE')) {
                                if (this.variables[var_name] === 'string') built.push(', "")')
                                else if (this.variables[var_name] === 'array') built.push(')')
                            } else {
                                built.push(')')
                            }
                        }
                        context.splice(Number(context_item), 1)
                    }
                }

                code.push(built.join(''))
                built = []
                context = []

            }

        }

        eval(new Tabdown(code).tab().join('\n'))

    }

}