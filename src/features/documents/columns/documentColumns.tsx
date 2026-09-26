"use client";

// src/features/documents/columns/documentColumns.tsx

import { Chip, Typography } from "@mui/material";

import {
  DataTableRowNumberCell,
  createMuiDataTableColumnHelper,
} from "@/components/DataTable";

import {
  DOCUMENT_COLUMN_IDS,
  type DocumentRecord,
} from "../types";

const columnHelper = createMuiDataTableColumnHelper<DocumentRecord>();

/**
 * Status values currently used by the legacy FTS presentation.
 *
 * Keeping them resource-local prevents the generic DataTable from acquiring
 * workflow-specific knowledge.
 */
export const DOCUMENT_STATUS_FILTER_OPTIONS = [
  {
    label: "ធម្មតា",
    value: "ធម្មតា",
  },
  {
    label: "ប្រញ៉ាប់",
    value: "ប្រញ៉ាប់",
  },
  {
    label: "ប្រញ៉ាប់ណាស់",
    value: "ប្រញ៉ាប់ណាស់",
  },
] as const;

/**
 * Pure Document column family.
 *
 * Server capability parity:
 *
 *                         sort     filter
 * ------------------------------------------------
 * documentNumber           yes       contains
 * title                    yes       contains
 * description               no       contains
 * status                   yes       equals
 * processingDays            no       number-range
 * isEnabled                 no       boolean
 * createdAt                yes       no
 *
 * These capabilities intentionally mirror documentTableSemanticQuery.
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
      size: 320,
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

    columnHelper.accessor("description", {
      id: DOCUMENT_COLUMN_IDS.description,
      header: "Description",
      enableSorting: false,
      enableColumnFilter: false,
      size: 320,
      minSize: 220,
      cell: ({ getValue }) => (
        <Typography
          component="span"
          variant="body2"
          color={getValue() ? "text.primary" : "text.secondary"}
          noWrap
        >
          {getValue() || "—"}
        </Typography>
      ),
    }),

    columnHelper.accessor("status", {
      id: DOCUMENT_COLUMN_IDS.status,
      header: "Status",
      enableSorting: true,
      enableColumnFilter: true,
      size: 160,
      minSize: 130,
      meta: {
        align: "center",
        headerAlign: "center",
        filterVariant: "select",
        filterLabel: "Status",
        filterOptions: DOCUMENT_STATUS_FILTER_OPTIONS,
      },
      cell: ({ getValue }) => (
        <Chip
          size="small"
          variant="outlined"
          label={getValue()}
        />
      ),
    }),

    columnHelper.accessor("processingDays", {
      id: DOCUMENT_COLUMN_IDS.processingDays,
      header: "Processing days",
      enableSorting: false,
      enableColumnFilter: true,
      size: 170,
      minSize: 150,
      meta: {
        align: "center",
        headerAlign: "center",
        filterVariant: "number-range",
        filterLabel: "Processing days",
      },
    }),

    columnHelper.accessor("isEnabled", {
      id: DOCUMENT_COLUMN_IDS.isEnabled,
      header: "Enabled",
      enableSorting: false,
      enableColumnFilter: true,
      size: 130,
      minSize: 110,
      meta: {
        align: "center",
        headerAlign: "center",
        filterVariant: "boolean",
        filterLabel: "Enabled",
      },
      cell: ({ getValue }) => (
        <Chip
          size="small"
          variant="outlined"
          color={getValue() ? "success" : "default"}
          label={getValue() ? "Enabled" : "Disabled"}
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
      cell: ({ getValue }) => {
        const value = getValue();
        const date = new Date(value);

        return (
          <Typography component="span" variant="body2" noWrap>
            {Number.isNaN(date.getTime())
              ? value
              : date.toLocaleString()}
          </Typography>
        );
      },
    }),
  ]);
}
