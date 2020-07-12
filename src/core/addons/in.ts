/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class In {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0) 
    {

        if (context.includes('LOOP::DECLARE')) {
            context.pop()
            context.push('LOOP::ARRAY')
            return ' of '
        }

    }

}