import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";

import { FileTypeBadge } from "./FileTypeBadge";

const shadows = {
  neumorphic: "none",
  inset: "none",
  circleWell: "none",
  dataTableCard: "none",
  dataTableInset: "none",
};

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: { palette: { customShadows: shadows } },
    dark: { palette: { customShadows: shadows } },
  },
});

function mountBadge(type: string): HTMLElement {
  render(
    <ThemeProvider theme={theme}>
      <FileTypeBadge type={type} />
    </ThemeProvider>,
  );

  return screen.getByText(type);
}

interface GeneratedRule {
  readonly selector: string;
  readonly text: string;
}

/**
 * The CSS rules emotion generated for the element's own classes.
 *
 * Emotion writes through the CSSOM (insertRule) in jsdom, so the rules are
 * read from document.styleSheets rather than from <style> text.
 */
function rulesFor(element: HTMLElement): GeneratedRule[] {
  const classes = Array.from(element.classList);

  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .filter(
      (rule): rule is CSSStyleRule =>
        "selectorText" in rule &&
        classes.some((name) =>
          (rule as CSSStyleRule).selectorText.includes(name),
        ),
    )
    .map((rule) => ({ selector: rule.selectorText, text: rule.cssText }));
}

/**
 * Light-mode rule: the one whose selector is just the badge's own class.
 */
function lightRule(rules: GeneratedRule[]): GeneratedRule | undefined {
  return rules.find((rule) => !rule.selector.includes(".dark"));
}

/**
 * Dark-mode rule: scoped to the dark colour-scheme class.
 */
function darkRule(rules: GeneratedRule[]): GeneratedRule | undefined {
  return rules.find((rule) => rule.selector.includes(".dark"));
}

describe("FileTypeBadge", () => {
  it("shows the label exactly as written", () => {
    expect(mountBadge("Docx").textContent).toBe("Docx");
  });

  it.each([
    ["PDF", "pdf", "primary"],
    ["DOCX", "document", "secondary"],
    ["PNG", "image", "warning"],
    ["XLSX", "spreadsheet", "success"],
    ["ZIP", "archive", "neutral"],
    ["PPTX", "other", "neutral"],
  ])("marks %s as a %s badge in the %s tone", (type, category, tone) => {
    const badge = mountBadge(type);

    expect(badge).toHaveAttribute("data-file-type-category", category);
    expect(badge).toHaveAttribute("data-tone", tone);
  });

  it("does not leak the tone prop to the DOM", () => {
    expect(mountBadge("PDF")).not.toHaveAttribute("tone");
  });

  it.each([
    ["PDF", "primary"],
    ["DOCX", "secondary"],
    ["PNG", "warning"],
    ["XLSX", "success"],
    ["ZIP", "neutral"],
  ])(
    "styles %s from the %s palette colour, in light and dark mode",
    (type, role) => {
      const rules = rulesFor(mountBadge(type));
      const main = `var(--mui-palette-${role}-main)`;

      // Light mode: the tone colour mixed toward black for legible text.
      expect(lightRule(rules)?.text).toContain(
        `color: color-mix(in srgb, ${main} 60%, black)`,
      );

      // Dark mode: mixed toward white instead, scoped to the dark scheme.
      expect(darkRule(rules)?.text).toContain(
        `color: color-mix(in srgb, ${main} 60%, white)`,
      );

      // The tint and border carry the hue, from the same palette role.
      expect(lightRule(rules)?.text).toContain(
        `rgba(var(--mui-palette-${role}-mainChannel) / 0.12)`,
      );
      expect(lightRule(rules)?.text).toContain(
        `rgba(var(--mui-palette-${role}-mainChannel) / 0.4)`,
      );
    },
  );

  it("never mixes a tone into a different palette role", () => {
    const rules = rulesFor(mountBadge("DOCX"));
    const all = rules.map((rule) => rule.text).join("\n");

    expect(all).toContain("--mui-palette-info-");
    for (const other of ["primary", "warning", "success", "error"]) {
      expect(all).not.toContain(`--mui-palette-${other}-`);
    }
  });

  it("uses neutral text colours for unrecognised formats", () => {
    const rules = rulesFor(mountBadge("TXT"));
    const all = rules.map((rule) => rule.text).join("\n");

    expect(lightRule(rules)?.text).toContain(
      "color: var(--mui-palette-text-secondary)",
    );
    expect(all).not.toContain("color-mix");
    expect(darkRule(rules)).toBeUndefined();
  });
});
