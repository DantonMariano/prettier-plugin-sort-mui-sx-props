import prettier from "prettier";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Format code using Prettier with our plugin
 */
export async function formatWithPlugin(code: string): Promise<string> {
  const formatted = await prettier.format(code, {
    parser: "babel-ts",
    plugins: [path.resolve(__dirname, "../dist/index.js")],
    printWidth: 80,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
  });

  return formatted;
}
