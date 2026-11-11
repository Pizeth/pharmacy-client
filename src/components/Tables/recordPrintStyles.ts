const record = "[data-record-print]";
const ancestors = `body:has(${record}), body :has(${record})`;

export const recordPrintStyles = {
  "@page": { size: "A4 portrait", margin: "14mm" },
  "@media print": {
    // Keep only the detail subtree and the wrappers needed to reach it.
    [`body:has(${record}) :not(${record}, ${record} *, :has(${record}))`]: {
      display: "none !important",
    },
    [ancestors]: {
      display: "block !important",
      position: "static !important",
      width: "auto !important",
      maxWidth: "none !important",
      minHeight: "0 !important",
      height: "auto !important",
      margin: "0 !important",
      padding: "0 !important",
      overflow: "visible !important",
      transform: "none !important",
      border: "0 !important",
      boxShadow: "none !important",
      background: "white !important",
    },
    [record]: {
      display: "block",
      fontSize: "10pt",
      overflowWrap: "anywhere",
      "&, & *": {
        color: "#18212b !important",
        boxShadow: "none !important",
        textShadow: "none !important",
        background: "transparent !important",
        borderColor: "#b8c0c8 !important",
      },
      "& button, & nav, & a.MuiButton-root, & [data-record-print-pending]": {
        display: "none !important",
      },
      "& h1": { fontSize: "20pt", lineHeight: 1.2 },
      "& h2": { fontSize: "13pt" },
      "& h1, & h2, & h3, & section > header": { breakAfter: "avoid" },
      "& p": { orphans: 3, widows: 3 },
      "& > header, & section, & dl": {
        marginBottom: "4mm",
        overflow: "visible",
      },
      "& section": { borderRadius: "2mm" },
      "& li, & dt, & dd": { breakInside: "avoid" },
      "& [data-icon-only][aria-label]": { width: "auto", height: "auto" },
      "& [data-icon-only][aria-label]::after": { content: "attr(aria-label)" },
    },
  },
} as const;
