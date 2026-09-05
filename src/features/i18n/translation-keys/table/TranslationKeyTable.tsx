"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { Refresh } from "@mui/icons-material";

import { DataTable } from "@/components/DataTable";

import { TranslationKeyApiError } from "../api";

import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";

/**
 * Convert an erased request/runtime error into appropriate UI text.
 *
 * The error remains `unknown` throughout the generic server lifecycle;
 * interpretation belongs here at the application/resource boundary.
 */
function getTranslationKeyTableErrorMessage(error: unknown): string {
  if (error instanceof TranslationKeyApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load translation keys.";
}

/**
 * First real production resource using the custom TanStack v9 + MUI
 * DataTable stack.
 */
export function TranslationKeyTable() {
  const { table, server, refresh } = useTranslationKeyDataTable();

  /**
   * ================================================================
   * Initial blocking load
   * ================================================================
   *
   * Do not render the empty table for the first request.
   *
   * Once a successful result exists, later requests stay inside the
   * DataTable and use its non-blocking refresh indicator instead.
   */
  if (server.isInitialLoading) {
    return (
      <Paper
        variant="outlined"
        sx={{
          minHeight: 360,

          display: "grid",

          placeItems: "center",

          p: 4,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />

          <Typography variant="body2" color="text.secondary">
            Loading translation keys…
          </Typography>
        </Stack>
      </Paper>
    );
  }

  /**
   * ================================================================
   * Blocking failure
   * ================================================================
   *
   * No usable result exists yet.
   */
  if (server.blockingError) {
    return (
      <Alert
        severity="error"
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
        {getTranslationKeyTableErrorMessage(server.blockingError)}
      </Alert>
    );
  }

  /**
   * ================================================================
   * Usable table
   * ================================================================
   *
   * At this point:
   *
   *   server.rows
   *
   * is either:
   *
   *   - the current successful page
   *   - the preserved previous page during a replacement request
   *
   * The renderer remains unaware of HTTP and query execution details.
   */
  return (
    <Stack
      spacing={1}
      sx={{
        minWidth: 0,
      }}
    >
      {server.refreshError ? (
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
          {getTranslationKeyTableErrorMessage(server.refreshError)}
        </Alert>
      ) : null}

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <DataTable
          table={table}
          /**
           * Use the renderer's built-in non-blocking refresh indicator.
           *
           * When no explicit percentage is supplied, your renderer's
           * DataTableRefreshingIndicator already uses its simulated
           * YouTube/NProgress-style trickle.
           */
          refreshing={server.isRefreshing}
          /**
           * Standard toolbar is now connected to the REAL table.
           *
           * We will customize its resource-specific controls in
           * Phase 1.7.10.5.
           */
          toolbar
          /**
           * Real server-backed pagination.
           */
          pagination={{}}
          /**
           * No row bulk-selection UX for TranslationKey yet.
           */
          selectionBar={false}
          /**
           * We intentionally keep the filter row hidden until the
           * resource-aware category/locale controls are implemented.
           */
          showColumnFilters={false}
          /**
           * Sticky headers are now safe to enable through the renderer's
           * forwarded MUI Table props.
           */
          tableProps={{
            stickyHeader: true,
          }}
          /**
           * Give the scrolling viewport useful vertical room without
           * forcing page-specific dimensions into the generic renderer.
           */
          containerProps={{
            sx: {
              maxHeight: "calc(100vh - 240px)",

              minHeight: 320,
            },
          }}
        />
      </Box>
    </Stack>
  );
}
