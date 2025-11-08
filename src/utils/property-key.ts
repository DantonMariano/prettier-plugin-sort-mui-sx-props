import type { Property } from "../types.js";

/**
 * Extracts the key name from a property node
 */
export function getPropertyKey(property: Property): string {
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
