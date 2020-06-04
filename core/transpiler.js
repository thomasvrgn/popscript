/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

const lexer = require('./lexr')                            // Importing Lexer class

module.exports = class {

    constructor (content = '') {
        
        this.content = content.split(/\r?\n/g)
                              .filter(x => x !== '')       // Splitting content by new line

    }

    transpile () {

        const functions     = []

        for (const index in this.content) {
            const line      = this.content[index]        , // Defining line content with index variable
                  lexered   = new lexer(line).tokenize() , // Lexering class call with line content
                  built     = []                           // Variable will contain line content
            let   context   = undefined                  , // Line context. e.g.: function
                  condition = false                      , // Condition line status
                  variable  = false                      , // Variable line status    
                  type_ctx  = undefined                    // Variable type context
            for (const lexer_item in lexered) {
                
                const item  = lexered[lexer_item]        , // Defining lexered item by index
                      token = item.token                 , // Token item
                      value = item.value                   // Value item

                switch (token) {

                    case 'FUNCTION': {
                        context = token
                        built.push('function')
                        break
                    }

                    case 'ARGUMENTS': {
                        console.log(built)
                        break
                    }

                    case 'WORD': {
                        if (context === 'FUNCTION') {
                            functions.push(value)
                            built.push(value)
                        }
                        break
                    }

                }

            }
            console.log(built)

        }

    }

}