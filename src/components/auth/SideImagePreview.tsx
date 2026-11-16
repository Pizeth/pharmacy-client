"use client";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import SideImage from "./sideImage";
import ThemeToggle from "../effect/themes/themeToggle";

const Toolbar = styled("header", {
  name: "RazethSideImagePreview", slot: "Toolbar", overridesResolver: (_props, styles) => styles.toolbar,
})(({ theme }) => ({ display: "flex", alignItems: "center", justifyContent: "center", gap: theme.spacing(2), padding: theme.spacing(2), color: theme.vars.palette.text.primary }));
const Root = styled("section", {
  name: "RazethSideImagePreview", slot: "Root", overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  height: "calc(100dvh - var(--Navigation-expanded-height, 160px) - 88px)", minHeight: 480, maxWidth: 640, marginInline: "auto", overflow: "hidden", borderRadius: theme.spacing(2),
  "& > .MuiGrid-root": { height: "100%", width: "100%", maxWidth: "100%" },
  [theme.breakpoints.down("md")]: { display: "none" },
}));

/** Isolates the real login artwork without touching an existing signed-in session. */
export default function SideImagePreview() {
  return <>
    <Toolbar><Typography variant="subtitle1">Login background preview (desktop)</Typography><ThemeToggle /></Toolbar>
    <Root><SideImage /></Root>
  </>;
}
