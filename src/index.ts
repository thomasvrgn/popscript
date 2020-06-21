/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler'
import * as FS    from 'fs'
import * as PATH  from 'path'
import * as GLOB  from 'glob'

const input = PATH.resolve('example/index.ps')

FS.exists(input, bool => {
    if (!bool) return
    FS.stat(input, (error, stats) => {
        if (error) throw error
        if (stats.isFile()) {
            const filename   = PATH.basename(input),
                  foldername = PATH.dirname(input)
            GLOB(PATH.join(foldername, '**', '*.ps'), (error, content) => {
                if (error) throw error
                for (const file of content) {
                    FS.readFile(file, 'UTF-8', (error, content) => {
                        if (error) throw error
                        const code = new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(file)
                        FS.writeFile(file.replace('.ps', '.js'), code, error => {
                            if (error) throw error
                        })
                    })
                }
            })
        } else if (stats.isDirectory()) {
            return new Error('Can\t compile folder!')
        }
    })
})