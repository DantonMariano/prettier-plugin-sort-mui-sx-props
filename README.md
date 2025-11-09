# Prettier Plugin - Sort MUI SX Props

[![CI](https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/actions/workflows/ci.yml/badge.svg)](https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/prettier-plugin-sort-mui-sx-props.svg)](https://badge.fury.io/js/prettier-plugin-sort-mui-sx-props)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Prettier plugin that automatically sorts Material-UI (MUI) `sx` prop properties alphabetically.

## What it does

This plugin automatically organizes the properties inside MUI's `sx` prop in alphabetical order when you format your code with Prettier. It also recursively sorts nested objects like pseudo-selectors and orders breakpoint properties (xs, sm, md, lg, xl) correctly.

**Before:**

```tsx
<Box
  sx={{
    display: "flex",
    padding: 2,
    backgroundColor: "primary.main",
    marginTop: { md: 2, xs: 1 },
  }}
>
  Content
</Box>
```

**After:**

```tsx
<Box
  sx={{
    backgroundColor: "primary.main",
    display: "flex",
    marginTop: { xs: 1, md: 2 },
    padding: 2,
  }}
>
  Content
</Box>
```

## Installation

```bash
npm install prettier-plugin-sort-mui-sx-props --save-dev
```

## Configuration

Add the plugin to your `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-sort-mui-sx-props"]
}
```

## Usage

The plugin works automatically when you run Prettier:

```bash
# Format a specific file
npx prettier --write src/MyComponent.tsx

# Format all files
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
```

## How it works

The plugin:

1. Parses your JavaScript/TypeScript/JSX files using Babel's parser
2. Identifies JSX attributes named `sx`
3. Sorts the object properties alphabetically by their key names (including nested objects)
4. Preserves breakpoint property order and dynamic elements (functions, spread operators)
5. Preserves all other formatting according to your Prettier configuration

## Features

- ✅ Sorts top-level `sx` prop properties alphabetically
- ✅ Recursively sorts nested objects (e.g., `&:hover`, `&.active`, media queries)
- ✅ Preserves breakpoint property order (xs, sm, md, lg, xl)
- ✅ Preserves dynamic elements (functions, spread operators, computed properties)
- ✅ Full TypeScript support with type definitions
- ✅ Works with JavaScript, JSX, TypeScript, and TSX files

## Supported file types

- JavaScript (`.js`)
- JSX (`.jsx`)
- TypeScript (`.ts`)
- TSX (`.tsx`)

## Development

### Setup

```bash
npm install
npm run build
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Project Structure

```
prettier-plugin-sort-mui-sx-props/
├── .husky/                    # Git hooks
├── src/
│   ├── index.ts              # Main plugin entry point
│   ├── ast/
│   │   └── traverser.ts      # AST traversal and sx prop detection
│   ├── parser/
│   │   └── wrapper.ts        # Babel parser wrapper
│   └── utils/
│       ├── object-sorter.ts  # Core sorting logic for sx objects
│       ├── property-key.ts   # Property key extraction utilities
│       └── property-sorter.ts # Property comparison and ordering
├── tests/
│   ├── sorting.test.ts       # Comprehensive test suite
│   └── utils.ts              # Test helper utilities
├── dist/                      # Compiled output (generated)
├── eslint.config.js           # ESLint configuration
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Test configuration
└── package.json               # Project metadata
```

## License

MIT
