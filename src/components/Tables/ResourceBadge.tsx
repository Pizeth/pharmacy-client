"use client";
import { Chip, type ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import { resourceBadgeStyles } from "./resourceBadgeStyles";

export const ResourceBadge = styled(Chip, { name: "RazethResourceBadge", slot: "Root", overridesResolver: (_, styles) => styles.root })(({ theme, color }) => {
  const palette = (theme.vars ?? theme).palette;
  const tones = { primary: palette.primary.main, secondary: palette.secondary.main, success: palette.success.main, warning: palette.warning.main, error: palette.error.main, info: palette.info.main };
  const main = color && color in tones ? tones[color as keyof typeof tones] : undefined;
  return { "&&": { ...resourceBadgeStyles(theme, main), height: "auto", '& .MuiChip-label': { padding: 0, overflowWrap: "anywhere" }, '& .MuiChip-icon': { width: 14, height: 14, margin: 0, color: "inherit" } } };
});
export function ResourceStatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive", inactiveColor = "default" }: {
  readonly active: boolean; readonly activeLabel?: string; readonly inactiveLabel?: string; readonly inactiveColor?: ChipProps["color"];
}) {
  return <ResourceBadge size="small" color={active ? "success" : inactiveColor} label={active ? activeLabel : inactiveLabel} icon={active ? <CheckOutlined /> : <BlockOutlined />} />;
}
