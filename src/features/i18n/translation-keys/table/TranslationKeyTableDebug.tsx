"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";

/**
 * Temporary integration diagnostic.
 *
 * This is NOT the final table renderer.
 *
 * Delete it once the existing Phase 1.5 renderer is attached.
 */
export function TranslationKeyTableDebug() {
  const { table, query, server, refresh } = useTranslationKeyDataTable();

  return (
    <Stack spacing={2}>
      <Box>
        <Button
          variant="outlined"
          onClick={refresh}
          disabled={server.isFetching}
        >
          Refresh
        </Button>
      </Box>

      {server.isInitialLoading ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={20} />

          <Typography>Loading translations…</Typography>
        </Stack>
      ) : null}

      {server.blockingError ? (
        <Alert severity="error">Failed to load translations.</Alert>
      ) : null}

      {server.refreshError ? (
        <Alert severity="warning">
          Refresh failed. Existing rows are still available.
        </Alert>
      ) : null}

      <Box
        component="pre"
        sx={{
          overflow: "auto",

          p: 2,

          bgcolor: "action.hover",
        }}
      >
        {JSON.stringify(
          {
            rowCount: server.rows.length,

            pagination: server.pagination,

            query: query.state,

            tableRowCount: table.getRowModel().rows.length,

            lifecycle: {
              hasResult: server.hasResult,

              isPreviousResult: server.isPreviousResult,

              isInitialLoading: server.isInitialLoading,

              isFetching: server.isFetching,

              isRefreshing: server.isRefreshing,

              isEmpty: server.isEmpty,
            },
          },
          null,
          2,
        )}
      </Box>
    </Stack>
  );
}
