import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { HrdFooter } from "./HrdFooter";
import type { PublicDocumentsSiteInfo } from "./types";

const shadows = {
  neumorphic: "none",
  inset: "none",
  circleWell: "none",
  dataTableCard: "none",
  dataTableInset: "none",
};

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: { palette: { customShadows: shadows } },
    dark: { palette: { customShadows: shadows } },
  },
});

function renderFooter(contact: PublicDocumentsSiteInfo["contact"]): void {
  const site: PublicDocumentsSiteInfo = {
    name: "Directory",
    tagline: "Tagline",
    organization: "Org",
    contact,
  };
  const wrap = (node: ReactNode) => (
    <ThemeProvider theme={theme}>{node}</ThemeProvider>
  );

  render(wrap(<HrdFooter site={site} />));
}

describe("HrdFooter phone line", () => {
  it("renders the name and the number as two separate links on one line", () => {
    renderFooter({
      phones: [
        {
          name: "Dara Sok",
          number: "+855 12 345 678",
          telegram: "@dara_sok",
        },
      ],
    });

    const nameLink = screen.getByRole("link", { name: /Dara Sok/ });
    const numberLink = screen.getByRole("link", { name: "+855 12 345 678" });

    expect(nameLink).not.toBe(numberLink);

    // Name -> Telegram, in a new tab.
    expect(nameLink).toHaveAttribute("href", "https://t.me/dara_sok");
    expect(nameLink).toHaveAttribute("target", "_blank");
    expect(nameLink.getAttribute("rel")).toContain("noopener");

    // Number -> dialer, same tab.
    expect(numberLink).toHaveAttribute("href", "tel:+85512345678");
    expect(numberLink).not.toHaveAttribute("target");

    // Both live in the same line element.
    expect(nameLink.parentElement).toBe(numberLink.parentElement);
  });

  it("accepts a full Telegram link", () => {
    renderFooter({
      phones: [
        {
          name: "Dara Sok",
          number: "012 345 678",
          telegram: "https://t.me/dara_sok",
        },
      ],
    });

    expect(screen.getByRole("link", { name: /Dara Sok/ })).toHaveAttribute(
      "href",
      "https://t.me/dara_sok",
    );
  });

  it("leaves the name as plain text when no Telegram link is configured", () => {
    renderFooter({ phones: [{ name: "Dara Sok", number: "012 345 678" }] });

    expect(screen.queryByRole("link", { name: /Dara Sok/ })).toBeNull();
    expect(screen.getByText(/Dara Sok/)).toBeVisible();
    expect(screen.getByRole("link", { name: "012 345 678" })).toHaveAttribute(
      "href",
      "tel:012345678",
    );
  });

  it("ignores an unrecognised Telegram value instead of rendering a bad link", () => {
    renderFooter({
      phones: [
        {
          name: "Dara Sok",
          number: "012 345 678",
          telegram: "javascript:alert(1)",
        },
      ],
    });

    expect(screen.queryByRole("link", { name: /Dara Sok/ })).toBeNull();
  });

  it("shows only a Telegram link plus the number when there is no name", () => {
    renderFooter({
      phones: [{ number: "012 345 678", telegram: "dara_sok" }],
    });

    expect(screen.getByRole("link", { name: /Telegram/ })).toHaveAttribute(
      "href",
      "https://t.me/dara_sok",
    );
    expect(screen.getByRole("link", { name: "012 345 678" })).toBeVisible();
  });

  it("renders one line per person", () => {
    renderFooter({
      phones: [
        { name: "Dara Sok", number: "012 345 678", telegram: "dara_sok" },
        { name: "Mony Lim", number: "098 765 432", telegram: "mony_lim" },
      ],
    });

    expect(screen.getAllByRole("link", { name: /Telegram:/ })).toHaveLength(2);
    expect(document.querySelectorAll('a[href^="tel:"]')).toHaveLength(2);
  });

  it("renders no phone row when no phones are configured", () => {
    renderFooter({ email: "a@b.co" });

    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
  });
});

describe("HrdFooter address and email", () => {
  it("opens the configured Google Maps link in a new tab", () => {
    renderFooter({
      address: {
        text: "Office A",
        mapUrl: "https://maps.app.goo.gl/abc123",
      },
    });

    const link = screen.getByRole("link", { name: "Office A" });

    expect(link).toHaveAttribute("href", "https://maps.app.goo.gl/abc123");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("falls back to a Google Maps search when no map link is given", () => {
    renderFooter({ address: { text: "Office A, Room 401" } });

    expect(
      screen.getByRole("link", { name: "Office A, Room 401" }),
    ).toHaveAttribute(
      "href",
      "https://www.google.com/maps/search/?api=1&query=Office%20A%2C%20Room%20401",
    );
  });

  it("keeps the email as a mailto link that does not open a new tab", () => {
    renderFooter({ email: "hello@example.com" });

    const link = screen.getByRole("link", { name: "hello@example.com" });

    expect(link).toHaveAttribute("href", "mailto:hello@example.com");
    expect(link).not.toHaveAttribute("target");
  });
});
