import type { Parser, ParserOptions } from "prettier";
import * as prettierPluginBabel from "prettier/plugins/babel";

interface ASTNode {
  type: string;
  [key: string]: any;
}

interface ObjectExpression extends ASTNode {
  type: "ObjectExpression";
  properties: Property[];
}

interface Property extends ASTNode {
  key: Key;
  value: ASTNode;
}

interface Key extends ASTNode {
  type: "Identifier" | "StringLiteral" | "Literal";
  name?: string;
  value?: string | number;
}

interface JSXAttribute extends ASTNode {
  type: "JSXAttribute";
  name: {
    name: string;
  };
  value: JSXExpressionContainer;
}

interface JSXExpressionContainer extends ASTNode {
  type: "JSXExpressionContainer";
  expression: ASTNode;
}

/**
 * Sorts object properties alphabetically and recursively sorts nested objects
 * Preserves the position of spread elements, computed properties, and methods
 */
function sortObjectProperties(obj: ASTNode): ASTNode {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (obj.type === "ObjectExpression") {
    const objectExpr = obj as ObjectExpression;

    // Build segments: groups of properties separated by dynamic elements
    const segments: Array<Property | Property[]> = [];
    let currentRegularProps: Property[] = [];

    objectExpr.properties.forEach((property) => {
      // Check if this is a dynamic element (spread, computed, method)
      const isDynamic =
        property.type === "SpreadElement" ||
        property.type === "ObjectMethod" ||
        (property.key &&
          property.key.type !== "Identifier" &&
          property.key.type !== "StringLiteral" &&
          property.key.type !== "Literal");

      if (isDynamic) {
        // Before adding dynamic element, sort any accumulated regular properties
        if (currentRegularProps.length > 0) {
          const sorted = sortRegularProperties(currentRegularProps);
          segments.push(sorted);
          currentRegularProps = [];
        }
        // Add the dynamic element at its original position
        segments.push(property);
      } else {
        // Accumulate regular properties
        currentRegularProps.push(property);
      }
    });

    // Don't forget to sort remaining regular properties
    if (currentRegularProps.length > 0) {
      const sorted = sortRegularProperties(currentRegularProps);
      segments.push(sorted);
    }

    // Flatten segments back into a single properties array
    const sortedProperties = segments.flat();

    return {
      ...objectExpr,
      properties: sortedProperties,
    };
  }

  return obj;
}

/**
 * Sorts an array of regular properties alphabetically (case-insensitive)
 * and recursively sorts nested objects
 */
function sortRegularProperties(properties: Property[]): Property[] {
  return properties
    .sort((a, b) => {
      const keyA = getPropertyKey(a).toLowerCase();
      const keyB = getPropertyKey(b).toLowerCase();

      // If keys are equal after lowercasing, maintain original order (stable sort)
      if (keyA === keyB) {
        return 0;
      }

      return keyA.localeCompare(keyB);
    })
    .map((property) => {
      // Recursively sort nested object expressions
      if (property.value && property.value.type === "ObjectExpression") {
        return {
          ...property,
          value: sortObjectProperties(property.value),
        };
      }
      return property;
    });
}

/**
 * Extracts the key name from a property node
 */
function getPropertyKey(property: Property): string {
  if (!property.key) return "";

  if (property.key.type === "Identifier") {
    return property.key.name || "";
  }

  if (property.key.type === "StringLiteral") {
    return String(property.key.value || "");
  }

  if (property.key.type === "Literal") {
    return String(property.key.value || "");
  }

  return "";
}

/**
 * Recursively traverses AST and sorts sx prop objects
 */
function sortSxProps(ast: ASTNode): ASTNode {
  function traverse(node: ASTNode): void {
    if (!node || typeof node !== "object") {
      return;
    }

    // Check if this is a JSX attribute with name "sx"
    if (node.type === "JSXAttribute" && node.name && node.name.name === "sx") {
      const jsxAttr = node as JSXAttribute;

      // Handle JSXExpressionContainer
      if (jsxAttr.value && jsxAttr.value.type === "JSXExpressionContainer") {
        const expression = jsxAttr.value.expression;

        // Sort if it's an object expression
        if (expression.type === "ObjectExpression") {
          jsxAttr.value.expression = sortObjectProperties(expression);
        }
        // Handle conditional expressions: condition ? { a: 1 } : { b: 2 }
        else if (expression.type === "ConditionalExpression") {
          if (expression.consequent?.type === "ObjectExpression") {
            expression.consequent = sortObjectProperties(expression.consequent);
          }
          if (expression.alternate?.type === "ObjectExpression") {
            expression.alternate = sortObjectProperties(expression.alternate);
          }
        }
        // Handle logical expressions: condition && { a: 1 }
        else if (expression.type === "LogicalExpression") {
          if (expression.right?.type === "ObjectExpression") {
            expression.right = sortObjectProperties(expression.right);
          }
          if (expression.left?.type === "ObjectExpression") {
            expression.left = sortObjectProperties(expression.left);
          }
        }
        // Handle array expressions: [style1, { a: 1 }, style2]
        else if (expression.type === "ArrayExpression") {
          expression.elements = expression.elements?.map((element: ASTNode) => {
            if (element?.type === "ObjectExpression") {
              return sortObjectProperties(element);
            }
            return element;
          });
        }
      }
    }

    // Traverse all properties
    for (const key in node) {
      if (
        Object.prototype.hasOwnProperty.call(node, key) &&
        key !== "tokens" &&
        key !== "comments"
      ) {
        const child = node[key];

        if (Array.isArray(child)) {
          child.forEach(traverse);
        } else if (child && typeof child === "object") {
          traverse(child);
        }
      }
    }
  }

  traverse(ast);
  return ast;
}

/**
 * Custom parser that wraps Babel parser
 */
function createParser(parserName: string): Parser {
  const babelParsers = prettierPluginBabel.parsers;
  const originalParser = babelParsers[
    parserName as keyof typeof babelParsers
  ] as Parser;

  return {
    ...originalParser,
    parse(text: string, options: ParserOptions): ASTNode {
      const ast = originalParser.parse(text, options);
      return sortSxProps(ast as ASTNode);
    },
  };
}

/**
 * Languages supported by this plugin
 * Since we're wrapping existing Babel parsers, we don't add new languages
 * but enhance existing ones
 */
export const languages = [];

/**
 * Prettier plugin parsers
 */
export const parsers = {
  babel: createParser("babel"),
  "babel-flow": createParser("babel-flow"),
  "babel-ts": createParser("babel-ts"),
  typescript: createParser("babel-ts"),
};

/**
 * Default export for compatibility
 */
export default {
  languages,
  parsers,
};
