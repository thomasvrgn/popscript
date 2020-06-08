/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Parser
//////////////////////////////////*/

import { scanner } from './scanner'

export class Tokenizer {

    public static tokens    : Object = {}
    public static customOut : Object = {}
    public static ignore    : Object = {}
    public static functions : Object = {}

    constructor() {}

    public static addTokenSet (tokenSet: any) {
        
        for (const key in tokenSet) {
            this.tokens[key] = tokenSet[key]
        }

    }

    public static tokenize (string: string) {

        return scanner(string, this)

    }

}

