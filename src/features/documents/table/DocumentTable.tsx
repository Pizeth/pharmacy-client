"use client";

// src/features/documents/table/DocumentTable.tsx

import { Refresh } from "@mui/icons-material";
import {
  Alert,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { DataTable } from "@/components/DataTable";
import type {
  DataTableCardConfig,
  DataTableDisplayMode,
} from "@/components/DataTable";

import type { DocumentRecord } from "../types";
import { useDocumentDataTable } from "./useDocumentDataTable";

const documentCardConfig: DataTableCardConfig<DocumentRecord> = {
  renderHeader: ({ row }) => (
    <Stack spacing={0.25}>
      <Typography component="strong" variant="subtitle2">
        {row.original.documentNumber}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {row.original.title}
      </Typography>
    </Stack>
  ),

  renderBody: ({ row }) => (
    <Typography variant="body2">
      {row.original.description || "No description"}
    </Typography>
  ),

  renderMetadata: ({ row }) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip
        size="small"
        variant="outlined"
        label={row.original.status}
      />

      <Chip
        size="small"
        variant="outlined"
        label={`${row.original.processingDays} processing days`}
      />

      <Chip
        size="small"
        variant="outlined"
        color={row.original.isEnabled ? "success" : "default"}
        label={row.original.isEnabled ? "Enabled" : "Disabled"}
      />

      <Typography variant="caption" color="text.secondary">
        {new Date(row.original.createdAt).toLocaleString()}
      </Typography>
    </Stack>
  ),
};

export interface DocumentTableProps {
  readonly displayMode?: DataTableDisplayMode;
  readonly defaultDisplayMode?: DataTableDisplayMode;
}

/**
 * Modern Document table renderer.
 *
 * This component deliberately contains only resource presentation choices.
 * Query execution stays in useDocumentDataTable and Refine never enters the
 * generic DataTable renderer.
 */
export function DocumentTable(props: DocumentTableProps) {
  const {
    displayMode,
    defaultDisplayMode,
  } = props;

  const { table, server, refresh } = useDocumentDataTable();

  return (
    <>
      {Boolean(server.refreshError) && (
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={refresh}
            >
              Retry
            </Button>
          }
        >
          The latest document refresh failed. Existing rows are still shown.
        </Alert>
      )}

      <DataTable
        table={table}
        card={documentCardConfig}
        displayMode={displayMode}
        defaultDisplayMode={defaultDisplayMode}
        refreshing={server.isRefreshing}
        toolbar={{
          search: true,
          searchMode: "collapsible",
          defaultSearchOpen: true,
          searchPosition: "center",
          searchPlaceholder: "Search documents…",
          searchDebounceMs: 300,
          enableFilterToggle: true,
          showFilterStatus: true,
          endContent: (
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={refresh}
            >
              Refresh
            </Button>
          ),
        }}
        pagination={{}}
      />
    </>
  );
}
