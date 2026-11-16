import { render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloudLoader from "./CloudLoader";

test("uses primary color, typed theme overrides, and unique SVG masks", () => {
  const theme = createTheme({ palette: { primary: { main: "#123456" } }, components: {
    RazethCloudLoader: { styleOverrides: { root: { width: "120px" } } },
  } });
  const { container } = render(<ThemeProvider theme={theme}><CloudLoader /><CloudLoader /></ThemeProvider>);
  const svgs = container.querySelectorAll("svg");
  expect(svgs[0]).toHaveStyle({ color: theme.palette.primary.light, width: "120px" });
  expect(svgs[0]).toHaveAttribute("aria-hidden", "true");
  const ids = Array.from(container.querySelectorAll("[id]")).map(node => node.id);
  expect(new Set(ids).size).toBe(ids.length);
});
