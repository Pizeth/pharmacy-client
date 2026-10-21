import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { HrdHomePage } from "./HrdHomePage";

function mountHome() {
  render(<ThemeProvider theme={createTheme()}><HrdHomePage /></ThemeProvider>);
}

it("offers document links on the new HRD route", () => {
  mountHome();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("នាយកដ្ឋានធនធានមនុស្ស");
  expect(screen.queryByText("HUMAN RESOURCE DEPARTMENT")).not.toBeInTheDocument();
  expect(screen.queryByText("Frequently Asked Questions")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "ស្វែងរកឯកសារ" })).toHaveAttribute("href", "/hrd/documents");
  expect(screen.getByRole("link", { name: "ទំនាក់ទំនងតាមអ៊ីមែល" }).getAttribute("href")).toMatch(/^mailto:/);
});

it.each(["light", "dark"] as const)("keeps carousel links white in %s mode despite shared button colors", (mode) => {
  const theme = createTheme({ palette: { mode }, components: {
    MuiButtonBase: { styleOverrides: { root: { "&.MuiButton-root": { color: "#123456" } } } },
  } });
  render(<ThemeProvider theme={theme}><HrdHomePage /></ThemeProvider>);
  expect(screen.getByRole("link", { name: "ស្វែងរកឯកសារ" })).toHaveStyle({ color: "#fff" });
  document.querySelectorAll('[class*="RazethHrd-homeGalleryLink"]').forEach((link) => {
    expect(link).toHaveStyle({ color: "#fff" });
  });
});

it("cycles featured content in both directions and supports direct selection", () => {
  mountHome();
  fireEvent.click(screen.getByRole("button", { name: "ព័ត៌មានបន្ទាប់" }));
  expect(screen.getByRole("button", { name: "ព័ត៌មាន 2" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("link", { name: "មើលបណ្ដុំឯកសារ" })).toHaveAttribute("href", "/hrd/documents");
  fireEvent.click(screen.getByRole("button", { name: "ព័ត៌មាន 1" }));
  fireEvent.click(screen.getByRole("button", { name: "ព័ត៌មានមុន" }));
  expect(screen.getByRole("button", { name: "ព័ត៌មាន 3" })).toHaveAttribute("aria-pressed", "true");
});

it("supports direct horizontal touch swipes over hero content, while vertical drags do not slide", () => {
  mountHome();
  const hero = screen.getByRole("region", { name: "ព័ត៌មានសំខាន់" });
  const visual = hero.firstElementChild!;
  const touch = (x: number, y: number) => [{ identifier: 1, clientX: x, clientY: y, target: visual }];
  fireEvent.touchStart(visual, { touches: touch(220, 120) });
  fireEvent.touchMove(visual, { touches: touch(215, 210) });
  fireEvent.touchEnd(visual, { touches: [], changedTouches: touch(215, 210) });
  expect(screen.getByRole("button", { name: "ព័ត៌មាន 1" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.touchStart(visual, { touches: touch(220, 120) });
  fireEvent.touchMove(visual, { touches: touch(110, 124) });
  fireEvent.touchEnd(visual, { touches: [], changedTouches: touch(110, 124) });
  expect(screen.getByRole("button", { name: "ព័ត៌មាន 2" })).toHaveAttribute("aria-pressed", "true");
  const copy = screen.getByRole("link", { name: "មើលបណ្ដុំឯកសារ" });
  const linkTouch = [{ identifier: 2, clientX: 100, clientY: 100, target: copy }];
  fireEvent.touchStart(copy, { touches: linkTouch });
  fireEvent.touchEnd(copy, { touches: [], changedTouches: linkTouch });
  expect(screen.getByRole("button", { name: "ព័ត៌មាន 2" })).toHaveAttribute("aria-pressed", "true");
});
