"use client";
import { Typography, type TypographyProps } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/system";
export type AdminSocialSlot = "monitorGrid" | "monitorMeters" | "monitorMeter" | "monitorProgress" | "root" | "panel" | "form" | "actions" | "tableContainer" | "overview" | "chartGrid" | "chart" | "metric" | "analyticsHeader" | "metricHeader" | "metricValue" | "metricTrend" | "chartHeader" | "chartLegend" | "profileSettings" | "profileSummary";
function slot(name: Capitalize<AdminSocialSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return { name: "RazethAdminSocial", slot: name, overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) => styles[key] };
}
export const Root = styled("div", slot("Root"))(({ theme }) => ({ display: "grid", gap: theme.spacing(3), paddingBlock: theme.spacing(2) }));
export const Panel = styled("section", slot("Panel"))(({ theme }) => {
  const palette = (theme.vars ?? theme).palette;
  const tint = (color: string, amount: number) => theme.alpha ? theme.alpha(color, amount) : alpha(color, amount);
  return {
    minWidth: 0, padding: theme.spacing(3), borderRadius: 20,
    color: palette.text.primary, backgroundColor: tint(palette.background.paper, 0.94),
    backdropFilter: "blur(18px)", backgroundImage: `linear-gradient(145deg, ${tint(palette.common.white, 0.035)}, transparent 60%)`,
    boxShadow: palette.customShadows?.neumorphic ?? theme.shadows[3], border: `1px solid ${palette.divider}`,
    [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
  };
});
export const Form = styled("form", slot("Form"))(({ theme }) => ({ display: "grid", gap: theme.spacing(2), marginTop: theme.spacing(2) }));
export const Actions = styled("div", slot("Actions"))(({ theme }) => ({ display: "flex", alignItems: "center", flexWrap: "wrap", gap: theme.spacing(1) }));
export const TableContainer = styled("div", slot("TableContainer"))({ overflowX: "auto", maxWidth: "100%" });
export const Overview = styled("div", slot("Overview"))(({ theme }) => ({ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: theme.spacing(2.5), [theme.breakpoints.down("lg")]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, [theme.breakpoints.down("sm")]: { gap: theme.spacing(1.5) } }));
export const ChartGrid = styled("div", slot("ChartGrid"))(({ theme }) => ({ display: "grid", gridTemplateColumns: "minmax(0, 1.65fr) minmax(0, 1fr)", gap: theme.spacing(3), [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0, 1fr)" } }));
export const Chart = styled("svg", slot("Chart"))(({ theme }) => {
  const palette = (theme.vars ?? theme).palette;
  return {
    display: "block", width: "100%", height: "auto", maxHeight: 310, color: palette.info.main, marginTop: theme.spacing(2),
    "& text": { fill: palette.text.primary, fontFamily: theme.typography.fontFamily, fontSize: 13, fontWeight: 500 },
    "& .chart-grid": { stroke: palette.divider, strokeDasharray: "3 5" },
    "& .chart-bar": { fill: palette.info.main }, "& .chart-secondary": { fill: palette.secondary.main },
    "& .monitor-line": { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" }, "& .monitor-area": { fill: "currentColor", opacity: 0.1 }, "&[data-series=memory]": { color: palette.secondary.main }, "&[data-series=network]": { color: palette.success.main }, "& .chart-track": { stroke: palette.action.selected }, "& .chart-ring": { stroke: palette.success.main },
    '& [data-chart-value]': { fontSize: 36, fontWeight: 750, fill: palette.text.primary },
    '& [data-chart-caption]': { fill: palette.text.secondary, fontSize: 12 },
  };
});
export const Metric = styled(Panel, slot("Metric"))(({ theme }) => ({
  display: "grid", gap: theme.spacing(2), alignContent: "start", minHeight: 172,
  "--Admin-metric-accent": (theme.vars ?? theme).palette.info.main,
  '&[data-tone="success"]': { "--Admin-metric-accent": (theme.vars ?? theme).palette.success.main },
  '&[data-tone="secondary"]': { "--Admin-metric-accent": (theme.vars ?? theme).palette.secondary.main },
  '&[data-tone="warning"]': { "--Admin-metric-accent": (theme.vars ?? theme).palette.warning.main },
}));
export const AnalyticsHeader = styled("header", slot("AnalyticsHeader"))(({ theme }) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(2), paddingBottom: theme.spacing(1), color: (theme.vars ?? theme).palette.text.primary }));
export const MetricHeader = styled("div", slot("MetricHeader"))(({ theme }) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: theme.spacing(1), color: (theme.vars ?? theme).palette.text.secondary, '& > svg': { width: 24, height: 24, color: "var(--Admin-metric-accent)", flexShrink: 0 } }));
export const MetricValue = styled(Typography, slot("MetricValue"))<TypographyProps>(({ theme }) => ({ fontFamily: theme.typography.fontFamily, "&&": { fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 750, lineHeight: 1.1, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", color: (theme.vars ?? theme).palette.text.primary } }));
export const MetricTrend = styled("div", slot("MetricTrend"))(({ theme }) => ({ display: "flex", alignItems: "center", gap: theme.spacing(0.5), ...theme.typography.caption, color: (theme.vars ?? theme).palette.text.secondary, '& svg': { width: 15, height: 15, color: "var(--Admin-metric-accent)" } }));
export const ChartHeader = styled("header", slot("ChartHeader"))(({ theme }) => ({ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: theme.spacing(1.5), color: (theme.vars ?? theme).palette.text.primary }));
export const ChartLegend = styled("div", slot("ChartLegend"))(({ theme }) => ({ display: "flex", gap: theme.spacing(2), flexWrap: "wrap", ...theme.typography.caption, color: (theme.vars ?? theme).palette.text.secondary, '& span': { display: "inline-flex", alignItems: "center", gap: theme.spacing(0.75) }, '& span::before': { content: '""', width: 8, height: 8, borderRadius: "50%", backgroundColor: (theme.vars ?? theme).palette.info.main }, '& span[data-series="highlight"]::before': { backgroundColor: (theme.vars ?? theme).palette.secondary.main }, '& span[data-series="coverage"]::before': { backgroundColor: (theme.vars ?? theme).palette.success.main } }));

export const ProfileSettings = styled("details", slot("ProfileSettings"))(({ theme }) => ({ minWidth: 0, color: (theme.vars ?? theme).palette.text.primary, paddingTop: theme.spacing(1), borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}` }));
export const ProfileSummary = styled("summary", slot("ProfileSummary"))(({ theme }) => ({ cursor: "pointer", padding: theme.spacing(2, 0), ...theme.typography.subtitle2, color: (theme.vars ?? theme).palette.text.primary, "&:focus-visible": { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 4, borderRadius: 4 } }));

export const MonitorGrid = styled("div", slot("MonitorGrid"))(({ theme }) => ({ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: theme.spacing(2), marginBlock: theme.spacing(2), [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0, 1fr)" } }));
export const MonitorMeters = styled("div", slot("MonitorMeters"))(({ theme }) => ({ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: theme.spacing(2), marginTop: theme.spacing(2), [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" } }));
export const MonitorMeter = styled("div", slot("MonitorMeter"))(({ theme }) => ({ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: theme.spacing(1), ...theme.typography.body2, color: (theme.vars ?? theme).palette.text.primary }));
export const MonitorProgress = styled("progress", slot("MonitorProgress"))(({ theme }) => ({ appearance: "none", width: "100%", height: 8, gridColumn: "1 / -1", border: 0, borderRadius: 999, overflow: "hidden", background: (theme.vars ?? theme).palette.action.selected, color: (theme.vars ?? theme).palette.info.main, "&::-webkit-progress-bar": { background: (theme.vars ?? theme).palette.action.selected }, "&::-webkit-progress-value": { background: "currentColor", borderRadius: 999 }, "&::-moz-progress-bar": { background: "currentColor", borderRadius: 999 } }));
