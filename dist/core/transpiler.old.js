// for (const index in this.content) {
//     if (this.content.hasOwnProperty(index)) {
//         let   line    : string        = this.content[index],
//               tokens  : Array<Token>  = Tokenizer.tokenize(line),
//               context : Array<string> = [],
//               built   : any           = []
//         for (const token_index in tokens) {
//             if (tokens.hasOwnProperty(token_index)) {
//                 const item  : Token  = tokens[token_index],
//                       value : string = item.value,
//                       token : string = item.token
//                 switch (token) {
//                     case 'WORD': {
//                         // Variable exist checking
//                         if (!this.specs.variables[value]) {
//                             this.specs.variables[value] = {
//                                 type  : ''
//                             }
//                         }
//                         // Word processing
//                         // Function name
//                         if (context.includes('FUNCTION::DECLARE')) {
//                             built.push(value + ' = function (')
//                             context.pop()
//                             context.push('FUNCTION::ARGUMENTS')
//                             this.specs.variables[value].type = 'function'
//                         } 
//                         // Function arguments
//                         else if (context.includes('FUNCTION::ARGUMENTS')) {
//                             built.push(value)
//                             if (tokens.slice(parseInt(token_index) + 1).filter(x => !['TABS', 'SPACE'].includes(x.token)).length > 0) {
//                                 built.push(', ')
//                             } else {
//                                 built.push('):')
//                                 context.pop()
//                             }
//                         } 
//                         // Looped variable
//                         else if (context.includes('LOOP::DECLARE')) {
//                             built.push(value)
//                             context.pop()
//                         } 
//                         // Looped array
//                         else if (context.includes('LOOP::ARRAY')) {
//                             built.push(value)
//                             context.pop()
//                             built.push('):')
//                         } 
//                         // Function call
//                         else if (this.specs.variables[value] && this.specs.variables[value].type === 'function') {
//                             built.push(value)
//                             const fn_args = tokens.slice(parseInt(token_index) + 3, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length)).filter(x => !['SPACE', 'TABS'].includes(x.token))
//                             context.pop()
//                             if (fn_args && fn_args.length > 0) {
//                                 built.push('(')
//                                 context.push('FUNCTION::CALL')
//                             } else {
//                                 built.push('()')
//                             }
//                         } 
//                         // Function call arguments
//                         else if (context.includes('FUNCTION::CALL')) {
//                             built.push(value)
//                             const fn_args = tokens.slice(parseInt(token_index) + 1, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length)).filter(x => !['SPACE', 'TABS'].includes(x.token)
//                             )
//                             if (fn_args && fn_args.length > 0) {
//                                 built.push(', ')
//                             } else {
//                                 built.push(')')
//                                 context.pop()
//                             }
//                         } 
//                         // Variable sue
//                         else {
//                             built.push(value)
//                         }
//                         break
//                     }
//                     case 'STRING': case 'INT': {
//                         if (context.includes('FUNCTION::CALL')) {
//                             built.push(value)
//                             const fn_args = tokens.slice(parseInt(token_index) + 1, (tokens.findIndex(x => x.token === 'AFTER') || tokens.length)).filter(x => !['SPACE', 'TABS'].includes(x.token)
//                             )
//                             if (fn_args && fn_args.length > 0) {
//                                 built.push(', ')
//                             } else {
//                                 built.push(')')
//                                 context.pop()
//                             }
//                         } else {
//                             built.push(value)
//                         }
//                         break
//                     }
//                     case 'SIGNS': {
//                         built.push(` ${value} `)
//                         break
//                     }
//                     case 'FUNCTION': {
//                         context.push('FUNCTION::DECLARE')
//                         break
//                     }
//                     case 'AFTER': {
//                         built.push(', ')
//                         break
//                     }
//                     case 'MULTIPLES': {
//                         built.push('...')
//                         break
//                     }
//                     case 'LOOP': {
//                         built.push('for (')
//                         context.push('LOOP::DECLARE')
//                         break
//                     }
//                     case 'IN': {
//                         built.push(' of ')
//                         context.push('LOOP::ARRAY')
//                         break
//                     }
//                     case 'NATIVE': {
//                         const native_content = value.match(/".*?"/g)[0]
//                         built.push(native_content.slice(1, native_content.length - 1))
//                         break
//                     }
//                     case 'TABS': {
//                         built.push(value)
//                         break
//                     }
//                 }
//             }
//         }
//         context = []
//         this.code.push(built.join(''))
//     }
// }
// this.code.unshift('var ' + Object.keys(this.specs.variables).join(', '))
// console.log(new Tabdown(this.code.map(x => x.replace(/'/g, '"'))).tab().join('\n'))
