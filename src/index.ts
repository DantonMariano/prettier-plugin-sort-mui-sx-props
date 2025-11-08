import { createParser } from "./parser/wrapper.js";

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
