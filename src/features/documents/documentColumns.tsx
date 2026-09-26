import { Chip, Typography } from "@mui/material";

import {
  createMuiDataTableColumnHelper,
} from "@/components/DataTable";
import type {
  MuiDataTableFilterOption,
} from "@/components/DataTable";
import type { DocumentTableRecord } from "./types";

/**
 * Keep the first modern Document proof aligned with the status vocabulary used
 * by the existing FTS/MRT screen.
 *
 * These are presentation/filter options only. The generic DataTable and Refine
 * adapter remain unaware of this resource vocabulary.
 */
export const DOCUMENT_STATUS_FILTER_OPTIONS =
  [
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
  ] satisfies readonly MuiDataTableFilterOption[];

const columnHelper =
  createMuiDataTableColumnHelper<DocumentTableRecord>();

/**
 * Modern Document column family.
 *
 * The important proof in 1.8.4 is not visual parity with the legacy MRT table.
 * It is that a second resource can declare normal MUI DataTable columns while
 * reusing the same server/query/transport architecture already proven by
 * TranslationKey.
 */
export const documentColumns = columnHelper.columns([
  columnHelper.accessor("documentNumber", {
    id: "documentNumber",
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
    id: "title",
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
    id: "status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: true,
    size: 160,
    minSize: 120,
    meta: {
      align: "center",
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
    id: "processingDays",
    header: "Processing days",

    /**
     * The current document semantic mapping supports filtering but does not
     * expose processingDays as a server-sort field.
     */
    enableSorting: false,
    enableColumnFilter: true,
    size: 160,
    minSize: 130,
    meta: {
      align: "center",
      filterVariant: "number-range",
      filterLabel: "Processing days",
    },
  }),

  columnHelper.accessor("isEnabled", {
    id: "isEnabled",
    header: "Enabled",

    /**
     * Same capability split as processingDays:
     *
     * - boolean filter supported
     * - server sorting intentionally unsupported
     */
    enableSorting: false,
    enableColumnFilter: true,
    size: 120,
    minSize: 100,
    meta: {
      align: "center",
      filterVariant: "boolean",
      filterLabel: "Enabled",
    },
    cell: ({ getValue }) => (
      <Typography component="span" variant="body2">
        {getValue() ? "Yes" : "No"}
      </Typography>
    ),
  }),

  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: "Created",
    enableSorting: true,

    /**
     * Date filtering remains out of scope until the generic date/date-range
     * server protocol exists.
     */
    enableColumnFilter: false,
    size: 200,
    minSize: 170,
    cell: ({ getValue }) => (
      <Typography component="span" variant="body2" noWrap>
        {new Date(getValue()).toLocaleString()}
      </Typography>
    ),
  }),
]);
