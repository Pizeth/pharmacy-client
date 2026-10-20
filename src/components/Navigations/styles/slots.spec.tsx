import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MobileMenuButton } from "./header.styles";
import { Footer } from "./account.styles";

it("supports typed slot overrides and the previous content override alias", () => {
  const theme = createTheme({ cssVariables: true, components: {
    RazethDrawer: { styleOverrides: {
      content: { outline: "1px solid rgb(1, 2, 3)" },
      mobileMenuButton: { outlineOffset: "3px" },
      footer: { padding: "19px" },
    } },
  } });
  render(<ThemeProvider theme={theme}><MobileMenuButton aria-label="Menu"><span data-menu-glyph /></MobileMenuButton><Footer data-testid="footer" /></ThemeProvider>);
  const menu = screen.getByLabelText("Menu");
  expect(getComputedStyle(menu).outline).toBe("1px solid rgb(1, 2, 3)");
  expect(getComputedStyle(menu).outlineOffset).toBe("3px");
  expect(getComputedStyle(screen.getByTestId("footer")).padding).toBe("19px");
});
