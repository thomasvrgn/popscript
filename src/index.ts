/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler'
import * as FS    from 'fs'
import * as PATH  from 'path'
import * as GLOB  from 'glob'
import * as NCC   from '@zeit/ncc'

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
                let counter = 0,
                    files   = content,
                    codes   = {}
                for (const file of content) {
                    FS.readFile(file, 'UTF-8', (error, content) => {
                        if (error) throw error
                        const code = new Transpiler(content.split(/\r?\n/g).join('\n')).transpile(file)
                        ++counter
                        codes[file] = code
                        FS.writeFile(file.replace('.ps', '.js'), code, error => {
                            if (error) throw error
                            if (counter === files.length) {
                                NCC(input.replace('.ps', '.js'), {
                                    externals: ["externalpackage"],
                                    filterAssetBase: process.cwd(),
                                    minify: true,
                                    watch: false,
                                    v8cache: false,
                                    quiet: true,
                                    debugLog: false
                                  }).then(({ code, map, assets }) => {
                                    FS.writeFile(PATH.join(foldername, filename.replace('.ps', '') + '_output.js'), code, error => {
                                        if (error) throw error
                                    })
                                  })
                            }
                        })
                    })
                }
            })
        } else if (stats.isDirectory()) {
            return new Error('Can\t compile folder!')
        }
    })
})