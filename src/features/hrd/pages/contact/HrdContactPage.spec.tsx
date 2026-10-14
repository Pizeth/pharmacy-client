import { render, screen } from "@testing-library/react";
import { HrdContactPage } from "./HrdContactPage";
import { HRD_SITE } from "../../data/siteInfo";

it("uses a spokesperson-style ID card with logo and Otto placeholders, and real contact links", () => {
  render(<HrdContactPage />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ទំនាក់ទំនង");
  expect(screen.getByRole("article")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /Otto/ })).toHaveAttribute("src", expect.stringContaining("otto.webp"));
  expect(screen.getByText(/រង់ចាំព័ត៌មានផ្លូវការ/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: HRD_SITE.contact.email! })).toHaveAttribute("href", `mailto:${HRD_SITE.contact.email}`);
  expect(screen.getByRole("link", { name: "+855 97 824 2255" })).toHaveAttribute("href", "tel:+855978242255");
  expect(screen.getByRole("link", { name: "Telegram" })).toHaveAttribute("href", "https://t.me/SORN_MALY");
  expect(screen.getByRole("button", { name: /Facebook/ })).toBeDisabled();
  expect(screen.getByRole("link", { name: "បើកក្នុង Google Maps" })).toHaveAttribute("href", HRD_SITE.contact.address!.mapUrl);
  expect(screen.getByTitle("ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស")).toHaveAttribute("src", `https://www.google.com/maps?q=${encodeURIComponent(HRD_SITE.contact.address!.text)}&output=embed`);
});

it("shows pending states without inventing identity or social links", () => {
  render(<HrdContactPage site={{ ...HRD_SITE, contact: {} }} />);
  expect(screen.getByText("ទីតាំងកំពុងរៀបចំ")).toBeInTheDocument();
  expect(screen.getByText("ព័ត៌មានទំនាក់ទំនងកំពុងរៀបចំ")).toBeInTheDocument();
  expect(screen.getByText("ឈ្មោះអ្នកទំនាក់ទំនងកំពុងរៀបចំ")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Telegram" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Facebook/ })).toBeDisabled();
  expect(screen.queryByTitle("ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស")).not.toBeInTheDocument();
});
