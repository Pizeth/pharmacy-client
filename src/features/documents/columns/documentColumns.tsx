import {
  Chip,
  Typography,
} from "@mui/material";

import {
  createMuiDataTableColumnHelper,
  DataTableRowNumberCell,
} from "@/components/DataTable";
import type { DocumentTableRecord } from "../types";

export const DOCUMENT_COLUMN_IDS = {
  rowNumber: "rowNumber",
  documentNumber: "documentNumber",
  title: "title",
  status: "status",
  processingDays: "processingDays",
  isEnabled: "isEnabled",
  createdAt: "createdAt",
} as const;

const columnHelper =
  createMuiDataTableColumnHelper<DocumentTableRecord>();

/**
 * Modern Document column family.
 *
 * This deliberately mirrors only capabilities already declared in
 * documentTableSemanticQuery.
 *
 * Any column marked sortable/filterable here must have a server mapping.
 */
export function createDocumentColumns() {
  return columnHelper.columns([
    columnHelper.display({
      id: DOCUMENT_COLUMN_IDS.rowNumber,
      header: "No.",
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
      enableResizing: false,
      size: 64,
      minSize: 56,
      maxSize: 72,
      meta: {
        align: "center",
        headerAlign: "center",
        enableColumnMenu: false,
      },
      cell: ({ row }) => (
        <DataTableRowNumberCell rowIndex={row.index} />
      ),
    }),

    columnHelper.accessor("documentNumber", {
      id: DOCUMENT_COLUMN_IDS.documentNumber,
      header: "Document No.",
      enableSorting: true,
      enableColumnFilter: true,
      size: 180,
      minSize: 140,
      meta: {
        filterVariant: "text",
        filterLabel: "Document number contains",
      },
      cell: ({ getValue }) => (
        <Typography component="span" variant="body2" noWrap>
          {getValue()}
        </Typography>
      ),
    }),

    columnHelper.accessor("title", {
      id: DOCUMENT_COLUMN_IDS.title,
      header: "Title",
      enableSorting: true,
      enableColumnFilter: true,
      size: 360,
      minSize: 220,
      meta: {
        filterVariant: "text",
        filterLabel: "Title contains",
      },
      cell: ({ getValue }) => (
        <Typography component="span" variant="body2" noWrap>
          {getValue()}
        </Typography>
      ),
    }),

    columnHelper.accessor("status", {
      id: DOCUMENT_COLUMN_IDS.status,
      header: "Status",
      enableSorting: true,
      enableColumnFilter: true,
      size: 150,
      minSize: 120,
      meta: {
        align: "center",
        filterVariant: "text",
        filterLabel: "Status",
      },
      cell: ({ getValue }) => (
        <Chip
          label={getValue()}
          size="small"
          variant="outlined"
        />
      ),
    }),

    columnHelper.accessor("processingDays", {
      id: DOCUMENT_COLUMN_IDS.processingDays,
      header: "Days",
      enableSorting: false,
      enableColumnFilter: true,
      size: 110,
      minSize: 90,
      meta: {
        align: "center",
        filterVariant: "range",
        filterLabel: "Processing days",
      },
    }),

    columnHelper.accessor("isEnabled", {
      id: DOCUMENT_COLUMN_IDS.isEnabled,
      header: "Enabled",
      enableSorting: false,
      enableColumnFilter: true,
      size: 120,
      minSize: 100,
      meta: {
        align: "center",
        filterVariant: "select",
        filterLabel: "Enabled",
        filterOptions: [
          {
            label: "Enabled",
            value: true,
          },
          {
            label: "Disabled",
            value: false,
          },
        ],
      },
      cell: ({ getValue }) => (
        <Chip
          label={getValue() ? "Enabled" : "Disabled"}
          size="small"
          color={getValue() ? "success" : "default"}
          variant="outlined"
        />
      ),
    }),

    columnHelper.accessor("createdAt", {
      id: DOCUMENT_COLUMN_IDS.createdAt,
      header: "Created",
      enableSorting: true,
      enableColumnFilter: false,
      size: 190,
      minSize: 170,
      cell: ({ getValue }) => (
        <Typography component="span" variant="body2" noWrap>
          {new Date(getValue()).toLocaleString()}
        </Typography>
      ),
    }),
  ]);
}
