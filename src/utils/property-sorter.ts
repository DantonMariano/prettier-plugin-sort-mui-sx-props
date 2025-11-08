import type { Property } from "../types.js";
import { sortObjectProperties } from "./object-sorter.js";
import { getPropertyKey } from "./property-key.js";

/**
 * Sorts an array of regular properties alphabetically (case-insensitive)
 * and recursively sorts nested objects
 */
export function sortRegularProperties(properties: Property[]): Property[] {
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
