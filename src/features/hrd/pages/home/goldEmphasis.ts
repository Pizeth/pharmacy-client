import type { CSSObject } from "@mui/material/styles";

/** Match the hamburger glyph's fine outline, with scheme colors supplied by the homepage. */
export const goldTextEmphasis: CSSObject = {
  WebkitTextStroke: "0.125px var(--Hrd-accent-outline, rgb(0 0 0 / 37.5%))",
  textShadow: "var(--Hrd-accent-shadow, 1.5px 1.5px 2px rgb(0 0 0 / 35%), -1px -1px 1px rgb(255 255 255 / 25%))",
};

export const goldIconEmphasis: CSSObject = {
  filter: "drop-shadow(-0.125px -0.125px 0 var(--Hrd-accent-outline, rgb(0 0 0 / 37.5%))) drop-shadow(0.125px -0.125px 0 var(--Hrd-accent-outline, rgb(0 0 0 / 37.5%))) drop-shadow(-0.125px 0.125px 0 var(--Hrd-accent-outline, rgb(0 0 0 / 37.5%))) drop-shadow(0.125px 0.125px 0 var(--Hrd-accent-outline, rgb(0 0 0 / 37.5%))) var(--Hrd-accent-icon-shadow, drop-shadow(1.5px 1.5px 2px rgb(0 0 0 / 35%)) drop-shadow(-1px -1px 1px rgb(255 255 255 / 25%)))",
};
