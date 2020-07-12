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
                 index   : number        = 0,
                 built   : Array<string> = []) 
    {

        if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value] = {
                type: 'aliase'
            }
            return
        } else {
            if (specs.variables[value] && specs.variables[value].type === 'aliase') {
                if (specs.variables[specs.variables[value].aliase].type === 'prototype') {
                    context.push('PROPERTY::CALL')
                    const built_copy = built[built.length - 1]
                    built[built.length - 1] = specs.variables[value].aliase + '('
                    built.push(built_copy)
                    const remaining = tokens.slice(index + 2, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                            .filter(x => !['SPACE', 'TABS'].includes(x.token))
                    return remaining.length > 0 ? ', ' :  + ')'
                } else {
                    context.push('FUNCTION::CALL')
                    const remaining = tokens.slice(index, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length))
                                        .filter(x => !['SPACE', 'TABS'].includes(x.token))
                    return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()'
                }
                
            } else {
                if (context.includes('CONDITION::DECLARE')) {
                    if (value === '=') {
                        return '=='
                    } else {
                        return value
                    }
                } else {
                    return value
                }
            }
        }

    }

}