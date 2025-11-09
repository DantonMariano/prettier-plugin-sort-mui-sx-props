import type { Node } from "@babel/types";
import type { Parser, ParserOptions } from "prettier";
import * as prettierPluginBabel from "prettier/plugins/babel";

import { sortSxProps } from "../ast/traverser.js";

/**
 * Custom parser that wraps Babel parser
 */
export function createParser(parserName: string): Parser {
  const babelParsers = prettierPluginBabel.parsers;
  const originalParser = babelParsers[
    parserName as keyof typeof babelParsers
  ] as Parser;

  return {
    ...originalParser,
    parse(text: string, options: ParserOptions): Node {
      const ast = originalParser.parse(text, options);
      return sortSxProps(ast as Node);
    },
  };
}
