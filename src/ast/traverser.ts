import type { ASTNode, JSXAttribute } from "../types.js";
import { sortObjectProperties } from "../utils/object-sorter.js";

/**
 * Recursively traverses AST and sorts sx prop objects
 */
export function sortSxProps(ast: ASTNode): ASTNode {
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
