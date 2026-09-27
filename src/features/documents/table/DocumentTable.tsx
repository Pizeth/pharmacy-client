"use client";

// src/features/documents/table/DocumentTable.tsx

import { Refresh } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";

import { DataTable } from "@/components/DataTable";

import { useDocumentDataTable } from "./useDocumentDataTable";

/**
 * Modern Document table renderer.
 *
 * This component deliberately contains only resource presentation choices.
 * Query execution stays in useDocumentDataTable and Refine never enters the
 * generic DataTable renderer.
 */
export function DocumentTable() {
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
