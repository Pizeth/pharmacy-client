"use client";

// src/components/link/PublicDocumentsTable.tsx

import { useCallback, useState } from "react";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  useColorScheme,
} from "@mui/material";

import { DataTable } from "@/components/DataTable";

import { PUBLIC_DOCUMENT_CATEGORIES } from "./data";
import { openPublicDocument } from "./openPublicDocument";
import type { PublicDocumentOpenResult } from "./openPublicDocument";
import type { PublicDocumentRecord } from "./types";
import { usePublicDocumentsDataTable } from "./usePublicDocumentsDataTable";
import ThemeToggle from "../effect/themes/themeToggle";
import { Moon, Sun } from "lucide-react";

interface OpenedNotice {
  readonly title: string;
  readonly result: PublicDocumentOpenResult;
}

/**
 * Static public document directory table.
 *
 * Activating a row (click, or Enter/Space on the focused row) opens or
 * downloads the document. The Download button does the same; clicks on
 * it do not double-fire the row handler.
 */
export function PublicDocumentsTable() {
  const { mode, setMode } = useColorScheme();
  const [notice, setNotice] = useState<OpenedNotice | null>(null);

  const handleOpenDocument = useCallback((doc: PublicDocumentRecord) => {
    const result = openPublicDocument(doc);

    setNotice({ title: doc.title, result });
  }, []);

  const { table, category, changeCategory } = usePublicDocumentsDataTable({
    onOpenDocument: handleOpenDocument,
  });

  return (
    <>
      <DataTable
        table={table}
        pagination={{}}
        // Fill the container; the fixed column sizes stay as the
        // minimum, so narrow viewports scroll instead of squashing.
        tableProps={{ stickyHeader: true }}
        // onRowClick={(row) => handleOpenDocument(row.original)}
        toolbar={{
          search: true,
          searchPosition: "center",
          searchPlaceholder: "Search title, ID, or keyword…",
          startContent: (
            <Box sx={{ minWidth: 0, maxWidth: "100%" }}>
              <Tabs
                value={category}
                onChange={(_, next) => changeCategory(next)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Document categories"
              >
                {PUBLIC_DOCUMENT_CATEGORIES.map((name) => (
                  <Tab
                    key={name}
                    label={name}
                    value={name}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  />
                ))}
              </Tabs>
            </Box>
          ),
          endContent: (
            <IconButton
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              aria-label="toggle dark/light theme"
            >
              {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
            // <ThemeToggle />
          ),
          enableColumnManager: true,
          enableFilterToggle: true,
        }}
        tableWidth="100%"
      />

      {/* <Box
        mt={1.5}
        px={0.5}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        color="text.secondary"
      >
        <Typography variant="caption">
          {DOCUMENTS.length} document{DOCUMENTS.length === 1 ? "" : "s"} in the
          directory
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <HardDrive size={14} />
          <Typography variant="caption">
            Storage Node: Public Document Cluster #01
          </Typography>
        </Stack>
      </Box> */}

      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setNotice(null)} severity="info" variant="filled">
          {notice?.result === "link" ? "Opening" : "Downloading"}:{" "}
          <strong>{notice?.title}</strong>
        </Alert>
      </Snackbar>
    </>
  );
}
