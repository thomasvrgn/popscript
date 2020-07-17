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
        
        if (!specs.variables[value]) {
            specs.variables[value] = {
                type: '',
                value: undefined,
                scope: specs.current.tabs,
                name: value
            }
        } else {
            if (specs.current.tabs >= specs.variables[value]) {

            } else {
                console.log('ERROR: Variable', value, 'does not exists!')
            }
        }

        return value

    }

}