"use client";

// src/features/hrd/documents/columns/publicDocumentColumns.tsx

// import { Box, Button, Chip, Stack, Typography, styled } from "@mui/material";
// import { Download, FileText } from "lucide-react";

// import { createMuiDataTableColumnHelper } from "@/components/DataTable/index";

// import type { PublicDocumentRecord } from "../../types/publicDocuments.types";

// const FormatBadge = styled("span")(({ theme }) => ({
//   fontSize: "0.6875rem",
//   fontWeight: 700,
//   padding: "2px 6px",
//   borderRadius: 4,
//   backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
//   color: theme.vars.palette.primary.main,
//   fontFamily: "monospace",
// }));

import { Button, Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Download, Eye, FileText } from "lucide-react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import type { ReactNode } from "react";

import { createMuiDataTableColumnHelper } from "@/components/DataTable/index";

import type {
  PublicDocumentActionDescriptor,
  PublicDocumentActionId,
} from "../actions/documentActions";
import { PublicDocumentRowNumberCell } from "./RowNumberCell";
import { FileTypeBadge } from "../components/FileTypeBadge";
import { publicDocumentsSlot } from "../../styles/styled";
import type { PublicDocumentRecord } from "../../types/publicDocuments.types";

// const FormatBadge = styled(
//   "span",
//   publicDocumentsSlot("FormatBadge"),
// )(({ theme }) => ({
//   fontSize: "0.6875rem",
//   fontWeight: 700,
//   padding: "2px 6px",
//   borderRadius: 4,
//   backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
//   color: theme.vars.palette.primary.main,
//   fontFamily: "monospace",
// }));

const DocumentCell = styled(
  "div",
  publicDocumentsSlot("DocumentCell"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const DocumentIcon = styled(
  "span",
  publicDocumentsSlot("DocumentIcon"),
)(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  borderRadius: 8,
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.1),
}));

const DocumentText = styled(
  "div",
  publicDocumentsSlot("DocumentText"),
)({
  minWidth: 0,
});

const DocumentTitle = styled(
  Typography,
  publicDocumentsSlot("DocumentTitle"),
)({
  fontWeight: 600,
});

const DocumentDescription = styled(
  Typography,
  publicDocumentsSlot("DocumentDescription"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
  fontSize: theme.typography.pxToRem(12),
}));

const FileSpecsRoot = styled(
  "div",
  publicDocumentsSlot("FileSpecs"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(0.75),
}));

const FileSize = styled(
  Typography,
  publicDocumentsSlot("FileSize"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
}));

const ActionsRoot = styled(
  "div",
  publicDocumentsSlot("Actions"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  "& .MuiButtonBase-root.MuiButton-root": {
    color: theme.vars.palette.common.white,
  },
}));

const ActionLabel = styled(
  "span",
  publicDocumentsSlot("ActionLabel"),
)(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: 500,
}));

const ACTION_ICONS: Record<PublicDocumentActionId, ReactNode> = {
  view: <VisibilityOutlinedIcon fontSize="small" />,
  download: <CloudDownloadOutlinedIcon fontSize="small" />,
};

interface PublicDocumentActionButtonsProps {
  readonly doc: PublicDocumentRecord;
  readonly actions: readonly PublicDocumentActionDescriptor[];
}

/**
 * Labelled action buttons for the table row. Only the actions that apply to
 * this document's link / file type are rendered (see documentActions.ts).
 */
function PublicDocumentActionButtons(props: PublicDocumentActionButtonsProps) {
  const { doc, actions } = props;

  const available = actions.filter((action) => action.isAvailable(doc));

  if (available.length === 0) {
    return null;
  }

  return (
    <ActionsRoot>
      {available.map((action) => (
        <Button
          key={action.id}
          variant={action.id === "download" ? "contained" : "outlined"}
          color="error"
          size="small"
          disableElevation
          startIcon={ACTION_ICONS[action.id]}
          onClick={() => action.run(doc)}
        >
          <ActionLabel>{action.label}</ActionLabel>
        </Button>
      ))}
    </ActionsRoot>
  );
}

const columnHelper = createMuiDataTableColumnHelper<PublicDocumentRecord>();

/**
 * Column definitions for the public directory.
 *
 * The first column is an accessor returning "title id description" so
 * the toolbar search matches all three even though only the title and
 * description are displayed.
 */
export function createPublicDocumentColumns(
  // onOpenDocument: (doc: PublicDocumentRecord) => void,
  actions: readonly PublicDocumentActionDescriptor[],
) {
  return columnHelper.columns([
    /**
     * Sequential number across pages, like /admin/i18n. Presentation only:
     * never sortable, filterable, hideable or resizable.
     */
    columnHelper.display({
      id: "rowNumber",
      header: "ល.រ",
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableResizing: false,
      size: 50,
      minSize: 35,
      maxSize: 65,
      meta: {
        align: "center",
        headerAlign: "center",
        enableColumnMenu: false,
      },
      cell: ({ row }) => <PublicDocumentRowNumberCell rowId={row.id} />,
    }),

    columnHelper.accessor(
      (row) => `${row.title} ${row.id} ${row.description}`,
      {
        id: "document",
        header: "ឈ្មោះឯកសារ",
        size: 640,
        minSize: 320,
        maxSize: 4000,
        enableSorting: false,
        cell: ({ row }) => (
          <DocumentCell>
            <DocumentIcon>
              <FileText size={20} />
            </DocumentIcon>
            <DocumentText>
              <DocumentTitle variant="subtitle2">
                {row.original.title}
              </DocumentTitle>
              <DocumentDescription variant="body2">
                {row.original.description}
              </DocumentDescription>
            </DocumentText>
          </DocumentCell>
        ),
      },
    ),

    columnHelper.accessor("category", {
      id: "category",
      header: "ប្រភេទឯកសារ",
      size: 200,
      enableSorting: true,
      sortFn: "alphanumeric",
      enableGlobalFilter: false,
      filterFn: "equals",
      meta: { align: "center", headerAlign: "center" },
      cell: ({ getValue }) => (
        <Chip label={getValue()} size="small" variant="outlined" />
      ),
    }),

    columnHelper.display({
      id: "fileSpecs",
      header: "ទំហំឯកសារ",
      size: 200,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <FileSpecsRoot>
          {row.original.fileTypes.map((type) => (
            <FileTypeBadge key={type} type={type} />
          ))}
          <FileSize variant="caption">{row.original.fileSize}</FileSize>
        </FileSpecsRoot>
      ),
    }),

    columnHelper.display({
      id: "action",
      header: "ជម្រើស",
      size: 320,
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => (
        <PublicDocumentActionButtons doc={row.original} actions={actions} />
      ),
    }),
  ]);
}
