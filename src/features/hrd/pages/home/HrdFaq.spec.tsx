import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HrdFaq } from "./HrdFaq";
import { HRD_FAQ } from "../../data/hrdFaq";

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
