/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class Int {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0) 
    {

        if (context.includes('FUNCTION::CALL')) {
            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                    .filter(x => !['SPACE', 'TABS'].includes(x.token))
            if (remaining.length > 0) {
                return value + ', '
            } else {
                context.pop()
                return value + ')'
            }
        } else if (context.includes('PROPERTY::CALL')) {
            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                    .filter(x => !['SPACE', 'TABS'].includes(x.token))
            if (remaining.length > 0) {
                return value + ', '
            } else {
                context.pop()
                return value + ')'
            }
        }  else {
            return value
        }

    }

}