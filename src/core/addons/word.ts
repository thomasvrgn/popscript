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
        } else {
            return value
        }

        return

    }

}