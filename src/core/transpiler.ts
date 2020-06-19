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
                                if (context.filter(x => ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x)).length > 0 &&
                                    this.variables[var_name] !== 'array') {
                                    this.variables[var_name] = token.toLowerCase()
                                }
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

                            case 'SIGNS': {
                                if (value === '=') {
                                    if (context.includes('CONDITION::START')) {
                                        built.push('==')
                                    } else if (context.filter(x => ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x)).length > 0) {
                                        built.push('=')
                                    }
                                } else {
                                    if (value === '-') {
                                        console.log(this.variables[var_name])
                                        if (!var_name) break
                                        if (!this.variables[var_name]) break
                                        switch (this.variables[var_name]) {
                                            case 'string': {
                                                built.push('.replace(')
                                                context.push('STRING::REMOVE')
                                                break
                                            }
                                            case 'array': {
                                                built.push('.filter(x => x !== ')
                                                context.push('ARRAY::REMOVE')
                                                break
                                            }

                                            case 'int': {
                                                built.push(value)
                                                break
                                            }
                                        }

                                    } else {
                                        built.push(value)
                                    }
                                }
                                break
                            }

                            case 'INDEX': {
                                built.push('[' + value.slice(1, value.length - 1) + ']')
                                break
                            }

                            case 'PROPERTY': {
                                built.push('.' + value.slice(1))
                                break
                            }

                            case 'L_PAREN': case 'R_PAREN': {
                                if (context.filter(x => ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x)).length > 0) {
                                    if (token === 'L_PAREN') built.push('[')
                                    else if (token === 'R_PAREN') built.push(']')
                                    this.variables[var_name] = 'array'
                                }
                                break
                            }

                            case 'COMMA': {
                                built.push(value)
                                break
                            }

                            case 'ADD': {
                                switch (this.variables[var_name]) {

                                    case 'string': case 'int': {
                                        built.push('+=')
                                        break
                                    }

                                    case 'array': {
                                        built.push('.push(')
                                        context.push('ARRAY::PUSH')
                                        break
                                    }
                                }
                                break
                            }

                            case 'REMOVE': {
                                switch (this.variables[var_name]) {

                                    case 'int': {
                                        built.push('-=')
                                        break
                                    }

                                    case 'string': {
                                        built.push(' = ' + var_name + '.replace(')
                                        context.push('STRING::REMOVE')
                                        break
                                    }

                                    case 'array': {
                                        built.push(' = ' + var_name + '.filter(x => x !== ')
                                        context.push('ARRAY::REMOVE')
                                        break
                                    }

                                }
                                break
                            }

                            case 'IF': {
                                built.push('if(')
                                context.push('CONDITION::START')
                                break
                            }

                            case 'ELIF': {
                                built.push('else if(')
                                context.push('CONDITION::START')
                                break
                            }

                            case 'ELSE': {
                                built.push('else:')
                                break
                            }

                            case 'TABS': {
                                if (parseInt(item_token) === 0) {
                                    built.push(value)
                                }
                                break
                            }

                            case 'AND': {
                                if (context.includes('STRING::REMOVE')) {
                                    built.push(', ""); ')
                                    context.splice(context.findIndex(x => x === 'STRING::REMOVE'), 1)
                                }
                                if (context.includes('ARRAY::REMOVE')) {
                                    built.push('); ')
                                    context.splice(context.findIndex(x => x === 'ARRAY::REMOVE'), 1)
                                }
                                if (context.includes('ARRAY::PUSH')) {
                                    built.push('); ')
                                    context.splice(context.findIndex(x => x === 'ARRAY::PUSH'), 1)
                                }
                                if (context.includes('PRINT::START')) {
                                    built.push('); ')
                                    context.splice(context.findIndex(x => x === 'PRINT::START'), 1)
                                }
                                if (context.includes('CONDITION::START')) {
                                    built.push('&&')
                                }
                                break
                            }

                            case 'LOOP': {
                                built.push('for(')
                                context.push('LOOP::START')
                                break
                            }

                            case 'WHILE': {
                                built.push('while(')
                                context.push('LOOP::START')
                                break
                            }

                            case 'IN': {
                                built.push(' in ')
                                break
                            }

                            case 'PRINT': {
                                built.push('console.log(')
                                context.push('PRINT::START')
                                break
                            }

                        }

                    }

                }

                if (context.includes('STRING::REMOVE')) {
                    built.push(', "")')
                    context.splice(context.findIndex(x => x === 'STRING::REMOVE'), 1)
                }
                if (context.includes('ARRAY::REMOVE')) {
                    built.push(')')
                    context.splice(context.findIndex(x => x === 'ARRAY::REMOVE'), 1)
                }
                if (context.includes('ARRAY::PUSH')) {
                    built.push(')')
                    context.splice(context.findIndex(x => x === 'ARRAY::PUSH'), 1)
                }
                if (context.includes('PRINT::START')) {
                    built.push(')')
                    context.splice(context.findIndex(x => x === 'PRINT::START'), 1)
                }
                if (context.includes('CONDITION::START')) {
                    built.push('):')
                    context.splice(context.findIndex(x => x === 'CONDITION::START'), 1)
                }
                if (context.includes('LOOP::START')) {
                    built.push('):')
                    context.splice(context.findIndex(x => x === 'LOOP::START'), 1)
                }

                code.push(built.join(''))

                built   = []
                context = []

            }

        }

        console.log(code)

    }

}