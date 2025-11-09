# Prettier Plugin - Sort MUI SX Props

[![CI](https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/actions/workflows/ci.yml/badge.svg)](https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/prettier-plugin-sort-mui-sx-props.svg)](https://www.npmjs.com/package/prettier-plugin-sort-mui-sx-props)
[![npm downloads](https://img.shields.io/npm/dm/prettier-plugin-sort-mui-sx-props.svg)](https://www.npmjs.com/package/prettier-plugin-sort-mui-sx-props)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Prettier plugin that automatically sorts Material-UI (MUI) `sx` prop properties alphabetically.

## Why?

Keeping `sx` prop properties consistently ordered across your codebase provides several benefits:

- **Easier Code Reviews** - Reviewers can quickly scan properties in a predictable order
- **Reduced Merge Conflicts** - Consistent ordering minimizes conflicts when multiple developers modify the same component
- **Improved Readability** - Alphabetical sorting makes it easier to find specific properties at a glance
- **Catch Duplicates** - Duplicate properties become obvious when they appear next to each other
- **Consistency** - Automated formatting eliminates debates about property order in style guides

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

## Examples

### Nested Objects and Pseudo-selectors

**Before:**

```tsx
<Button
  sx={{
    padding: 2,
    color: "primary.main",
    "&:hover": {
      backgroundColor: "primary.light",
      transform: "scale(1.05)",
      color: "primary.dark",
    },
    fontSize: "1rem",
  }}
>
  Click me
</Button>
```

**After:**

```tsx
<Button
  sx={{
    "&:hover": {
      backgroundColor: "primary.light",
      color: "primary.dark",
      transform: "scale(1.05)",
    },
    color: "primary.main",
    fontSize: "1rem",
    padding: 2,
  }}
>
  Click me
</Button>
```

### Responsive Breakpoints

**Before:**

```tsx
<Box
  sx={{
    display: "flex",
    padding: { xl: 4, xs: 1, md: 3, sm: 2, lg: 3.5 },
    margin: { md: 2, xs: 1 },
  }}
/>
```

**After:**

```tsx
<Box
  sx={{
    display: "flex",
    margin: { xs: 1, md: 2 },
    padding: { xs: 1, sm: 2, md: 3, lg: 3.5, xl: 4 },
  }}
/>
```

### With Spread Operators and Dynamic Values

**Before:**

```tsx
<Box
  sx={{
    fontSize: 12,
    ...baseStyles,
    fontFamily: "Roboto, sans-serif",
    backgroundColor: "background.paper",
    ...(!isActive && { border: "4px solid" }),
    padding: 2,
    color: "text.primary",
    ...(isActive && { border: "2px solid" }),
  }}
/>
```

**After:**

```tsx
<Box
  sx={{
    fontSize: 12,
    ...baseStyles,
    backgroundColor: "background.paper",
    fontFamily: "Roboto, sans-serif",
    ...(!isActive && { border: "4px solid" }),
    color: "text.primary",
    padding: 2,
    ...(isActive && { border: "2px solid" }),
  }}
/>
```

**Note:** When multiple spread operators are present, the plugin segments the `sx` object by spread operators and sorts properties within each segment independently. This prevents property ordering issues that could arise from CSS cascade conflicts and ensures that properties maintain their intended override behavior relative to the spread operators.

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
