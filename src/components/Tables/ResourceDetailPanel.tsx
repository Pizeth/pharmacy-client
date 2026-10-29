"use client";
import type { ReactNode } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
const prefix = "RazethResourceRecord";
const Root = styled("div", { name: prefix, slot: "PanelRoot", overridesResolver: (_, styles) => styles.panelRoot })(({ theme }) => ({
  minWidth: 0, border: `1px solid ${(theme.vars ?? theme).palette.divider}`, borderRadius: 16, overflow: "hidden", overflowWrap: "anywhere",
  '&[data-view="card"]': { border: 0, borderRadius: 0 },
}));
const Section = styled("section", { name: prefix, slot: "PanelSection", overridesResolver: (_, styles) => styles.panelSection })(({ theme }) => ({
  display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`, minWidth: 0,
  '&:first-child': { borderTop: 0 }, '[data-view="card"] &': { gridTemplateColumns: "minmax(0, 1fr)" },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
const Heading = styled("header", { name: prefix, slot: "PanelHeading", overridesResolver: (_, styles) => styles.panelHeading })(({ theme }) => ({
  display: "flex", alignItems: "flex-start", gap: theme.spacing(1), padding: theme.spacing(2.5), backgroundColor: (theme.vars ?? theme).palette.action.hover,
  '& > svg': { width: 20, height: 20, flexShrink: 0, color: (theme.vars ?? theme).palette.text.secondary },
  '[data-view="card"] &': { padding: theme.spacing(1.5, 0), backgroundColor: "transparent" },
}));
const Body = styled("div", { name: prefix, slot: "PanelBody", overridesResolver: (_, styles) => styles.panelBody })(({ theme }) => ({
  display: "grid", alignContent: "start", gap: theme.spacing(2), padding: theme.spacing(2.5), minWidth: 0,
  '[data-view="card"] &': { padding: theme.spacing(0, 0, 2) },
}));
const Fields = styled("dl", { name: prefix, slot: "PanelFields", overridesResolver: (_, styles) => styles.panelFields })(({ theme }) => ({
  display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: theme.spacing(2.5), minWidth: 0, margin: 0,
  '[data-view="card"] &': { gridTemplateColumns: "minmax(0, 1fr)", gap: theme.spacing(1.5) },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
const Field = styled("div", { name: prefix, slot: "PanelField", overridesResolver: (_, styles) => styles.panelField })(({ theme }) => ({
  minWidth: 0, '& dt': { ...theme.typography.caption, color: (theme.vars ?? theme).palette.text.secondary, marginBottom: theme.spacing(.5) },
  '& dd': { ...theme.typography.body2, margin: 0, whiteSpace: "pre-wrap" },
  '&[data-centered="true"]': { textAlign: "center", '& dd': { display: "flex", justifyContent: "center", alignItems: "center" } },
  '[data-view="card"] &': { textAlign: "left", '& dt': { display: "inline", ...theme.typography.body2, '&::after': { content: '": "' } }, '& dd': { display: "inline" },
    '&[data-centered="true"]': { textAlign: "left", '& dd': { display: "inline-flex", justifyContent: "flex-start" } } },
}));
export function ResourceDetailPanel({ view = "table", children }: { view?: "table" | "card"; children: ReactNode }) { return <Root data-view={view}>{children}</Root>; }
export function ResourceDetailSection({ title, description, icon, children }: { title: string; description?: string; icon?: ReactNode; children: ReactNode }) {
  return <Section aria-label={title}><Heading>{icon}<div><Typography component="h3" variant="subtitle2">{title}</Typography>{description && <Typography variant="caption" color="text.secondary">{description}</Typography>}</div></Heading><Body>{children}</Body></Section>;
}
export function ResourceDetailFacts({ items }: { items: readonly { label: string; value: ReactNode; center?: boolean }[] }) {
  return <Fields>{items.map(item => <Field key={item.label} data-centered={item.center || undefined}><dt>{item.label}</dt><dd>{item.value ?? "—"}</dd></Field>)}</Fields>;
}
