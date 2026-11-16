import { fireEvent, render, screen, within } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HrdContactPage } from "./HrdContactPage";
import { HRD_SITE } from "../../data/siteInfo";

const theme = createTheme({ cssVariables: true });
const renderPage = (site = HRD_SITE) => render(<ThemeProvider theme={theme}><HrdContactPage site={site} /></ThemeProvider>);

it("renders an ID card with the supplied portrait, working contact links, and a non-navigating Meta placeholder", () => {
  renderPage();
  expect(screen.getByRole("article", { name: HRD_SITE.contact.phones![0].name })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: `រូបថត ${HRD_SITE.contact.phones![0].name}` })).toHaveAttribute("src", expect.stringContaining("hrd-contact-portrait.png"));
  expect(screen.getByRole("img", { name: "តួនាទី" })).toBeInTheDocument();
  expect(screen.queryByText("តួនាទី")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: HRD_SITE.contact.email! })).toHaveAttribute("href", `mailto:${HRD_SITE.contact.email}`);
  expect(screen.getByRole("link", { name: "+855 97 824 2255" })).toHaveAttribute("href", "tel:+855978242255");
  expect(screen.getByRole("link", { name: "Telegram" })).toHaveAttribute("href", "https://t.me/SORN_MALY");
  const meta = screen.getByRole("button", { name: /Meta/ });
  expect(meta).toHaveAttribute("aria-disabled", "true");
  expect(meta).not.toHaveAttribute("href");
  fireEvent.click(meta);
  expect(screen.getByTitle("ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស")).toBeInTheDocument();
  const card = screen.getByRole("article", { name: HRD_SITE.contact.phones![0].name });
  expect(within(card).getByText(HRD_SITE.contact.hours!)).toBeInTheDocument();
  expect(within(card).getByText(HRD_SITE.contact.address!.street!)).toBeInTheDocument();
  expect(within(card).getByRole("img", { name: "ម៉ោងធ្វើការ" })).toBeInTheDocument();
  expect(screen.queryByText("ម៉ោងធ្វើការ")).not.toBeInTheDocument();
  expect(screen.queryByText("ចង់ស្វែងរកទម្រង់ពាក្យស្នើសុំ?")).not.toBeInTheDocument();
  expect(screen.getByRole("form", { name: "ការស្នើសុំទំនាក់ទំនង" })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /អ៊ីមែល/ })).toHaveAttribute("type", "email");
  expect(screen.getByRole("textbox", { name: /សារ/ })).toBeRequired();
});

it("shows a pending state without inventing people when contact information is missing", () => {
  renderPage({ ...HRD_SITE, contact: {} });
  expect(screen.getByText("ព័ត៌មានទំនាក់ទំនងកំពុងរៀបចំ")).toBeInTheDocument();
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "ផ្ញើសារ" })).toBeDisabled();
});

it("keeps the card and decorative art overridable through HRD theme slots", () => {
  const customTheme = createTheme({ cssVariables: true, components: {
    RazethHrd: { styleOverrides: { contactCard: { borderRadius: "29px" }, contactCardArt: { opacity: 0.4 } } },
  } });
  render(<ThemeProvider theme={customTheme}><HrdContactPage /></ThemeProvider>);
  const card = screen.getByRole("article", { name: HRD_SITE.contact.phones![0].name });
  expect(card).toHaveStyle({ borderRadius: "29px" });
  expect(card.querySelector('[aria-hidden="true"]')).toHaveStyle({ opacity: 0.4 });
  expect(card.querySelectorAll('[data-contact-shape="true"]')).toHaveLength(4);
  expect(card.querySelector('[class*="contactHeaderPattern"]')).toHaveAttribute("aria-hidden", "true");
});
