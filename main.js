/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

const transpiler = require('./core/transpiler'),
      fs         = require('fs')

fs.readFile('tests/even.ps', 'UTF-8', (error, content) => {
    if (error) throw error
       
    new transpiler(content).transpile()

})
