import Scanner from './scanner'

export class Tokenizer {

    tokens    : any
    customOut : Object
    ignore    : Object
    functions : Object

    constructor() {}

    public addTokenSet (tokenSet: Object) {

        for (const key in tokenSet) this.tokens[key] = tokenSet[key]

    }

    public tokenize (string: String) {

        return Scanner.tokenize(string, this)

    }

}

