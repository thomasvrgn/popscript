/*//////////////////////////////////
         POPSCRIPT LANGUAGE
             Transpiler
//////////////////////////////////*/

const lexer = require('./lexr')                             // Importing Lexer class

module.exports = class {

    constructor (content = '') {
        
        this.content = content.split(/\r?\n/g)
                              .filter(x => x !== '')        // Splitting content by new line

    }

    transpile () {

        const functions     = []
        const func_args     = {}
        let   func          = undefined
        for (const index in this.content) {
            const line      = this.content[index]        ,  // Defining line content with index variable
                  lexered   = new lexer(line).tokenize() ,  // Lexering class call with line content
                  built     = []                            // Variable will contain line content
            let   context   = undefined                  ,  // Line context. e.g.: function
                  condition = false                      ,  // Condition line status
                  variable  = false                      ,  // Variable line status    
                  type_ctx  = undefined                     // Variable type context
            for (const lexer_item in lexered) {
                const item  = lexered[lexer_item]        ,  // Defining lexered item by index
                      token = item.token                 ,  // Token item
                      value = item.value                    // Value item

                switch (token) {

                    case 'FUNCTION': {                      // Refer to function keyword (fn)
                        context = token                     // Setting context to function
                        built.push('function')
                        break
                    }

                    case 'ARGUMENTS': {                     // Refer to function arguments (=>)
                        context = token                     // Setting context to arguments
                        built.push('(')
                        break
                    }

                    case 'WORD': {                          // Refer to words
                        if (context === 'FUNCTION') {
                            functions.push(value)           // Pushing function name to function list
                            built.push(value)
                            func_args[value] = []
                            func = value
                        } else if (context === 'ARGUMENTS') {
                            built.push(value)               // Pushing function argument to built line
                            if (func_args[func]) {
                                func_args[func].push(value) // Pushing function argument to function array
                                if (lexered.slice(parseInt(lexer_item) + 1).filter(x => x.token !== 'SPACE').length === 0) {
                                    built.push(')')         // Close arguments if end
                                    if (built.includes('function')) {
                                        built.push(':')     // Add colon if it's function context
                                    }
                                }
                            }
                        } else {
                            if (functions.includes(value)) {
                                built.push(value)           // Pushing function call to built line
                            } else if (func_args[func].length > 0) {
                                if (func_args[func].includes(value)) {
                                    built.push(value)       // Pushing function argument to built line
                                } else {
                                    console.log(value)
                                }
                            } else if (condition) {
                                built.push(value)
                                if (lexered.slice(parseInt(lexer_item) + 1).filter(x => x.token !== 'SPACE' && x.token !== 'COMMENT').length === 0) {
                                    built.push('):')
                                }
                            } else {
                                console.log(`[ERROR] At line ${index}: Variable "${value}" has not been declared!`)
                                console.log(lexered.map(x => Object.values(x)[1]).join(''))
                                console.log(lexered.map(x => Object.values(x)[1]).map((x, index) => index == lexer_item ? x = new Array(x.length).fill('^')
                                                         .join('') : new Array(x.length).fill(' ')
                                                                                        .join(''))
                                                                                        .join(''))
                            }
                        }
                        break
                    }

                    case 'SPACE': {                         // Refer to spaces
                        if (context === 'ARGUMENTS') {
                            if (lexered[parseInt(lexer_item) + 1].token === 'WORD' && 
                                lexered[parseInt(lexer_item) - 1].token === 'WORD') {
                                built.push(', ')
                            } else if (lexered[parseInt(lexer_item) + 1].token === 'SIGNS') {
                                func_args[func] = []
                                built.push(')')
                                context = undefined
                            }
                        } else if (context === 'FUNCTION') {
                            built.push(' ')
                        } else {
                            built.push(' ')
                        }
                        break
                    }

                    case 'TABS': {

                        if (parseInt(lexer_item) === 0) {   // Check if line starting with tabs
                            built.push(value)
                        } else {                            // If line not starting with, tabs are simply duplicated 
                            if (context === 'ARGUMENTS') {
                                if (lexered[parseInt(lexer_item) + 1].token === 'WORD' && 
                                    lexered[parseInt(lexer_item) - 1].token === 'WORD') {
                                    built.push(', ')
                                } else if (lexered[parseInt(lexer_item) + 1].token === 'SIGNS') {
                                    func_args[func] = []
                                    built.push(')')
                                    context = undefined
                                }
                            } else if (context === 'FUNCTION') {
                                built.push(' ')
                            } else {
                                built.push(' ')
                            }
                        }
                        break

                    }

                    case 'STRING': case 'INT': case 'BOOLEAN': {
                        built.push(value)
                        if (condition) {
                            if (lexered.slice(parseInt(lexer_item) + 1).filter(x => x.token !== 'SPACE' && 
                                                                                    x.token !== 'COMMENT').length === 0) {
                                built.push('):')
                            }
                        } 
                        break
                    }

                    case 'COMMENT': {
                        built.push(value.replace('--', '//'))
                        break
                    }

                    case 'SIGNS': case 'AND': case 'NOT': {  // Refer to signs, not and and keywords
                        if (context === 'ARGUMENTS') {
                            func_args[func] = []
                            built.push(')')
                            context = undefined
                        }
                        built.push(value)
                        break
                    }

                    case 'IF': {
                        built.push('if (')
                        condition = true
                        break
                    }

                    case 'ELSE': {
                        built.push('else:')
                        break
                    }

                    case 'ELIF': {
                        built.push('else if (')
                        condition = true
                        break
                    }

                }

            }
            console.log(built.join(''))

        }

    }

}