import scanner from './scanner';

export default class Tokenizer {
  public static tokens: Object = {};

  public static customOut: Object = {};

  public static ignore: Object = {};

  public static functions: Object = {};

  public static addTokenSet(tokenSet: Object) {
    return Object.entries(tokenSet).map((x: Array<string>) => {
      const property: string = x[0];
      const value: string = x[1];
      this.tokens[property] = value;
      return true;
    });
  }

  public static tokenize(string: string) {
    return scanner(string, this);
  }
}