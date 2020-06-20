/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

import { Tokenizer } from './parser'
import Tokens        from './tokens/tokens'
import {Token}       from './scanner'
import Tabdown       from './tabdown'
import * as FS       from 'fs'
import * as PATH     from 'path'

let content   : any
let variables : Object        = {}
let functions : Array<string> = []

export default class Transpiler {

    constructor (file_content) {

        Tokenizer.addTokenSet(Tokens)

        content = file_content.split(/\n/g)

    }

    transpile (filename) {

        const code        = []
        let   export_stat = false
        for (const index in content) {
            if (content.hasOwnProperty(index)) {
                const line     : string        = content[index]
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
                                if (context.filter(x => ['VARIABLE::USE', 'VARIABLE::DECLARATION'].includes(x)).length > 0 &&
                                    variables[var_name] !== 'array') {
                                    variables[var_name] = token.toLowerCase()
                                    if (context.includes('MODULE::REQUIRE')) {
                                        built.push('"./' + value.slice(1, value.length - 1).replace('.ps', '.js') + '"')
                                        FS.readFile(value.slice(1, value.length - 1), 'UTF-8', (error, content) => {
                                            if (error) throw error
                                            new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(value.slice(1, value.length - 1).replace('.ps', '.js'))
                                        })
                                    } else {
                                        built.push(value)
                                    }
                                } else {
                                    built.push(value)
                                }
                                break
                            }

                            case 'COMMENT': {
                                built.push('//' + value.trim().slice(2))
                                break
                            }

                            case 'WORD': {
                                if (!context.includes('FUNCTION::START')) {
                                    if (variables[value] !== undefined) {
                                        built.push(value)
                                        context.push('VARIABLE::USE')
                                    } else if (functions.includes(value)) {
                                        built.push(value)
                                        context.push('FUNCTION::CALL')
                                    } else {
                                        built.push(`var ${value}`)
                                        variables[value] = ''
                                        context.push('VARIABLE::DECLARATION')
                                    }
                                } else if (context.includes('FUNCTION::START')) {
                                    if (!context.includes('FUNCTION::ARGUMENTS')) {
                                        if (export_stat) {
                                            built.push(value + '= function')
                                        } else {
                                            built.push(value)
                                        }
                                        functions.push(value)
                                    } else {
                                        built.push(value)
                                        variables[value] = ''
                                    }

                                } else{
                                    built.push(value)
                                }
                                var_name = value
                                break
                            }

                            case 'ARGUMENTS': {
                                built.push('(')
                                context.push('FUNCTION::ARGUMENTS')
                                break
                            }

                            case 'IMPORT': {
                                context.push('MODULE::IMPORT')
                                break
                            }

                            case 'FROM': {
                                if (context.includes('MODULE::IMPORT')) {
                                    built.push('= require(')
                                    context.push('MODULE::REQUIRE')
                                }
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
                                        if (!var_name) break
                                        if (!variables[var_name]) break
                                        switch (variables[var_name]) {
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
                                built.push(value)
                                break
                            }
                            
                            case 'ARRAY': {
                                if (value === ':=') built.push('[')
                                else if (value === '=:') built.push(']')
                                break
                            }

                            case 'COMMA': {
                                built.push(value)
                                break
                            }

                            case 'ADD': {
                                switch (variables[var_name]) {

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
                                switch (variables[var_name]) {

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

                            case 'EXPORT': {
                                export_stat = true
                                built.push('module.exports.')
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
                                if (context.includes('MODULE::REQUIRE')) {
                                    built.push('); ')
                                    context.splice(context.findIndex(x => x === 'MODULE::REQUIRE'), 1)
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

                            case 'FUNCTION': {
                                if (!export_stat) {
                                    built.push('function ')
                                }
                                context.push('FUNCTION::START')
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
                if (context.includes('FUNCTION::ARGUMENTS')) {
                    built.push('):')
                    export_stat = false
                    context.splice(context.findIndex(x => x === 'FUNCTION::ARGUMENTS'), 1)
                }
                if (context.includes('MODULE::REQUIRE')) {
                    built.push(')')
                    context.splice(context.findIndex(x => x === 'MODULE::REQUIRE'), 1)
                }

                code.push(built.join(''))

                built   = []
                context = []

            }

        }

        FS.writeFile(filename, new Tabdown(code).tab().join('\n'), error => {
            if (error) throw error
        })

    }

}