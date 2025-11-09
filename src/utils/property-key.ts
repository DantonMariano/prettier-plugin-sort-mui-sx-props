import type { ObjectProperty } from "@babel/types";

/**
 * Extracts the key name from a property node
 */
export function getPropertyKey(property: ObjectProperty): string {
  if (!property.key) return "";

  if (property.key.type === "Identifier") {
    return property.key.name || "";
  }

  if (property.key.type === "StringLiteral") {
    return String(property.key.value || "");
  }

  if (property.key.type === "NumericLiteral") {
    return String(property.key.value || "");
  }

  return "";
}
