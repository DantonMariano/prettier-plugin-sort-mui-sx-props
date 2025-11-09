import type { ObjectProperty } from "@babel/types";

import { sortObjectProperties } from "./object-sorter.js";
import { getPropertyKey } from "./property-key.js";

// MUI breakpoint order
const MUI_BREAKPOINT_ORDER = ["xs", "sm", "md", "lg", "xl"];

/**
 * Checks if all properties are MUI breakpoints
 */
function areAllMuiBreakpoints(properties: ObjectProperty[]): boolean {
  return properties.every((prop) => {
    const key = getPropertyKey(prop);
    return MUI_BREAKPOINT_ORDER.includes(key);
  });
}

/**
 * Sorts properties by MUI breakpoint order (xs, sm, md, lg, xl)
 */
function sortByBreakpointOrder(properties: ObjectProperty[]): ObjectProperty[] {
  return properties.sort((a, b) => {
    const keyA = getPropertyKey(a);
    const keyB = getPropertyKey(b);

    const indexA = MUI_BREAKPOINT_ORDER.indexOf(keyA);
    const indexB = MUI_BREAKPOINT_ORDER.indexOf(keyB);

    return indexA - indexB;
  });
}

/**
 * Sorts an array of regular properties alphabetically (case-insensitive)
 * and recursively sorts nested objects
 */
export function sortRegularProperties(
  properties: ObjectProperty[],
): ObjectProperty[] {
  // Special case: if all properties are MUI breakpoints, sort by breakpoint order
  const shouldSortByBreakpoint = areAllMuiBreakpoints(properties);

  const sorted = shouldSortByBreakpoint
    ? sortByBreakpointOrder(properties)
    : properties.sort((a, b) => {
        const keyA = getPropertyKey(a).toLowerCase();
        const keyB = getPropertyKey(b).toLowerCase();

        // If keys are equal after lowercasing, maintain original order (stable sort)
        if (keyA === keyB) {
          return 0;
        }

        return keyA.localeCompare(keyB);
      });

  return sorted.map((property) => {
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
