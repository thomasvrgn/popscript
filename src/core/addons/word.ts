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

        for (const variable in specs.variables) {
            if (specs.variables[variable] && specs.variables[variable].scope >= specs.current.tabs) {
                specs.variables[variable] = undefined
            }
        }

        if (!specs.variables[value] || specs.variables[value] === undefined) {
            specs.variables[value] = {
                type: '',
                value: undefined,
                scope: specs.current.tabs,
                name: value
            }
            
            return 'var ' + value
        } else {
            if (specs.current.tabs >= specs.variables[value].scope) {
                
            } else {
                console.log('ERROR: Variable', value, 'does not exists!')
            }
        }

        return value

    }

}