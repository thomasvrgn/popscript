/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

const lexer = require('./core/lexr'),
      fs    = require('fs')

fs.readFile('tests/even.ps', 'UTF-8', (error, content) => {
    if (error) throw error
       
    content = content.split(/\r?\n/).filter(x => x !== '')

    for (const index in content) {
        const line = content[index]
        console.log(new lexer(line).tokenize())
    }

})
