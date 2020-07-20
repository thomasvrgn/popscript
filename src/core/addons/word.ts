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
                 index   : number        = 0,
                 built   : Array<string> = []) 
    {
    
        if (context.filter(x => ['CONDITION::DECLARE'].includes(x)).length > 0) { ++specs.current.tabs }

        if (!specs.variables[value] || specs.variables[value] === undefined) {
            specs.variables[value] = {
                type: '',
                value: undefined,
                scope: specs.current.tabs,
                name: value
            }

            for (const variable in specs.variables) {
                if (specs.variables[variable] && specs.variables[variable].scope < specs.current.tabs) {
                    specs.variables[variable] = undefined
                }
            }

            if (context.length === 0) {
                built.push('var ' + value)
            }

        }

        if (context.includes('FUNCTION::ARGUMENTS')) {

            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS', 'CALL'].includes(x.token))

            specs.variables[specs.current.variable].arguments.push({
                name: value,
                mutable: false
            })
            
            console.log(JSON.stringify(specs.variables[specs.current.variable], null, 2))

            built.push(remaining.length > 0 ? value + ', ' : value + '):')

        } else if (context.includes('FUNCTION::DECLARE')) {
            context.push('FUNCTION::ARGUMENTS')

            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS', 'CALL'].includes(x.token))
            
            specs.current.variable = value

            if (!specs.variables[value] || specs.variables[value].type !== 'function') {
                specs.variables[value] = {
                    type: 'function',
                    value: undefined,
                    scope: specs.current.tabs,
                    name: value,
                    arguments: []
                }
            }

            built.push(remaining.length > 0 ? value + ' (' : value + ' ()')
        }

        return

    }

}