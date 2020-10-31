// eslint-disable-next-line import/prefer-default-export
export enum Types {
  Program = 'Program',
  Any = 'Any',
  Keyword = 'Keyword',
  FunctionCall = 'FunctionCall',
  FunctionDeclaration = 'FunctionDeclaration',
  String = 'String',
  VariableDeclaration = 'VariableDeclaration',
  Declaration = 'Declaration',
  Number = 'Number',
  Return = 'Return',
  Array = 'Array',
}

export const Nodes = [Types.FunctionDeclaration];

export const Closures = ['CURV_CL'];