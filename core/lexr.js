/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Lexr
//////////////////////////////////*/

const tokens = require('./tokens/tokens'),
      lexr   = require('lexr')

module.exports = class {

    constructor (content) {

        this.content = content

    }

    tokenize () {

        const lexer = new lexr.Tokenizer('')

        lexer.addTokenSet(tokens)

        return lexer.tokenize(this.content)

    }

}