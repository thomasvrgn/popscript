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

        if (context.includes('CONDITION::DECLARE')) {
            if (tokens.slice(index + 1).filter(x => !['SPACE', 'TABS'].includes(x.token)).length === 0) {
                context = context.filter(x => x !== 'CONDITION::DECLARE')
                return value + '):'
            }
        }

        if (context.includes('FUNCTION::CALL')) {
            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))
            if (remaining.length > 0) {
                return '{value:' + value + '}, '
            } else {
                context.pop()
                return '{value:' + value + '})'
            }
        } else if (context.includes('PROPERTY::CALL')) {
            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))

            if (remaining.length > 0) {
                return '{value:' + value + '}, '
            } else {
                context.pop()
                return '{value:' + value + '})'
            }
        } else {
            return value
        }

    }

}