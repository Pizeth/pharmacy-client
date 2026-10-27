"use client";

import { Tooltip } from "@mui/material";
import ViewAgendaOutlined from "@mui/icons-material/ViewAgendaOutlined";
import ViewStreamOutlined from "@mui/icons-material/ViewStreamOutlined";
import { styled } from "@mui/material/styles";

export type CompactCardToggleSlot = "root" | "thumb";
const Root = styled("button", {
  name: "RazethCompactCardToggle", slot: "Root", overridesResolver: (_, styles) => styles.root,
})(({ theme }) => {
  const palette = (theme.vars ?? theme).palette;
  return {
    position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "space-around",
    width: 68, height: 36, padding: 3, flexShrink: 0, borderRadius: 999, cursor: "pointer",
    border: `1px solid ${palette.divider}`, background: palette.background.paper,
    color: palette.text.secondary, boxShadow: palette.customShadows?.neumorphic ?? theme.shadows[1],
    "& > svg": { position: "relative", width: 20, height: 20, zIndex: 1 },
    '&[aria-checked="false"] > svg:first-of-type, &[aria-checked="true"] > svg:last-of-type': { color: palette.primary.main },
    "&:focus-visible": { outline: `2px solid ${palette.primary.main}`, outlineOffset: 3 },
    "&:hover": { borderColor: palette.primary.main },
    '&[aria-checked="true"] > span': { transform: "translateX(30px)" },
  };
});
const Thumb = styled("span", {
  name: "RazethCompactCardToggle", slot: "Thumb", overridesResolver: (_, styles) => styles.thumb,
})(({ theme }) => ({
  position: "absolute", insetInlineStart: 3, top: 3, width: 30, height: 28, borderRadius: 999,
  background: (theme.vars ?? theme).palette.action.selected,
  transition: theme.transitions.create("transform", { duration: 200 }),
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

/** Icon-only normal/compact card switch; the thumb identifies the selected layout. */
export function CompactCardToggle({ checked, onChange }: { readonly checked: boolean; readonly onChange: (checked: boolean) => void }) {
  return <Tooltip title={checked ? "Compact cards · switch to full cards" : "Full cards · switch to compact cards"}>
    <Root type="button" role="switch" aria-label="Compact cards" aria-checked={checked} onClick={() => onChange(!checked)}>
      <Thumb aria-hidden="true" />
      <ViewAgendaOutlined aria-hidden="true" />
      <ViewStreamOutlined aria-hidden="true" />
    </Root>
  </Tooltip>;
}
