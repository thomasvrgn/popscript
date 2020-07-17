/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class Tabulation {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0,
                 built   : Array<string> = []) 
    {

        if (specs.current.tabsize === 0) { specs.current.tabsize = value.length }
        specs.current.tabs = value.length / specs.current.tabsize

        return value

    }

}