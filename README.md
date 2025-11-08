# Prettier Plugin - Sort MUI SX Props

[![CI](https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/actions/workflows/ci.yml/badge.svg)](https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/prettier-plugin-sort-mui-sx-props.svg)](https://badge.fury.io/js/prettier-plugin-sort-mui-sx-props)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Prettier plugin that automatically sorts Material-UI (MUI) `sx` prop properties alphabetically.

## What it does

This plugin automatically organizes the properties inside MUI's `sx` prop in alphabetical order when you format your code with Prettier. It also recursively sorts nested objects like pseudo-selectors.

**Before:**
```tsx
<Box sx={{ padding: 2, marginTop: 1, backgroundColor: 'primary.main', display: 'flex' }}>
  Content
</Box>
```

**After:**
```tsx
<Box sx={{ backgroundColor: 'primary.main', display: 'flex', marginTop: 1, padding: 2 }}>
  Content
</Box>
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Build the plugin:

```bash
npm run build
```

3. Configure Prettier to use the plugin by adding it to your `.prettierrc`:

**.prettierrc**
```json
{
  "plugins": ["./dist/index.js"]
}
```

## Usage

Once built and configured, the plugin works automatically when you run Prettier:

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
4. Preserves all other formatting according to your Prettier configuration

## Features

- ✅ Sorts top-level `sx` prop properties alphabetically
- ✅ Recursively sorts nested objects (e.g., `&:hover`, `&.active`, media queries)
- ✅ Full TypeScript support with type definitions
- ✅ Works with JavaScript, JSX, TypeScript, and TSX files

## Supported file types

- JavaScript (`.js`)
- JSX (`.jsx`)
- TypeScript (`.ts`)
- TSX (`.tsx`)

## Development

### Build

```bash
npm run build
```

### Project Structure

```
prettier-sx-props/
├── src/
│   └── index.ts       # Main plugin source (TypeScript)
├── dist/              # Compiled output (generated)
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project metadata
└── example.tsx        # Example file for testing
```

### Testing

Test the plugin on the example file:

```bash
npm run build
npx prettier --write example.tsx
```

## License

MIT
