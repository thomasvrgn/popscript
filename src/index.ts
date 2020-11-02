/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Tokens from './core/tokens/tokens'
import { promises as fs } from 'fs'
import * as PATH from 'path'
import Parser from './core/parser';

async function main() {
  const file: string = await fs.readFile('./example/core.ps', 'utf8');
  const parser: Parser = new Parser(file);
}
main();