import type { ASTNode, ObjectExpression, Property } from "../types.js";
import { sortRegularProperties } from "./property-sorter.js";

/**
 * Sorts object properties alphabetically and recursively sorts nested objects
 * Preserves the position of spread elements, computed properties, and methods
 */
export function sortObjectProperties(obj: ASTNode): ASTNode {
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
