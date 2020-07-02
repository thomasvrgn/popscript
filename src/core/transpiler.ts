/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

import { Tokenizer } from './parser'
import Tokens        from './tokens/tokens'
import {Token}       from './scanner'
import Tabdown       from './tabdown'
import * as fs       from 'fs'
import * as PATH     from 'path'
import * as Beautify from 'js-beautify'
import * as Terser   from 'terser'

let   content    : any
let   variables  : Object        = {}
let   functions  : Array<string> = []
let   folder     : string
let   code                      = []
let   mod_count  : number        = undefined
let   imported   : number        = 0
let   prototypes : Array<string> = []

export default class Transpiler {

    constructor (file_content) {

        Tokenizer.addTokenSet(Tokens)

        content = file_content.split(/\n/g)

    }

    transpile (filename, modname = undefined, module_cnt, callback: Function = Function) {
        if (!folder && filename) folder = PATH.dirname(filename)
        let mod_name  = modname,
            temp_code = []
        
        if (modname) {
            temp_code.push(`var ${mod_name} = {}`)
            imported += 1
        }
        if (module_cnt && !mod_count) mod_count = module_cnt
        else mod_count = 0
        for (const index in content) {
            if (content.hasOwnProperty(index)) {
                const line     : string        = content[index]
                const tokens   : Array<Token>  = Tokenizer.tokenize(line)
                let   context  : Array<string> = [],
                      built    : any           = [],
                      var_name : string        = ''
                let array_cnt  = 0,
                    item_cnt   = 0
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
                                        variables[var_name] = 'module'
                                        built = []
                                        if (context.includes('MODULE::JAVASCRIPT')) {
                                            built.push(value)
                                            fs.readFile(PATH.join(folder, value.slice(1, value.length - 1)), 'UTF-8', (error, content) => {
                                                if (error) throw error
                                                built.push(content)
                                            })
                                        } else {
                                            fs.readFile(folder + '\\' + value.slice(1, value.length - 1) + '.ps', 'UTF-8', (error, content) => {
                                                if (error) throw error
                                                new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(folder + '\\' + value.slice(1, value.length - 1) + '.ps', var_name, mod_count, code => {
                                                    if (mod_count === imported) {
                                                        callback(code)
                                                    }
                                                })
                                            })
                                        }
                                        context = []
                                    } else {
                                        if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                            built.push(value)
                                        } else {
                                            built.push(value)
                                        }
                                    }
                                } else {
                                    built.push(value)
                                    if (variables[var_name] === 'array' && array_cnt > 0) {
                                        variables[var_name + (array_cnt > 1 ? '[' + (array_cnt + 1) + ']' : '') + '[' + (item_cnt) + ']'] = token.toLowerCase()
                                        item_cnt += 1
                                    }
                                }
                                if (context.includes('CONVERSION::INT')) {
                                    built.push(')')
                                    context.splice(context.findIndex(x => x === 'CONVERSION::INT'), 1)
                                } else if (context.includes('CONVERSION::STRING')) {
                                    built.push(').toString()')
                                    context.splice(context.findIndex(x => x === 'CONVERSION::STRING'), 1)
                                }
                                break
                            }

                            case 'OPTIONAL': {
                                context.push('FUNCTION::OPTIONAL')
                                break
                            }

                            case 'COMMENT': {
                                built.push('//' + value.trim().slice(2))
                                break
                            }

                            case 'JAVASCRIPT': {
                                context.push('MODULE::JAVASCRIPT')
                                break
                            }

                            case 'THIS': {
                                built.push('this')
                                break
                            }

                            case 'WORD': {
                                if (!context.includes('FUNCTION::START')) {
                                    if (variables[value] !== undefined) {
                                        context.push('VARIABLE::USE')
                                        if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                            built.push(value)
                                        } else {
                                            built.push(value)
                                        }
                                    } else if (functions.includes(value)) {
                                        built.push(value)
                                        context.push('FUNCTION::CALL')
                                    } else if (context.includes('PROTOTYPE::START') && !context.includes('PROTOTYPE::ARGUMENTS')) {
                                        prototypes.push(value)
                                        built.push(value + '= function')
                                        context.push('PROTOTYPE::ARGUMENTS')
                                    } else if (context.includes('PROTOTYPE::ARGUMENTS') && !context.includes('PROTOTYPE::NAME')) {
                                        switch (value) {

                                            case 'string': {
                                                built.unshift('String')
                                                break
                                            }

                                            case 'int': {
                                                built.unshift('Number')
                                                break
                                            }

                                            case 'array': {
                                                built.unshift('Array')
                                                break
                                            }

                                            default: {
                                                built.unshift(value)
                                                break
                                            }

                                        }
                                        context.push('PROTOTYPE::NAME')
                                    } else if (context.includes('PROTOTYPE::FUNCTION_ARGUMENTS')) {
                                        built.push(value + ',')
                                        variables[value] = ''
                                    } else {
                                        if (variables[value] === 'module') {
                                            built.push(value)
                                        } else {
                                            if (prototypes.includes(value)) {
                                                built.push(value)
                                            } else {
                                                built.push(`var ${value}`)
                                                variables[value] = ''
                                                context.push('VARIABLE::DECLARATION')
                                            }
                                        }
                                    }

                                } else if (context.includes('FUNCTION::START')) {
                                    if (!context.includes('FUNCTION::ARGUMENTS')) {
                                        if (mod_name) {
                                            built.push(mod_name + '.' + value + '= function')
                                        } else {
                                            built.push(value)
                                        }
                                        functions.push(value)
                                    } else {
                                        built.push(value)
                                        variables[value] = ''
                                        if (context.includes('FUNCTION::OPTIONAL')) {
                                            built.push(' = \'\',')
                                            context.splice(context.findIndex(x => x === 'FUNCTION::OPTIONAL'), 1)
                                        } else {
                                            built.push(',')
                                        }
                                    }

                                } else {
                                    built.push(value)
                                }
                                
                                if (context.includes('CONVERSION::INT')) {
                                    built.push(')')
                                    context.splice(context.findIndex(x => x === 'CONVERSION::INT'), 1)
                                } else if (context.includes('CONVERSION::STRING')) {
                                    built.push('.toString()')
                                    context.splice(context.findIndex(x => x === 'CONVERSION::STRING'), 1)
                                }

                                var_name = value
                                break
                            }

                            case 'PROTOTYPE': {
                                context.push('PROTOTYPE::START')
                                built.push('.prototype.')
                                break
                            }

                            case 'ARGUMENTS': {
                                if (context.includes('FUNCTION::START')) {
                                    context.push('FUNCTION::ARGUMENTS')
                                    built.push('(')
                                } else if (prototypes.includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].value)) {
                                    if (!context.includes('PROTOTYPE::ARGUMENTS')) {
                                        built.push('(')
                                        context.push('PROTOTYPE::CALL_ARGUMENTS')
                                    }
                                } else if (context.includes('PROTOTYPE::NAME')) {
                                    context.push('PROTOTYPE::FUNCTION_ARGUMENTS')
                                    built.push('(')
                                } else {
                                    if (prototypes.includes(tokens.slice(parseInt(item_token) + 1).filter(x => x.token !== 'SPACE')[0].value)) {
                                        built.push('.')
                                    } else {
                                        context.push('FUNCTION::CALL_ARGUMENTS')
                                        built.push('(')
                                    }
                                    
                                }
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
                                        
                                        if (var_name && variables[var_name]) {
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
                                            switch (tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].token.toLowerCase()) {
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
                                        }

                                    } else {
                                        built.push(value)
                                    }
                                }
                                break
                            }

                            case 'PROPERTY': {
                                if (Number.isNaN(value.slice(1))) {
                                    built.push('.' + value.slice(1))
                                } else {
                                    built.push('[' + value.slice(1) + ']')
                                }
                                break
                            }

                            case 'CALL': {
                                context.push('FUNCTION::CALL')
                                var_name = value.split('->')[0]
                                built.push(value.replace('->', '.'))
                                break
                            }

                            case 'L_PAREN': case 'R_PAREN': {
                                if (context.slice(-1)[0] === 'FUNCTION::CALL' || context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                    built.push(value)
                                    context.push('FUNCTION::CALL_ARGUMENTS')
                                } else {
                                    if (value === '(') {
                                        built.push('[')
                                        context.push('ARRAY::START')
                                        if (array_cnt > 0) {
                                            variables[var_name + (array_cnt > 1 ? '[' + (array_cnt - 1) + ']' : '') + '[' + (item_cnt) + ']'] = 'array'
                                        }
                                        item_cnt = 0
                                        array_cnt += 1
                                    }
                                    else if (value === ')') {
                                        built.push(']')
                                        context.push('ARRAY::END')
                                        array_cnt -= 1
                                        item_cnt = 0
                                    }
                                    variables[var_name] = 'array'
                                }
                                break
                            }

                            case 'COMMA': {
                                built.push(value)
                                break
                            }

                            case 'CONVERSION': {
                                const type = [...value].reverse().slice(1).reverse().join('').trim()
                                switch (type) {

                                    case 'int': {
                                        built.push('parseInt(')
                                        context.push('CONVERSION::INT')
                                        break
                                    }

                                    case 'str': {
                                        context.push('CONVERSION::STRING')
                                        built.push('(')
                                        break
                                    }

                                }

                                break
                            }

                            case 'ADD': {
                                var_name = built.slice(built.indexOf(var_name)).join('')
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

                            case 'SPACE': {
                                if (context.includes('ARRAY::START')) {
                                    if (['STRING', 'INT'].includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].token)) {
                                        if (!functions.includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].value)) {
                                            built.push(', ')
                                        }
                                    } else {
                                        built.push(value)
                                    }
                                } else if (context.includes('PRINT::START')) {
                                    if (['STRING', 'INT', 'WORD', 'L_PAREN', 'R_PAREN'].includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].token)) {
                                        if (!functions.includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].value) &&
                                            !prototypes.includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].value) &&
                                            !prototypes.includes((tokens.slice(parseInt(item_token) + 1).filter(x => !['ARGUMENTS', 'SPACE'].includes(x.token))[0] ? tokens.slice(parseInt(item_token) + 1).filter(x => !['ARGUMENTS', 'SPACE'].includes(x.token))[0].value : ''))) {
                                            
                                                if (tokens.slice(parseInt(item_token) + 1).filter(x => x.token !== 'SPACE')[0] && tokens.slice(parseInt(item_token) + 1).filter(x => x.token !== 'SPACE')[0].token !== 'SIGNS') {
                                                    built.push(', ')
                                                }

                                        } else {
                                            built.push(' ')
                                        }
                                    } else {
                                        built.push(value)
                                    }
                                } else if (context.includes('RETURN::START')) {
                                    if (tokens.slice(parseInt(item_token) + 1).length > 0) {
                                        if (tokens.slice(0, parseInt(item_token)).filter(x => !['SPACE', 'TABS', 'RETURN'].includes(x.token)).length > 0) {
                                            built.push(' + " " + ')
                                        } else {
                                            built.push(' ')
                                        }
                                    } else {
                                        built.push(' ')
                                    }
                                } else {
                                    built.push(value)
                                }

                                break
                            }

                            case 'REMOVE': {
                                var_name = built.slice(built.indexOf(var_name)).join('')
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

                            case 'IF': {
                                if (context.includes('VARIABLE::DECLARATION')) {
                                    context.push('VARIABLE::CONDITION')
                                } else {
                                    context.push('CONDITION::START')
                                    built.push('if(')
                                }
                                break
                            }

                            case 'ELIF': {
                                built.push('else if(')
                                context.push('CONDITION::START')
                                break
                            }

                            case 'ELSE': {
                                if (context.includes('VARIABLE::DECLARATION')) {
                                    context.push('VARIABLE::CONDITION::ELSE')
                                    built.push(' : ')
                                } else {
                                    context.push('CONDITION::START')
                                    built.push('else:')
                                }
                                break
                            }

                            case 'TABS': {
                                if (parseInt(item_token) === 0) {
                                    built.push(value)
                                } else if (context.includes('ARRAY::START')) {
                                    if (['STRING', 'INT'].includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].token)) {
                                        built.push(', ')
                                    }
                                } else if (context.includes('PRINT::START')) {
                                    if (['STRING', 'INT', 'WORD', 'L_PAREN', 'R_PAREN'].includes(tokens.slice(0, parseInt(item_token)).filter(x => x.token !== 'SPACE').slice(-1)[0].token)) {
                                        built.push(', ')
                                    }
                                }
                                break
                            }

                            case 'ARGUMENT': {
                                if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                    built.push(', ')
                                }
                                break
                            }

                            case 'AND': case 'THEN': {
                                for (let i = 0; i < context.length; i++) {

                                    if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                                        built.push(')')
                                        context.splice(context.findIndex(x => x === 'FUNCTION::CALL_ARGUMENTS'), 1)
                                    }

                                    if (context.includes('PROTOTYPE::CALL_ARGUMENTS')) {
                                        built.push(')')
                                        context.splice(context.findIndex(x => x === 'PROTOTYPE::CALL_ARGUMENTS'), 1)
                                    }

                                    if (context.includes('STRING::REMOVE')) {
                                        built.push(', "") ')
                                        context.splice(context.findIndex(x => x === 'STRING::REMOVE'), 1)
                                    }
    
                                    if (context.includes('ARRAY::REMOVE')) {
                                        built.push(') ')
                                        context.splice(context.findIndex(x => x === 'ARRAY::REMOVE'), 1)
                                    }
    
                                    if (context.includes('ARRAY::PUSH')) {
                                        built.push(') ')
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
    
                                    if (context.includes('VARIABLE::USE')) {
                                        built.push('; ')
                                        context.splice(context.findIndex(x => x === 'VARIABLE::USE'), 1)
                                    }
    
                                    if (context.includes('ARRAY::END')) {
                                        built.push('; ')
                                        context.splice(context.findIndex(x => x === 'VARIABLE::USE'), 1)
                                    }

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
                                if (!mod_name) built.push('function ')
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

                            case 'RETURN': {
                                built.push('return')
                                context.push('RETURN::START')
                                break
                            }

                        }

                    }

                }

                for (let i = 0; i < context.length; i++) {
    
                    if (context.includes('FUNCTION::CALL_ARGUMENTS')) {
                        built.push(')')
                        context.splice(context.findIndex(x => x === 'FUNCTION::CALL_ARGUMENTS'), 1)
                    }

                    if (context.includes('PROTOTYPE::CALL_ARGUMENTS')) {
                        built.push(')')
                        context.splice(context.findIndex(x => x === 'PROTOTYPE::CALL_ARGUMENTS'), 1)
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
    
                    if (context.includes('MODULE::REQUIRE')) {
                        built.push(')')
                        context.splice(context.findIndex(x => x === 'MODULE::REQUIRE'), 1)
                    }
    
                    if (context.includes('ARRAY::END')) {
                        built.push('; ')
                        context.splice(context.findIndex(x => x === 'VARIABLE::USE'), 1)
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
                        context.splice(context.findIndex(x => x === 'FUNCTION::ARGUMENTS'), 1)
                    }

                    if (context.includes('PROTOTYPE::FUNCTION_ARGUMENTS')) {
                        built.push('):')
                        context.splice(context.findIndex(x => x === 'PROTOTYPE::FUNCTION_ARGUMENTS'), 1)
                    }
                    
                    if (context.includes('VARIABLE::CONDITION')) {
                        const variable_index = tokens.filter(x => !['SPACE', 'TABS'].includes(x.token)).findIndex(x => x.value === '=') + 1,
                              variable_value = tokens.filter(x => !['SPACE', 'TABS'].includes(x.token))[variable_index]

                        built = built.map(x => x === variable_value.value ? x = '%CONDITION%' : x)
                        const condition      = /%CONDITION%(.*?)(then|and|:.*)?$/.exec(built.join('').trim())[1]
                        if (context.includes('VARIABLE::CONDITION::ELSE')) {
                            built            = built.join('').replace(condition, '').replace('%CONDITION%', condition + ' ? ' + variable_value.value + ' ').split('')
                            context.splice(context.findIndex(x => x === 'VARIABLE::CONDITION::ELSE'), 1)
                        } else {
                            built            = built.join('').replace(condition, '').replace('%CONDITION%', condition + ' ? ' + variable_value.value + ' : undefined').split('')
                        }
                        context.splice(context.findIndex(x => x === 'VARIABLE::CONDITION'), 1)
                    }
                }

                if (mod_name) {
                    temp_code.push(built.join(''))
                } else {
                    code.push(built.join(''))
                }

                built   = []
                context = []

            }
            
        }

        code = temp_code.concat(code)
        
        if (mod_count === imported) {

            
            console.log(code)

            callback(Beautify(Terser.minify(Beautify(new Tabdown(code).tab().join('\n'))).code))

            content    = ''
            variables  = {}
            functions  = []
            folder     = ''
            code       = []
            mod_count  = 0
            imported   = 0
            prototypes = []
            
        }

    }

}