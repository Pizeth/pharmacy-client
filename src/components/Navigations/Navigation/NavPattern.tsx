"use client";

import { styled } from "@mui/material/styles";

const Pattern = styled("span", {
  name: "RazethNavPattern",
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "absolute", inset: "0 auto 0 0", width: "clamp(160px, 32vw, 500px)", maxWidth: "100%",
  overflow: "hidden", pointerEvents: "none", zIndex: 0, opacity: 0.2,
  maskImage: "linear-gradient(to left, transparent, black 75%)",
  "&::before": {
    content: '""', position: "absolute", inset: 0, backgroundColor: "#edad54",
    maskImage: 'url("/static/svg/patterns/rumduol.svg")', maskSize: "104px 104px",
    maskRepeat: "repeat", maskPosition: "left center",
  },
  ...theme.applyStyles("dark", {
    inset: "0 0 0 auto",
    maskImage: "linear-gradient(to right, transparent, black 75%)",
    "&::before": { maskPosition: "right center" },
  }),
}));

export default function NavPattern() {
  return <Pattern aria-hidden="true" />;
}
