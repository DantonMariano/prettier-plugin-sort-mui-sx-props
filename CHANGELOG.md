# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-11-08

### Changed

- Enhanced README with clarification on spread operator segmentation behavior to prevent CSS override conflicts

## [1.0.0] - 2025-11-08

### Added

- Initial release of prettier-plugin-sort-mui-sx-props
- Automatic alphabetical sorting of MUI `sx` prop properties
- Support for nested objects within `sx` props
- TypeScript support with type definitions
- Babel parser integration for accurate AST traversal
- Comprehensive test suite with Vitest

### Features

- Sorts object properties alphabetically while preserving code structure
- Handles complex nested object structures
- Maintains code formatting and whitespace
- Works seamlessly with Prettier 3.0.0 and above

[1.0.0]: https://github.com/dantonmariano/prettier-plugin-sort-mui-sx-props/releases/tag/v1.0.0
