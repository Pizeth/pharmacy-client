"use client";

// src/components/link/PublicDocumentsTable.tsx

import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  useColorScheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { DataTable } from "@/components/DataTable";

import { createPublicDocumentCardConfig } from "./cardConfig";
import { PUBLIC_DOCUMENT_CATEGORIES } from "./data";
import { openPublicDocument, viewPublicDocument } from "./openPublicDocument";
import type { PublicDocumentOpenResult } from "./openPublicDocument";
import type { PublicDocumentRecord } from "./types";
import { publicDocumentsSlot } from "./styled";
import { usePublicDocumentsDataTable } from "./usePublicDocumentsDataTable";
import ThemeToggle from "../effect/themes/themeToggle";
import { Moon, Sun } from "lucide-react";

const CategoryTabsRoot = styled(
  "div",
  publicDocumentsSlot("CategoryTabs"),
)({
  minWidth: 0,
  maxWidth: "100%",
});

const CategoryTab = styled(
  Tab,
  publicDocumentsSlot("CategoryTab"),
)({
  textTransform: "none",
  fontWeight: 600,
});

interface OpenedNotice {
  readonly title: string;
  readonly result: PublicDocumentOpenResult;
}

/**
 * Static public document directory table.
 *
 * Table presentation on wide screens, card presentation on small ones
 * (the toolbar toggle can still switch manually). Each row offers View
 * (PDF/image files only) and Download (Drive links and files); see
 * documentActions.ts for the rules.
 */
export function PublicDocumentsTable() {
  const { mode, setMode } = useColorScheme();
  const [notice, setNotice] = useState<OpenedNotice | null>(null);

  const handleDownloadDocument = useCallback((doc: PublicDocumentRecord) => {
    const result = openPublicDocument(doc);

    setNotice({ title: doc.title, result });
  }, []);

  const handleViewDocument = useCallback((doc: PublicDocumentRecord) => {
    const result = viewPublicDocument(doc);

    if (result) {
      setNotice({ title: doc.title, result });
    }
  }, []);

  const { table, category, changeCategory, actions } =
    usePublicDocumentsDataTable({
      onViewDocument: handleViewDocument,
      onDownloadDocument: handleDownloadDocument,
    });

  const card = useMemo(
    () => createPublicDocumentCardConfig(actions),
    [actions],
  );

  return (
    <>
      <DataTable
        table={table}
        pagination={{}}
        // Fill the container; the fixed column sizes stay as the
        // minimum, so narrow viewports scroll instead of squashing.
        tableProps={{ stickyHeader: true }}
        // onRowClick={(row) => handleDownloadDocument(row.original)}
        card={card}
        // Cards on small screens, table above the breakpoint.
        defaultDisplayMode="auto"
        autoCardBreakpoint="md"
        toolbar={{
          search: true,
          searchPosition: "center",
          searchPlaceholder: "ស្វែងរកឯកសារ…",
          startContent: (
            <CategoryTabsRoot>
              <Tabs
                value={category}
                onChange={(_, next) => changeCategory(next)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Document categories"
              >
                {PUBLIC_DOCUMENT_CATEGORIES.map((name) => (
                  <CategoryTab
                    key={name}
                    label={
                      <Typography
                        component="span"
                        variant="subtitle1"
                        fontWeight={700}
                      >
                        {name}
                      </Typography>
                    }
                    value={name}
                  />
                ))}
              </Tabs>
            </CategoryTabsRoot>
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
