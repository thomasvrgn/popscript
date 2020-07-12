/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class Word {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0) 
    {

        if (!specs.variables[value]) {
            specs.variables[value] = {
                type: ''
            }
        }

        specs.current.variable = value

        if (context.includes('FUNCTION::DECLARE')) {
            context.pop()
            context.push('FUNCTION::ARGUMENTS')
            specs.variables[value].type = 'function'

            return value + ' = function ('
        } else if (context.includes('FUNCTION::ARGUMENTS')) {
            const remaining = tokens.slice(index + 1).filter(x => !['SPACE', 'TABS'].includes(x.token))

            if (remaining.length > 0) {
                return value + ', '
            } else {
                return value + '):'
            }
        } else if (context.includes('LOOP::ARRAY')) {
            return value + '):'
        } else if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value].type = 'aliase'
        } else if (context.includes('ALIASE::FUNCTION')) {
            context.pop()
            specs.variables[Object.keys(specs.variables).slice(-1)[0]]['aliase'] = value
        } else if (specs.variables[value] && specs.variables[value].type === 'aliase') {
            context.push('FUNCTION::CALL')
            const remaining = tokens.slice(index + 3, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                    .filter(x => !['SPACE', 'TABS'].includes(x.token))
            return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()'
        } else if (specs.variables[value] && specs.variables[value].type === 'function') {
            context.push('FUNCTION::CALL')
            const remaining = tokens.slice(index + 3, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                    .filter(x => !['SPACE', 'TABS'].includes(x.token))
            return remaining.length > 0 ? value + '(' : value + '()'
        } else if (context.includes('FUNCTION::CALL')) {
            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                    .filter(x => !['SPACE', 'TABS'].includes(x.token))
            if (remaining.length > 0) {
                return value + ', '
            } else {
                context.pop()
                return value + ')'
            }
        } else {
            return value
        }

    }

}