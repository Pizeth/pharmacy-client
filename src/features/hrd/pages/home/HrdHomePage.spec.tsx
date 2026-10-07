import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { HrdHomePage } from "./HrdHomePage";

function mountHome() {
  render(<ThemeProvider theme={createTheme()}><HrdHomePage /></ThemeProvider>);
}

it("offers document links on the new HRD route", () => {
  mountHome();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("នាយកដ្ឋានធនធានមនុស្ស");
  expect(screen.getByRole("link", { name: "ស្វែងរកឯកសារ" })).toHaveAttribute("href", "/hrd/documents");
  expect(screen.getByRole("link", { name: "ទំនាក់ទំនងតាមអ៊ីមែល" }).getAttribute("href")).toMatch(/^mailto:/);
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
