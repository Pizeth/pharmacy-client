"use client";

import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

/**
 * Styled slots shared by every card structure (inline detail and flip).
 *
 * Each one is registered under DATA_TABLE_COMPONENT_NAME so it stays
 * themeable through theme.components.RazethDataTable.styleOverrides.
 */

export const CardItemRoot = styled(Paper, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardItem",
  overridesResolver: (_props, styles) => styles.cardItem,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  overflow: "hidden",
  backgroundImage: "none",
  '&&[data-card-side="back"]': {
    height: "auto",
    maxHeight: "none",
    [`& .${dataTableClasses.cardDetail}`]: {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  },
  '&&[data-compact="true"]': {
    height: "auto",
    minHeight: 72,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    alignItems: "center",
    [`& > .${dataTableClasses.cardHeader}, & > .${dataTableClasses.cardBody}`]: {
      minHeight: 72,
      boxSizing: "border-box",
      border: 0,
      backgroundColor: "transparent",
      padding: theme.spacing(1.5, 2),
    },
    [`& > .${dataTableClasses.cardHeader} .${dataTableClasses.cardFlipControl}`]: {
      alignSelf: "center",
      alignItems: "center",
    },
    [`& > .${dataTableClasses.cardActions}`]: {
      gridColumn: 2,
      gridRow: 1,
      marginTop: 0,
      border: 0,
      backgroundColor: "transparent",
      padding: theme.spacing(1, 1.5),
    },
    [`& > .${dataTableClasses.cardExpansion}`]: {
      padding: theme.spacing(1),
    },
    [`& > .${dataTableClasses.cardDetail}`]: {
      gridColumn: "1 / -1",
      gridRow: 2,
    },
  },
  '&[data-selected="true"]': {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: -2,
  },
}));

export const CardHeaderRoot = styled("header", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardHeader",
  overridesResolver: (_props, styles) => styles.cardHeader,
})(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  minWidth: 0,
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
}));

export const CardHeaderContentRoot = styled("div")({
  flex: 1,
  minWidth: 0,
});

export const CardSelectionRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardSelection",
  overridesResolver: (_props, styles) => styles.cardSelection,
})({
  display: "inline-flex",
  flexShrink: 0,
});

export const CardBodyRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardBody",
  overridesResolver: (_props, styles) => styles.cardBody,
})(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: 0,
}));

export const CardMetadataRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardMetadata",
  overridesResolver: (_props, styles) => styles.cardMetadata,
})(({ theme }) => ({
  padding: theme.spacing(0, 2, 2),
  minWidth: 0,
}));

export const CardActionsRoot = styled("footer", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardActions",
  overridesResolver: (_props, styles) => styles.cardActions,
})(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
}));

export const CardExpansionRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardExpansion",
  overridesResolver: (_props, styles) => styles.cardExpansion,
})(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 2, 1),
}));

export const CardDetailRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardDetail",
  overridesResolver: (_props, styles) => styles.cardDetail,
})(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  minWidth: 0,
}));

export function hasRenderableContent(content: ReactNode): boolean {
  return content !== null && content !== undefined && content !== false;
}
