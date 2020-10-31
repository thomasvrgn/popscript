import { Token } from '../interfaces/token';
import { Value } from '../interfaces/value';

export function formatOutput(currentToken: string, tokenValue: string, tokenizer: any): Token {
  const output: Token = {
    token: currentToken,
    value: tokenValue,
  };
  if (currentToken in tokenizer.customOut) output.customOut = tokenizer.customOut[currentToken];
  return output;
}

export function updateValues(tempArray: any, values: Value, key: string): Value {
  const tmpValues: Value = values;
  const arrayFirstElement: string = tempArray[0];
  if (tempArray !== null
      && (tempArray.index < values.startToken || (tempArray.index === values.startToken
      && tempArray[0].length > values.endToken))) {
    tmpValues.startToken = tempArray.index;
    tmpValues.tokenValue = arrayFirstElement;
    tmpValues.endToken = arrayFirstElement.length;
    tmpValues.currToken = key;
  }
  return values;
}

export function getNearestToken(tokens: object, string: string): Value {
  let values: Value = {
    endToken: 0,
    startToken: Number.MAX_SAFE_INTEGER,
    tokenValue: '',
    currToken: '',
  };

  Object.entries(tokens).map((x) => {
    const tempArray: Array<string> = string.match(tokens[x[0]]);
    if (tempArray) values = updateValues(tempArray, values, x[0]);
    return true;
  });

  return values;
}

export default function scanner(string: string, tokenizer): Array<Token> {
  const { tokens } = tokenizer;
  const token = [];
  let tmpString: string = string;

  while (tmpString) {
    let {
      endToken,
      tokenValue,
      // eslint-disable-next-line prefer-const
      startToken,
      currToken,
    }: Value = getNearestToken(tokens, tmpString);
    if (startToken !== 0) {
      tokenValue = string.substring(0, startToken);
      currToken = tokenizer.errTok;
      endToken = startToken;
    }

    if (!tokenizer.ignore[currToken]) token.push(formatOutput(currToken, tokenValue, tokenizer));
    if (currToken in tokenizer.functions) tokenizer.functions[currToken]();

    tmpString = tmpString.substring(endToken);
  }

  return token;
}