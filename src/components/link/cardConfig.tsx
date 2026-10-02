"use client";

// src/components/link/cardConfig.tsx

import { Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Download, Eye, FileText } from "lucide-react";
import type { ReactNode } from "react";

import type {
  DataTableCardConfig,
  DataTableRowAction,
} from "@/components/DataTable";

import type {
  PublicDocumentActionDescriptor,
  PublicDocumentActionId,
} from "./documentActions";
import { publicDocumentsSlot } from "./styled";
import type { PublicDocumentRecord } from "./types";

const CardHeader = styled(
  "div",
  publicDocumentsSlot("CardHeader"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

const CardIcon = styled(
  "span",
  publicDocumentsSlot("CardIcon"),
)(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  borderRadius: 8,
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.1),
}));

const CardTitle = styled(
  Typography,
  publicDocumentsSlot("CardTitle"),
)({
  minWidth: 0,
  fontWeight: 700,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const CardBody = styled(
  "div",
  publicDocumentsSlot("CardBody"),
)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  minWidth: 0,
  //   minHeight: "200px",
  //   maxHeight: "400px",
}));

const CardDescription = styled(
  Typography,
  publicDocumentsSlot("CardDescription"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
}));

const CardMeta = styled(
  "div",
  publicDocumentsSlot("CardMeta"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(0.75),
}));

const CardFormatBadge = styled(
  "span",
  publicDocumentsSlot("CardFormatBadge"),
)(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: 4,
  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
  color: theme.vars.palette.primary.main,
  fontFamily: "monospace",
}));

const CardFileSize = styled(
  Typography,
  publicDocumentsSlot("CardFileSize"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
}));

const ACTION_ICONS: Record<PublicDocumentActionId, ReactNode> = {
  view: <Eye size={18} />,
  download: <Download size={18} />,
};

/**
 * Card row actions. They reuse the DataTable's standard row-action
 * contract, which renders icon-only buttons with the label as tooltip and
 * accessible name, and hides an action for rows it does not apply to.
 */
export function createPublicDocumentCardActions(
  actions: readonly PublicDocumentActionDescriptor[],
): readonly DataTableRowAction<PublicDocumentRecord>[] {
  return actions.map((action) => ({
    id: action.id,
    label: action.label,
    color: "error",
    inline: true,
    renderIcon: () => ACTION_ICONS[action.id],
    isHidden: ({ row }) => !action.isAvailable(row.original),
    onClick: ({ row }) => action.run(row.original),
  }));
}

/**
 * Card composition for the public directory. The DataTable owns the card
 * structure, pagination, search and the table/card toggle; this owns only
 * what a document card shows.
 */
export function createPublicDocumentCardConfig(
  actions: readonly PublicDocumentActionDescriptor[],
): DataTableCardConfig<PublicDocumentRecord> {
  return {
    enableSelection: false,
    enableExpansion: false,
    actions: createPublicDocumentCardActions(actions),
    maxInlineActions: actions.length,

    renderHeader: ({ row }) => (
      <CardHeader>
        <CardIcon>
          <FileText size={20} />
        </CardIcon>
        <CardTitle variant="subtitle2">{row.original.title}</CardTitle>
      </CardHeader>
    ),

    renderBody: ({ row }) => (
      <CardBody>
        <CardDescription variant="body2">
          {row.original.description}
        </CardDescription>
        <CardMeta>
          <Chip
            label={row.original.category}
            size="small"
            variant="outlined"
            color="primary"
          />
          {row.original.fileTypes.map((type) => (
            <CardFormatBadge key={type}>{type}</CardFormatBadge>
          ))}
          <CardFileSize variant="caption">{row.original.fileSize}</CardFileSize>
        </CardMeta>
      </CardBody>
    ),
  };
}
