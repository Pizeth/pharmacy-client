import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HrdFaq } from "./HrdFaq";
import { HRD_FAQ } from "../../data/hrdFaq";
import { Header } from "./HrdFaq.styles";

it("renders resource-grounded FAQs with native accessible expandable summaries", () => {
  render(<ThemeProvider theme={createTheme()}><HrdFaq /></ThemeProvider>);
  expect(screen.getByRole("heading", { name: "សំណួរដែលសួរញឹកញាប់" })).toBeInTheDocument();
  const items = document.querySelectorAll("#hrd-faq details");
  expect(items).toHaveLength(HRD_FAQ.length);
  items.forEach((item) => expect(item).not.toHaveAttribute("open"));
  const question = screen.getByText(HRD_FAQ[1].question);
  fireEvent.click(question.closest("summary")!);
  expect(items[1]).toHaveAttribute("open");
  items.forEach((item) => { if (!item.hasAttribute("open")) fireEvent.click(item.querySelector("summary")!); });
  expect(screen.getAllByRole("link", { name: /បណ្ដុំឯកសារ|ឯកសារទាំងអស់|ព័ត៌មានទំនាក់ទំនង|ទាក់ទងនាយកដ្ឋាន/ }).length).toBeGreaterThan(0);
});

it.each([false, true])("preserves a custom FAQ shadow with cssVariables=%s", cssVariables => {
  const shadow = "1px 2px 3px rgb(10, 20, 30)";
  const theme = createTheme({ cssVariables, palette: { mode: "dark", customShadows: {
    neumorphic: shadow, inset: "none", circleWell: "none", dataTableCard: "none", dataTableInset: "none",
  } } });
  render(<ThemeProvider theme={theme}><Header><svg data-testid="faq-icon" /></Header></ThemeProvider>);
  expect(getComputedStyle(screen.getByTestId("faq-icon")).boxShadow).toBe(
    cssVariables ? "var(--mui-palette-customShadows-neumorphic)" : shadow,
  );
});

it("uses the ordinary theme shadow when no custom token is provided", () => {
  const theme = createTheme({ palette: { mode: "dark" } });
  render(<ThemeProvider theme={theme}><Header><svg data-testid="faq-icon" /></Header></ThemeProvider>);
  expect(getComputedStyle(screen.getByTestId("faq-icon")).boxShadow).toBe(theme.shadows[2]);
});
