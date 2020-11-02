import { Node } from '../interfaces/node';
import { Types } from '../interfaces/types';

export interface TabdownParameters {
  tabsize: number | null,
}

export default class Tabdown {
  private readonly ast: Node = {
    type: Types.Program,
    raw: '',
    children: [],
  };
  private readonly parameters: TabdownParameters = {
    tabsize: 1,
  };
  private readonly code: string[];

  constructor(code: string[]) {
    this.code = code;
  }

  private getTabSize(line: string): number | null {
    const preMatch: RegExpMatchArray = line.match(/^\s+/g);
    return preMatch ? preMatch[0].length : null;
  }

  private goToParent(ast: Node, it: number): Node {
    if (it === 0) return ast;
    return this.goToParent(ast.parent, it - 1);
  }
  
  public tab(): typeof Parser | null | Node {
    const Parser = (code: string[], index: number, ast: Node): typeof Parser | null | Node => {
      const line: string = code[index];
      if (!line) return ast;
      const tabSize: number | null = this.getTabSize(line);
      if (tabSize && this.parameters.tabsize === 0) this.parameters.tabsize = tabSize;
      const amountTabs: number = tabSize / this.parameters.tabsize;
      if (!Number.isInteger(amountTabs)) return ast;
      if (!ast.parent) {
        ast.children.push({
          type: Types.Node,
          raw: line,
          params: {
            tabs: amountTabs,
          },
          children: [],
          parent: ast,
        });
        return Parser(code, index + 1, ast.children.slice(-1)[0]);
      } else if (amountTabs > ast.params.tabs) {
        ast.children.push({
          type: Types.Node,
          raw: line,
          params: {
            tabs: amountTabs,
          },
          children: [],
          parent: ast,
        });
        return Parser(code, index + 1, ast.children.slice(-1)[0]);
      } else if (amountTabs < ast.params.tabs) {
        return Parser(code, index, this.goToParent(ast, Math.abs(ast.params.tabs - amountTabs) + 2));
      } else if (amountTabs === ast.params.tabs) {
        ast.parent.children.push({
          type: Types.Node,
          raw: line,
          params: {
            tabs: amountTabs,
          },
          children: [],
          parent: ast,
        });
        return Parser(code, index + 1, ast.parent.children.slice(-1)[0]);
      }
      return Parser(code, index + 1, ast);
    }
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };
    const parser: typeof Parser = Parser(this.code, 0, this.ast);
    console.log(JSON.stringify(parser, getCircularReplacer(), 2))
    return Parser(this.code, 0, this.ast);
  }

}
