import { Types } from './types';

export interface Node {
  type: Types,
  raw: string,
  children: Node[],
  parent?: Node,
  params?: any,
}