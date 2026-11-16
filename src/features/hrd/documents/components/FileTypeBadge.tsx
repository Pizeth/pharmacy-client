"use client";

// src/features/hrd/documents/components/FileTypeBadge.tsx

import { styled } from "@mui/material/styles";

import { FILE_TYPE_TONES, getFileTypeCategory } from "../utils/fileTypes";
import type { FileTypeTone } from "../utils/fileTypes";
import { publicDocumentsSlot } from "../../styles/styled";

interface BadgeRootProps {
  readonly tone: FileTypeTone;
}

/**
 * Colours come from the theme palette, so they follow light/dark mode.
 *
 * The text is the palette colour mixed 40% toward black (light mode) or
 * white (dark mode). The plain palette colour on a tinted background is
 * too faint for 11px text (about 2.2:1 for warning in light mode); the mix
 * keeps every tone above 4.5:1 while the tint and border carry the hue.
 */
const BadgeRoot = styled("span", {
  ...publicDocumentsSlot("FileTypeBadge"),
  shouldForwardProp: (prop) => prop !== "tone",
})<BadgeRootProps>(({ theme, tone }) => {
  const base = {
    display: "inline-block",
    fontSize: "0.6875rem",
    fontWeight: 700,
    lineHeight: 1.5,
    padding: "1px 6px",
    borderRadius: 4,
    fontFamily: "monospace",
  };

  if (tone === "neutral") {
    return {
      ...base,
      color: theme.vars.palette.text.secondary,
      backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.08),
      border: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.2)}`,
    };
  }

  const main = theme.vars.palette[tone].main;

  return {
    ...base,
    color: `color-mix(in srgb, ${main} 60%, black)`,
    backgroundColor: theme.alpha(main, 0.12),
    border: `1px solid ${theme.alpha(main, 0.4)}`,
    ...theme.applyStyles("dark", {
      color: `color-mix(in srgb, ${main} 60%, white)`,
    }),
  };
});

export interface FileTypeBadgeProps {
  /**
   * The format label as written in the data, e.g. "PDF" or "docx".
   */
  readonly type: string;
}

/**
 * One file-format badge, coloured by the kind of file:
 * pdf = primary, document = secondary, image = warning, spreadsheet = success,
 * archive = neutral, anything else = neutral (see FILE_TYPE_TONES).
 */
export function FileTypeBadge(props: FileTypeBadgeProps) {
  const { type } = props;

  const category = getFileTypeCategory(type);

  return (
    <BadgeRoot
      tone={FILE_TYPE_TONES[category]}
      data-file-type-category={category}
      data-tone={FILE_TYPE_TONES[category]}
    >
      {type}
    </BadgeRoot>
  );
}
