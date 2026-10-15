import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HrdContactPage } from "./HrdContactPage";
import { HRD_SITE } from "../../data/siteInfo";

const theme = createTheme({ cssVariables: true });
const renderPage = (site = HRD_SITE) => render(<ThemeProvider theme={theme}><HrdContactPage site={site} /></ThemeProvider>);

it("renders an ID card with the supplied portrait, working contact links, and a non-navigating Meta placeholder", () => {
  renderPage();
  expect(screen.getByRole("article", { name: HRD_SITE.contact.phones![0].name })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /Otto/ })).toHaveAttribute("src", expect.stringContaining("otto.webp"));
  expect(screen.getByRole("link", { name: HRD_SITE.contact.email! })).toHaveAttribute("href", `mailto:${HRD_SITE.contact.email}`);
  expect(screen.getByRole("link", { name: "+855 97 824 2255" })).toHaveAttribute("href", "tel:+855978242255");
  expect(screen.getByRole("link", { name: "Telegram" })).toHaveAttribute("href", "https://t.me/SORN_MALY");
  const meta = screen.getByRole("button", { name: /Meta/ });
  expect(meta).toHaveAttribute("aria-disabled", "true");
  expect(meta).not.toHaveAttribute("href");
  fireEvent.click(meta);
  expect(screen.getByTitle("ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស")).toBeInTheDocument();
  expect(screen.getByText(HRD_SITE.contact.hours!)).toBeInTheDocument(); expect(screen.getByRole("link", { name: "មើលបណ្ដុំឯកសារ" })).toHaveAttribute("href", "/hrd/documents");
});

it("shows a pending state without inventing people when contact information is missing", () => {
  renderPage({ ...HRD_SITE, contact: {} });
  expect(screen.getByText("ព័ត៌មានទំនាក់ទំនងកំពុងរៀបចំ")).toBeInTheDocument();
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
});
