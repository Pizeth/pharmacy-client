import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MobileMenuButton } from "./header.styles";
import { Footer } from "./account.styles";
import { NavPill } from "../Navigation/NavItems.styles";

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

it("allows the gliding pill appearance to be controlled through its typed theme slot", () => {
  const theme = createTheme({ components: {
    RazethNav: { styleOverrides: { pill: { borderRadius: "17px" } } },
  } });
  render(<ThemeProvider theme={theme}><ul><NavPill data-testid="pill" aria-hidden="true" /></ul></ThemeProvider>);
  expect(getComputedStyle(screen.getByTestId("pill")).borderRadius).toBe("17px");
});
