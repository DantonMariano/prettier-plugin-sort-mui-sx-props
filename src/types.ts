import type { Parser, ParserOptions } from "prettier";

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface ObjectExpression extends ASTNode {
  type: "ObjectExpression";
  properties: Property[];
}

export interface Property extends ASTNode {
  key: Key;
  value: ASTNode;
}

export interface Key extends ASTNode {
  type: "Identifier" | "StringLiteral" | "Literal";
  name?: string;
  value?: string | number;
}

export interface JSXAttribute extends ASTNode {
  type: "JSXAttribute";
  name: {
    name: string;
  };
  value: JSXExpressionContainer;
}

export interface JSXExpressionContainer extends ASTNode {
  type: "JSXExpressionContainer";
  expression: ASTNode;
}

export type { Parser, ParserOptions };
