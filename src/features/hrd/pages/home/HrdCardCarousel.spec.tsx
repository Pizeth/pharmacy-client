import { render, screen, fireEvent } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HrdCardCarousel } from "./HrdCardCarousel";

test("cycles all six cards, wraps both ways, and exposes only the active link", () => {
  render(<ThemeProvider theme={createTheme()}><HrdCardCarousel /></ThemeProvider>);
  expect(screen.getByText("1 / 6")).toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "ឯកសារមុន" }));
  expect(screen.getByText("6 / 6")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "ឯកសារបន្ទាប់" }));
  expect(screen.getByText("1 / 6")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/hrd/documents");
});

test("gallery presentation can be overridden through typed HRD theme slots", () => {
  render(<ThemeProvider theme={createTheme({ components: { RazethHrd: {
    styleOverrides: { homeGalleryScene: { height: "410px" } },
  } } })}><HrdCardCarousel /></ThemeProvider>);
  expect(document.querySelector('[class*="RazethHrd-homeGalleryScene"]')).toHaveStyle({ height: "410px" });
});
