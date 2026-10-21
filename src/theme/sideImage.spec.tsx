import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { RazethSideImageOptimized } from "./sideImage";

const Panel = styled("div", { name: "RazethSideImage", slot: "Root", overridesResolver: (_props, styles) => styles.root })({ backgroundColor: "rgb(0, 0, 0)" });
const Circle = styled("div", { name: "RazethSideImage", slot: "Card", overridesResolver: (_props, styles) => styles.card })({ backgroundColor: "rgb(0, 0, 0)", animation: "original-motion 150s linear infinite" });

it("applies the light palette through a live scheme selector without replacing dark motion", () => {
  const theme = createTheme({
    cssVariables: { colorSchemeSelector: "class" }, colorSchemes: { light: true, dark: true },
    components: { RazethSideImage: RazethSideImageOptimized },
  });
  document.documentElement.classList.add("light");
  try {
    render(<ThemeProvider theme={theme}><Panel data-testid="panel"><Circle data-testid="circle" /></Panel></ThemeProvider>);
    expect(getComputedStyle(screen.getByTestId("panel")).backgroundColor).toBe("rgb(228, 231, 236)");
    expect(getComputedStyle(screen.getByTestId("circle")).backgroundColor).toBe("rgb(52, 56, 62)");
    expect(getComputedStyle(screen.getByTestId("circle")).animation).toBe("original-motion 150s linear infinite");
    document.documentElement.classList.replace("light", "dark");
    expect(getComputedStyle(screen.getByTestId("panel")).backgroundColor).toBe("rgb(0, 0, 0)");
    expect(getComputedStyle(screen.getByTestId("circle")).backgroundColor).toBe("rgb(0, 0, 0)");
  } finally {
    document.documentElement.classList.remove("light", "dark");
  }
});
