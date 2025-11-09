import { describe, expect, it } from "vitest";
import { formatWithPlugin } from "./utils";

describe("MUI sx prop sorting", () => {
  it("should sort simple sx props alphabetically", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ padding: 2, marginTop: 1, backgroundColor: 'red', display: 'flex' }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{ backgroundColor: "red", display: "flex", marginTop: 1, padding: 2 }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should sort nested pseudo-selectors recursively", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ padding: 2, '&:hover': { backgroundColor: 'blue', color: 'white' }, marginTop: 1 }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        "&:hover": { backgroundColor: "blue", color: "white" },
        marginTop: 1,
        padding: 2,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve spread operator positions", async () => {
    const input = `
import { Box } from '@mui/material';

const baseStyles = { color: 'red' };

function Component() {
  return <Box sx={{ ...baseStyles, padding: 2, marginTop: 1 }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const baseStyles = { color: "red" };

function Component() {
  return <Box sx={{ ...baseStyles, marginTop: 1, padding: 2 }} />;
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve multiple spreads in their original positions", async () => {
    const input = `
import { Box } from '@mui/material';

const base = {};
const override = {};

function Component() {
  return <Box sx={{ color: 'red', ...base, padding: 2, ...override }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const base = {};
const override = {};

function Component() {
  return <Box sx={{ color: "red", ...base, padding: 2, ...override }} />;
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle conditional expressions in sx", async () => {
    const input = `
import { Box } from '@mui/material';

function Component({ active }) {
  return <Box sx={active ? { zIndex: 1, backgroundColor: 'blue' } : { padding: 2, marginTop: 1 }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component({ active }) {
  return (
    <Box
      sx={
        active
          ? { backgroundColor: "blue", zIndex: 1 }
          : { marginTop: 1, padding: 2 }
      }
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle logical expressions in sx", async () => {
    const input = `
import { Box } from '@mui/material';

function Component({ show }) {
  return <Box sx={show && { zIndex: 1, backgroundColor: 'blue', padding: 2 }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component({ show }) {
  return (
    <Box sx={show && { backgroundColor: "blue", padding: 2, zIndex: 1 }} />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle array syntax in sx", async () => {
    const input = `
import { Box } from '@mui/material';

const baseStyle = { margin: 1 };

function Component() {
  return <Box sx={[baseStyle, { zIndex: 1, padding: 2 }, { color: 'red' }]} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const baseStyle = { margin: 1 };

function Component() {
  return <Box sx={[baseStyle, { padding: 2, zIndex: 1 }, { color: "red" }]} />;
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should sort case-insensitively", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ Zindex: 1, backgroundColor: 'blue', Padding: 2 }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return <Box sx={{ backgroundColor: "blue", Padding: 2, Zindex: 1 }} />;
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle media queries and nested objects", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{
    padding: 2,
    '@media (min-width: 600px)': {
      marginTop: 3,
      backgroundColor: 'blue'
    },
    color: 'red'
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        "@media (min-width: 600px)": {
          backgroundColor: "blue",
          marginTop: 3,
        },
        color: "red",
        padding: 2,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle vendor prefixes", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ padding: 2, WebkitAppearance: 'none', color: 'red', MozAppearance: 'none' }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        color: "red",
        MozAppearance: "none",
        padding: 2,
        WebkitAppearance: "none",
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should not modify non-sx props", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box data-test={{ z: 1, a: 2 }} sx={{ padding: 2, color: 'red' }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return <Box data-test={{ z: 1, a: 2 }} sx={{ color: "red", padding: 2 }} />;
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should support flexible spread positioning (base → props → override pattern)", async () => {
    const input = `
import { Box } from '@mui/material';

const baseStyles = {};
const overrides = {};

function Component() {
  return <Box sx={{ 
    ...baseStyles, 
    zIndex: 1, 
    padding: 2, 
    color: 'red', 
    ...overrides 
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const baseStyles = {};
const overrides = {};

function Component() {
  return (
    <Box
      sx={{
        ...baseStyles,
        color: "red",
        padding: 2,
        zIndex: 1,
        ...overrides,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should support spread-last pattern (props → parent override)", async () => {
    const input = `
import { Box } from '@mui/material';

function Component(props) {
  return <Box sx={{ 
    zIndex: 1, 
    color: 'red', 
    padding: 2, 
    ...props.sx 
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component(props) {
  return (
    <Box
      sx={{
        color: "red",
        padding: 2,
        zIndex: 1,
        ...props.sx,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve order of multiple spreads with sorted props between them", async () => {
    const input = `
import { Box } from '@mui/material';

const spread1 = {};
const spread2 = {};
const spread3 = {};

function Component() {
  return <Box sx={{ 
    zIndex: 1, 
    ...spread1, 
    padding: 2, 
    color: 'red', 
    ...spread2, 
    margin: 1, 
    backgroundColor: 'blue',
    ...spread3,
    width: 100
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const spread1 = {};
const spread2 = {};
const spread3 = {};

function Component() {
  return (
    <Box
      sx={{
        zIndex: 1,
        ...spread1,
        color: "red",
        padding: 2,
        ...spread2,
        backgroundColor: "blue",
        margin: 1,
        ...spread3,
        width: 100,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve computed property positions", async () => {
    const input = `
import { Box } from '@mui/material';

const dynamicKey = 'customProperty';

function Component() {
  return <Box sx={{ 
    zIndex: 1, 
    [dynamicKey]: 'value', 
    padding: 2, 
    color: 'red' 
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const dynamicKey = "customProperty";

function Component() {
  return (
    <Box
      sx={{
        zIndex: 1,
        [dynamicKey]: "value",
        color: "red",
        padding: 2,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve multiple computed properties in order", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    zIndex: 1,
    ['prop' + '1']: 'a',
    padding: 2,
    ['prop' + '2']: 'b',
    color: 'red'
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        zIndex: 1,
        ["prop" + "1"]: "a",
        padding: 2,
        ["prop" + "2"]: "b",
        color: "red",
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve object methods in their original position", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    zIndex: 1,
    padding: 2,
    getValue() { return 'test'; },
    color: 'red',
    margin: 1
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        padding: 2,
        zIndex: 1,
        getValue() {
          return "test";
        },
        color: "red",
        margin: 1,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle mixed dynamic elements (spreads, computed, methods)", async () => {
    const input = `
import { Box } from '@mui/material';

const base = {};
const key = 'dynamic';

function Component() {
  return <Box sx={{ 
    zIndex: 1,
    padding: 2,
    ...base,
    color: 'red',
    [key]: 'value',
    margin: 1,
    getWidth() { return 100; },
    backgroundColor: 'blue'
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const base = {};
const key = "dynamic";

function Component() {
  return (
    <Box
      sx={{
        padding: 2,
        zIndex: 1,
        ...base,
        color: "red",
        [key]: "value",
        margin: 1,
        getWidth() {
          return 100;
        },
        backgroundColor: "blue",
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle computed properties with complex expressions", async () => {
    const input = `
import { Box } from '@mui/material';

function Component({ theme }) {
  return <Box sx={{ 
    zIndex: 1,
    [theme.breakpoints.up('md')]: { padding: 3 },
    padding: 2,
    color: 'red'
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component({ theme }) {
  return (
    <Box
      sx={{
        zIndex: 1,
        [theme.breakpoints.up("md")]: { padding: 3 },
        color: "red",
        padding: 2,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should sort numeric keys as literals", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    zIndex: 1,
    0: 'first',
    padding: 2,
    1: 'second',
    color: 'red'
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        0: "first",
        1: "second",
        color: "red",
        padding: 2,
        zIndex: 1,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should preserve order with only dynamic elements", async () => {
    const input = `
import { Box } from '@mui/material';

const spread1 = {};
const spread2 = {};

function Component() {
  return <Box sx={{ 
    ...spread1,
    ['key1']: 'a',
    ...spread2,
    getValue() { return 1; }
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

const spread1 = {};
const spread2 = {};

function Component() {
  return (
    <Box
      sx={{
        ...spread1,
        ["key1"]: "a",
        ...spread2,
        getValue() {
          return 1;
        },
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle nested objects with dynamic properties", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    zIndex: 1,
    '&:hover': {
      padding: 2,
      ...spread,
      color: 'red',
      ['key']: 'value'
    },
    margin: 1
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        "&:hover": {
          padding: 2,
          ...spread,
          color: "red",
          ["key"]: "value",
        },
        margin: 1,
        zIndex: 1,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should sort MUI breakpoints in correct order (xs, sm, md, lg, xl)", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    padding: { xl: 5, xs: 1, lg: 4, sm: 2, md: 3 },
    margin: 2
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        margin: 2,
        padding: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should handle multiple properties with breakpoint values", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    padding: { lg: 4, xs: 1, md: 3 },
    zIndex: 1,
    margin: { md: 2, xs: 1, sm: 1.5 },
    color: 'red'
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        color: "red",
        margin: { xs: 1, sm: 1.5, md: 2 },
        padding: { xs: 1, md: 3, lg: 4 },
        zIndex: 1,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should sort breakpoints in nested objects", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    '&:hover': {
      padding: { lg: 4, xs: 2, md: 3 },
      color: 'blue'
    },
    margin: 1
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        "&:hover": {
          color: "blue",
          padding: { xs: 2, md: 3, lg: 4 },
        },
        margin: 1,
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });

  it("should only apply breakpoint sorting when all keys are breakpoints", async () => {
    const input = `
import { Box } from '@mui/material';

function Component() {
  return <Box sx={{ 
    padding: { xs: 1, md: 3, customKey: 5 },
    margin: 2
  }} />;
}
`;

    const expected = `
import { Box } from "@mui/material";

function Component() {
  return (
    <Box
      sx={{
        margin: 2,
        padding: { customKey: 5, md: 3, xs: 1 },
      }}
    />
  );
}
`;

    const result = await formatWithPlugin(input);
    expect(result.trim()).toBe(expected.trim());
  });
});
