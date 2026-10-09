import { fireEvent, render, screen, within } from "@testing-library/react";
import { HrdAboutPage } from "./HrdAboutPage";
import { ABOUT_PAGES, HRD_ABOUT_CONTENT, type AboutSection } from "../../data/aboutContent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DirectorReveal } from "./DirectorReveal";

it("supports director slot overrides and toggles pending content without hover", () => {
  const theme = createTheme({ components: { RazethHrd: { styleOverrides: { directorReveal: { outline: "3px solid rgb(1, 2, 3)" } } } } });
  const { container } = render(<ThemeProvider theme={theme}><DirectorReveal person={null} /></ThemeProvider>);
  expect(getComputedStyle(container.firstElementChild!).outline).toBe("3px solid rgb(1, 2, 3)");
  const button = screen.getByRole("button");
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  fireEvent.click(button);
  expect(screen.getByRole("heading")).toHaveTextContent("ប្រធាននាយកដ្ឋានធនធានមនុស្ស");
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "false");
});

it.each(Object.keys(ABOUT_PAGES) as AboutSection[])("renders %s with matching navigation and pending content", (section) => {
  render(<HrdAboutPage section={section} />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(ABOUT_PAGES[section].title);
  const nav = screen.getByRole("navigation", { name: "ទំព័រអំពីអង្គភាព" });
  expect(within(nav).getAllByRole("link")).toHaveLength(4);
  expect(within(nav).getByRole("link", { name: ABOUT_PAGES[section].title })).toHaveAttribute("aria-current", "page");
  expect(screen.getAllByText(/កំពុងរៀបចំ/).length).toBeGreaterThan(0);
  expect(screen.queryByRole("link", { name: "ទាញយករចនាសម្ព័ន្ធ" })).not.toBeInTheDocument();
});

it("renders approved director details instead of their pending states", () => {
  render(<HrdAboutPage section="director" content={{ ...HRD_ABOUT_CONTENT, director: {
    name: "Test Director", position: "Director", biography: "Approved biography",
    education: ["Education entry"], experience: ["Experience entry"],
  } }} />);
  const reveal = screen.getByRole("button", { name: "បង្ហាញព័ត៌មានប្រធាននាយកដ្ឋាន" });
  expect(reveal).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(reveal);
  expect(reveal).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("heading", { name: "Test Director" })).toBeInTheDocument();
  expect(screen.getByText("Approved biography")).toBeInTheDocument();
  expect(screen.getByText("Education entry")).toBeInTheDocument();
  expect(screen.getByText("Experience entry")).toBeInTheDocument();
  expect(screen.queryByText(/កំពុងរៀបចំ/)).not.toBeInTheDocument();
});

it("shows populated staff groups and ignores empty groups", () => {
  render(<HrdAboutPage section="staff" content={{ ...HRD_ABOUT_CONTENT, staff: [
    { title: "Empty group", people: [] },
    { title: "Staff group", people: [{ name: "Test Staff", position: "Officer" }] },
  ] }} />);
  expect(screen.getByRole("heading", { name: "Staff group" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Test Staff" })).toBeInTheDocument();
  expect(screen.queryByText("Empty group")).not.toBeInTheDocument();
  expect(screen.queryByText(/កំពុងរៀបចំ/)).not.toBeInTheDocument();
});

it("offers an organization document only when one is supplied", () => {
  render(<HrdAboutPage section="structure" content={{ ...HRD_ABOUT_CONTENT, structure: {
    image: null, document: "/static/hrd-chart.pdf", units: ["Approved unit"],
  } }} />);
  expect(screen.getByRole("link", { name: "ទាញយករចនាសម្ព័ន្ធ" })).toHaveAttribute("href", "/static/hrd-chart.pdf");
  expect(screen.getByText("Approved unit")).toBeInTheDocument();
});
