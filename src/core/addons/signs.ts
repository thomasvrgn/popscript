/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class Signs {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0) 
    {

        if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value] = {
                type: 'aliase'
            }
            return
        } else {
            if (specs.variables[value] && specs.variables[value].type === 'aliase') {
                context.push('FUNCTION::CALL')
                const remaining = tokens.slice(index, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                        .filter(x => !['SPACE', 'TABS'].includes(x.token))
                return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()'
            } else {
                return value
            }
        }

        return value

    }

}