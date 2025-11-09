import type { Node } from "@babel/types";

import { sortObjectProperties } from "../utils/object-sorter.js";

/**
 * Type guard to check if a value is a Babel Node
 */
function isNode(value: unknown): value is Node {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}

/**
 * Recursively traverses AST and sorts sx prop objects
 */
export function sortSxProps(ast: Node): Node {
  function traverse(node: Node): void {
    if (!node || typeof node !== "object") {
      return;
    }

    // Check if this is a JSX attribute with name "sx"
    if (
      node.type === "JSXAttribute" &&
      "name" in node &&
      typeof node.name === "object" &&
      node.name &&
      "name" in node.name &&
      node.name.name === "sx"
    ) {
      const jsxAttr = node;

      // Handle JSXExpressionContainer
      if (
        jsxAttr.value &&
        jsxAttr.value.type === "JSXExpressionContainer" &&
        "expression" in jsxAttr.value
      ) {
        const expression = jsxAttr.value.expression;

        // Sort if it's an object expression
        if (expression.type === "ObjectExpression") {
          jsxAttr.value.expression = sortObjectProperties(expression);
        }
        // Handle conditional expressions: condition ? { a: 1 } : { b: 2 }
        else if (expression.type === "ConditionalExpression") {
          const condExpr = expression;
          if (condExpr.consequent.type === "ObjectExpression") {
            condExpr.consequent = sortObjectProperties(condExpr.consequent);
          }
          if (condExpr.alternate.type === "ObjectExpression") {
            condExpr.alternate = sortObjectProperties(condExpr.alternate);
          }
        }
        // Handle logical expressions: condition && { a: 1 }
        else if (expression.type === "LogicalExpression") {
          const logExpr = expression;
          if (logExpr.right.type === "ObjectExpression") {
            logExpr.right = sortObjectProperties(logExpr.right);
          }
          if (logExpr.left.type === "ObjectExpression") {
            logExpr.left = sortObjectProperties(logExpr.left);
          }
        }
        // Handle array expressions: [style1, { a: 1 }, style2]
        else if (expression.type === "ArrayExpression") {
          const arrExpr = expression;
          arrExpr.elements = arrExpr.elements.map((element) => {
            if (element && element.type === "ObjectExpression") {
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
        const child = (node as unknown as Record<string, unknown>)[key];

        if (Array.isArray(child)) {
          child.forEach((item) => {
            if (isNode(item)) {
              traverse(item);
            }
          });
        } else if (isNode(child)) {
          traverse(child);
        }
      }
    }
  }

  traverse(ast);
  return ast;
}
