/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class String {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0) 
    {

        if (specs.variables[value.slice(1, value.length)] && specs.variables[value.slice(1, value.length)].type === 'function') {
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
        } else if (context.includes('PROPERTY::CALL')) {
            const remaining = tokens.slice(index, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
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