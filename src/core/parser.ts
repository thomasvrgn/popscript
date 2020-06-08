import { scanner } from './scanner'

export class Tokenizer {

    tokens    : any
    customOut : Object
    ignore    : Object
    functions : Object

    constructor() {}

    public addTokenSet (tokenSet: Object) {

        for (const key in tokenSet) this.tokens[key] = tokenSet[key]

    }

    public tokenize (string: string) {

        return scanner(string, this)

    }

}

