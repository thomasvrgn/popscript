/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class Mutable {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0,
                 built   : Array<string> = []) 
    {
        
        context.push('MUTABLE::DECLARE')

        return

    }

}