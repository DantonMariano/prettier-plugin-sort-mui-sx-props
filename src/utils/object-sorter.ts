import type {
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  SpreadElement,
} from "@babel/types";

import { sortRegularProperties } from "./property-sorter.js";

type Property = ObjectMethod | ObjectProperty | SpreadElement;
type Segment = Property | ObjectProperty[];

/**
 * Type guard to check if a property is a regular (sortable) property
 */
function isRegularProperty(property: Property): property is ObjectProperty {
  if (property.type !== "ObjectProperty") {
    return false;
  }

  // Check if it's computed or has a dynamic key
  if (property.computed) {
    return false;
  }

  const keyType = property.key.type;
  return (
    keyType === "Identifier" ||
    keyType === "StringLiteral" ||
    keyType === "NumericLiteral"
  );
}

/**
 * Sorts object properties alphabetically and recursively sorts nested objects
 * Preserves the position of spread elements, computed properties, and methods
 */
export function sortObjectProperties(obj: ObjectExpression): ObjectExpression {
  const segments: Segment[] = [];
  let currentRegularProps: ObjectProperty[] = [];

  obj.properties.forEach((property) => {
    if (isRegularProperty(property)) {
      // Accumulate regular properties
      currentRegularProps.push(property);
    } else {
      // Before adding dynamic element, sort any accumulated regular properties
      if (currentRegularProps.length > 0) {
        segments.push(sortRegularProperties(currentRegularProps));
        currentRegularProps = [];
      }
      // Add the dynamic element at its original position
      segments.push(property);
    }
  });

  // Don't forget to sort remaining regular properties
  if (currentRegularProps.length > 0) {
    segments.push(sortRegularProperties(currentRegularProps));
  }

  // Flatten segments back into a single properties array
  const sortedProperties = segments.flatMap((segment) =>
    Array.isArray(segment) ? segment : [segment],
  );

  return {
    ...obj,
    properties: sortedProperties,
  };
}
