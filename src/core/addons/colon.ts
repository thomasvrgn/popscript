/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'
import { builtinModules } from 'module'

export default class Colon {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0) 
    {

        if (context.includes('ALIASE::DECLARE')) {
            context.pop()
            context.push('ALIASE::FUNCTION')
            return
        }

        return

    }

}