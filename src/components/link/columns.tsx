"use client";

// src/components/link/columns.tsx

import { Box, Button, Chip, Stack, Typography, styled } from "@mui/material";
import { Download, FileText } from "lucide-react";

import { createMuiDataTableColumnHelper } from "@/components/DataTable";

import type { PublicDocumentRecord } from "./types";

const FormatBadge = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: 4,
  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
  color: theme.vars.palette.primary.main,
  fontFamily: "monospace",
}));

const columnHelper = createMuiDataTableColumnHelper<PublicDocumentRecord>();

/**
 * Column definitions for the public directory.
 *
 * The first column is an accessor returning "title id description" so
 * the toolbar search matches all three even though only the title and
 * description are displayed.
 */
export function createPublicDocumentColumns(
  onOpenDocument: (doc: PublicDocumentRecord) => void,
) {
  return columnHelper.columns([
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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                borderRadius: 2,
                display: "flex",
                color: "primary.main",
                // ml: `calc(1.5 * var(--app-spacing))`,
                bgcolor: (theme) =>
                  theme.alpha(theme.vars.palette.primary.main, 0.1),
              }}
            >
              <FileText size={20} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {row.original.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="0.75rem"
              >
                {row.original.description}
              </Typography>
            </Box>
          </Stack>
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
        <Chip
          label={getValue()}
          size="small"
          variant="outlined"
          color="error"
        />
      ),
    }),

    columnHelper.display({
      id: "fileSpecs",
      header: "ទំហំឯកសារ",
      size: 200,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.75}>
          {row.original.fileTypes.map((type) => (
            <FormatBadge key={type}>{type}</FormatBadge>
          ))}
          <Typography variant="caption" color="text.secondary">
            {row.original.fileSize}
          </Typography>
        </Box>
      ),
    }),

    columnHelper.display({
      id: "action",
      header: "ជម្រើស",
      size: 160,
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => (
        <Button
          variant="contained"
          size="small"
          disableElevation
          startIcon={<Download size={14} color="white" />}
          onClick={() => onOpenDocument(row.original)}
          color="error"
          //   sx={{ textTransform: "none", fontWeight: 400, borderRadius: 1.5 }}
        >
          <Typography variant="body2" fontWeight={500} color="white">
            ទាញយកឯកសារ
          </Typography>
        </Button>
      ),
    }),
  ]);
}
