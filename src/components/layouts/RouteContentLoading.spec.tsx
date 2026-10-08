import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RouteContentLoading } from "./RouteContentLoading";

test("announces loading inside a theme-overridable content skeleton", () => {
  const theme = createTheme({ components: {
    RazethRouteContentLoading: { styleOverrides: { root: { minHeight: "321px" } } },
  } });
  render(<ThemeProvider theme={theme}><RouteContentLoading /></ThemeProvider>);
  const status = screen.getByRole("status");
  expect(status).toHaveAttribute("aria-busy", "true");
  expect(status).toHaveTextContent("Loading page…");
  expect(status).toHaveStyle({ minHeight: "321px" });
});
