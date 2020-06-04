/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Lexr
//////////////////////////////////*/

const tokens = require('./tokens/tokens'),   // Importing token object
      lexr   = require('lexr')               // Importing Lexer package

module.exports = class {

    constructor (content) {

        this.content = content

    }

    tokenize () {

        const lexer = new lexr.Tokenizer('') // Lexer initialization

        lexer.addTokenSet(tokens)            // Imported tokens adding to lexer

        return lexer.tokenize(this.content)  // Returning lexered contnet

    }

}