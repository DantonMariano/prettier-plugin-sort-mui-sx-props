import { describe, it, expect } from "vitest";
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
});
