"use client";
import { Chip, Stepper } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/system";
export type DocumentTrackingSlot =
  | "root"
  | "panel"
  | "actions"
  | "fieldGrid"
  | "form"
  | "progress"
  | "facts"
  | "fact"
  | "timeline"
  | "event"
  | "eventIcon"
  | "eventHeading"
  | "detailGrid"
  | "status";
function slot(name: Capitalize<DocumentTrackingSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return {
    name: "RazethDocumentTracking",
    slot: name,
    overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) =>
      styles[key],
  };
}
export const Root = styled(
  "div",
  slot("Root"),
)(({ theme }) => ({ display: "grid", gap: theme.spacing(3), minWidth: 0 }));
export const Panel = styled(
  "section",
  slot("Panel"),
)(({ theme }) => ({
  padding: theme.spacing(2.5),
  minWidth: 0,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  borderRadius: 16,
  color: (theme.vars ?? theme).palette.text.primary,
  background: "transparent",
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));
export const Actions = styled(
  "div",
  slot("Actions"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));
export const FieldGrid = styled(
  "div",
  slot("FieldGrid"),
)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing(2),
  minWidth: 0,
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
export const Form = styled(
  "form",
  slot("Form"),
)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2.5),
  paddingTop: theme.spacing(1),
  minWidth: 0,
}));
export const Progress = styled(
  Stepper,
  slot("Progress"),
)(({ theme }) => ({
  marginBlock: theme.spacing(3),
  minWidth: 0,
  "& .MuiStepLabel-label": { fontWeight: 600, overflowWrap: "anywhere" },
  "& .MuiStepLabel-labelContainer": { minWidth: 0 },
  "& .MuiStepLabel-label.Mui-active": {
    color: (theme.vars ?? theme).palette.info.main,
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: (theme.vars ?? theme).palette.success.main,
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: (theme.vars ?? theme).palette.info.main,
  },
  '&[data-compact="true"]': { marginBlock: theme.spacing(1) },
}));
export const Facts = styled(
  "dl",
  slot("Facts"),
)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: theme.spacing(1.5, 3),
  margin: 0,
  '&[data-compact="true"]': { gridTemplateColumns: "minmax(0,1fr)" },
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0,1fr)" },
}));
export const Fact = styled(
  "div",
  slot("Fact"),
)(({ theme }) => ({
  minWidth: 0,
  overflowWrap: "anywhere",
  "& dt, & dd": { display: "inline", margin: 0, ...theme.typography.body2 },
  "& dt": {
    fontWeight: 600,
    color: (theme.vars ?? theme).palette.text.secondary,
  },
  "& dt::after": { content: '": "' },
}));
export const Timeline = styled(
  "ol",
  slot("Timeline"),
)(({ theme }) => ({
  listStyle: "none",
  padding: 0,
  margin: theme.spacing(2, 0, 0),
  display: "grid",
  gap: theme.spacing(2.5),
}));
export const Event = styled(
  "li",
  slot("Event"),
)(({ theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "36px minmax(0,1fr)",
  gap: theme.spacing(1.5),
  "&:not(:last-child)::after": {
    content: '""',
    position: "absolute",
    insetInlineStart: 17,
    top: 40,
    bottom: -16,
    width: 2,
    background: (theme.vars ?? theme).palette.divider,
  },
}));
export const EventIcon = styled(
  "span",
  slot("EventIcon"),
)(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  width: 36,
  height: 36,
  borderRadius: "50%",
  color: (theme.vars ?? theme).palette.info.main,
  background: (theme.vars ?? theme).palette.action.selected,
  "& > svg": { width: 20, height: 20 },
  '&[data-kind="COMPLETED"]': {
    color: (theme.vars ?? theme).palette.success.main,
  },
  '&[data-kind="RETURNED"], &[data-kind="HELD"]': {
    color: (theme.vars ?? theme).palette.warning.main,
  },
  '&[data-kind="CANCELLED"]': {
    color: (theme.vars ?? theme).palette.error.main,
  },
}));
export const EventHeading = styled(
  "div",
  slot("EventHeading"),
)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: theme.spacing(0.5, 2),
}));
export const DetailGrid = styled(
  "div",
  slot("DetailGrid"),
)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
  gap: theme.spacing(3),
  '&[data-compact="true"]': { gridTemplateColumns: "minmax(0,1fr)" },
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0,1fr)" },
}));
export const Status = styled(
  Chip,
  slot("Status"),
)(({ theme }) => {
  const palette = (theme.vars ?? theme).palette;
  const tint = (value: string) =>
    theme.alpha ? theme.alpha(value, 0.13) : alpha(value, 0.13);
  return {
    borderRadius: 999,
    fontWeight: 600,
    color: palette.info.main,
    background: tint(palette.info.main),
    '&[data-status="ON_HOLD"]': {
      color: palette.warning.main,
      background: tint(palette.warning.main),
    },
    '&[data-status="COMPLETED"]': {
      color: palette.success.main,
      background: tint(palette.success.main),
    },
    '&[data-status="CANCELLED"]': {
      color: palette.error.main,
      background: tint(palette.error.main),
    },
  };
});
