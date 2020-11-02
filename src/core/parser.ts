/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/*//////////////////////////////////////
               Quark lang
                 Parser
//////////////////////////////////////*/

import Tokenizer from './tokenizer';
import { Token } from '../interfaces/token';
import Tokens from './tokens/tokens';
import { Node } from '../interfaces/node';
import Tabdown from './tabdown';
import { Types, Nodes, Closures } from '../interfaces/types';

export default class Parser {
  private code: string;

  private ast: Node = {
    type: Types.Program,
    raw: '',
    children: [],
  };

  private tokens: Token[] = [];

  constructor(code: string) {
    const split: string[] = code
      .split(/\r?\n/g)
      .filter((x) => x.length > 0);
    this.code = split.join('');
    console.log(new Tabdown(split).tab());
    Tokenizer.addTokenSet(Tokens);
    this.tokens = Tokenizer.tokenize(this.code);
  }

  public init(): Node {
    this.tokens = this.tokens.filter((x: Token) => x.token !== 'SPACE');
    return this.ast;
  }
}