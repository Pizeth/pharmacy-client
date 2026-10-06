"use client";

// src/components/hrd/PublicDocumentsTable.tsx

import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FormControlLabel,
  Menu,
  MenuItem,
  IconButton,
  Switch,
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
import type { PublicDocumentCategory } from "./data";
import { openPublicDocument, viewPublicDocument } from "./openPublicDocument";
import type { PublicDocumentOpenResult } from "./openPublicDocument";
import type { PublicDocumentRecord } from "./types";
import { publicDocumentsSlot } from "./styled";
import { usePublicDocumentsDataTable } from "./usePublicDocumentsDataTable";
import ThemeToggle from "../effect/themes/themeToggle";
import { ChevronDown, Moon, Sun } from "lucide-react";

const CategoryTabsRoot = styled(
  "div",
  publicDocumentsSlot("CategoryTabs"),
)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  minWidth: 0,
  maxWidth: "100%",
});

const GROUP_LABEL = "លិខិតបទដ្ឋានគតិយុត្តិ";
const GROUP_CATEGORIES: readonly PublicDocumentCategory[] = [
  "ព្រះរាជក្រឹត្យ",
  "អនុក្រឹត្យ",
  "ប្រកាស",
  "សេចក្ដីសម្រេច",
];
const ADMIN_LABEL = "លិខិតរដ្ឋបាល";
const ADMIN_CATEGORIES: readonly PublicDocumentCategory[] = [
  "ពាក្យស្នើសុំ",
  "លិខិតរដ្ឋបាល",
  "សេចក្ដីជូនដំណឹង",
];
const CategoryGroupMenu = styled(
  Menu,
  publicDocumentsSlot("CategoryGroup"),
)({});

const CategoryTab = styled(
  Tab,
  publicDocumentsSlot("CategoryTab"),
)({
  textTransform: "none",
  fontWeight: 600,
});

function CategoryLabel({ children }: { readonly children: string }) {
  return (
    <Typography component="span" variant="subtitle1" fontWeight={700}>
      {children}
    </Typography>
  );
}

interface OpenedNotice {
  readonly title: string;
  readonly result: PublicDocumentOpenResult;
}

/**
 * Static public document directory table.
 *
 * Table presentation on desktop and compact cards on mobile by default;
 * the toolbar can switch presentation manually. Each row offers View
 * (PDF/image files only) and Download (Drive links and files); see
 * documentActions.ts for the rules.
 */
export function PublicDocumentsTable({
  compactCard = true,
}: { compactCard?: boolean } = {}) {
  const { mode, setMode } = useColorScheme();
  const [notice, setNotice] = useState<OpenedNotice | null>(null);
  const [useCompactCard, setUseCompactCard] = useState(compactCard);
  const [categoryAnchor, setCategoryAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [activeGroup, setActiveGroup] = useState<"legal" | "admin">("legal");

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
    () => createPublicDocumentCardConfig(actions, useCompactCard),
    [actions, useCompactCard],
  );

  return (
    <>
      <DataTable
        table={table}
        pagination={{}}
        // Fill the container; the fixed column sizes stay as the
        // minimum, so narrow viewports scroll instead of squashing.
        tableProps={{ stickyHeader: true }}
        onRowClick={(row) => handleDownloadDocument(row.original)}
        card={card}
        defaultDisplayMode="auto"
        autoCardBreakpoint="md"
        toolbar={{
          searchMode: "collapsible",
          defaultSearchOpen: true,
          searchPosition: "center",
          searchPlaceholder: "ស្វែងរកឯកសារ…",
          // search: true,
          // searchPosition: "center",
          // searchPlaceholder: "ស្វែងរកឯកសារ…",
          startContent: (
            <CategoryTabsRoot>
              <Tabs
                value={
                  ADMIN_CATEGORIES.includes(category)
                    ? "admin-group"
                    : GROUP_CATEGORIES.includes(category)
                      ? "legal-group"
                      : category
                }
                onChange={(_, next) => {
                  if (next !== "legal-group" && next !== "admin-group")
                    changeCategory(next);
                }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Document categories"
              >
                <CategoryTab
                  value="ទាំងអស់"
                  label={<CategoryLabel>ទាំងអស់</CategoryLabel>}
                />
                <CategoryTab
                  value="admin-group"
                  label={<CategoryLabel>{ADMIN_LABEL}</CategoryLabel>}
                  icon={<ChevronDown size={16} />}
                  iconPosition="end"
                  aria-haspopup="menu"
                  aria-expanded={
                    Boolean(categoryAnchor) && activeGroup === "admin"
                  }
                  onClick={(event) => {
                    setActiveGroup("admin");
                    setCategoryAnchor(event.currentTarget);
                  }}
                />
                <CategoryTab
                  value="legal-group"
                  label={<CategoryLabel>{GROUP_LABEL}</CategoryLabel>}
                  icon={<ChevronDown size={16} />}
                  iconPosition="end"
                  aria-haspopup="menu"
                  aria-expanded={
                    Boolean(categoryAnchor) && activeGroup === "legal"
                  }
                  aria-controls={
                    categoryAnchor
                      ? "public-documents-category-menu"
                      : undefined
                  }
                  onClick={(event) => {
                    setActiveGroup("legal");
                    setCategoryAnchor(event.currentTarget);
                  }}
                />
                {PUBLIC_DOCUMENT_CATEGORIES.filter(
                  (name) =>
                    name !== "ទាំងអស់" &&
                    !GROUP_CATEGORIES.includes(name) &&
                    !ADMIN_CATEGORIES.includes(name),
                ).map((name) => (
                  <CategoryTab
                    key={name}
                    label={<CategoryLabel>{name}</CategoryLabel>}
                    value={name}
                  />
                ))}
              </Tabs>
              <CategoryGroupMenu
                id="public-documents-category-menu"
                anchorEl={categoryAnchor}
                open={Boolean(categoryAnchor)}
                onClose={() => setCategoryAnchor(null)}
                slotProps={{
                  list: {
                    "aria-label":
                      activeGroup === "admin" ? ADMIN_LABEL : GROUP_LABEL,
                  },
                }}
              >
                {(activeGroup === "admin"
                  ? ADMIN_CATEGORIES
                  : GROUP_CATEGORIES
                ).map((name) => (
                  <MenuItem
                    key={name}
                    selected={category === name}
                    onClick={() => {
                      changeCategory(name);
                      setCategoryAnchor(null);
                    }}
                  >
                    <CategoryLabel>{name}</CategoryLabel>
                  </MenuItem>
                ))}
              </CategoryGroupMenu>
            </CategoryTabsRoot>
          ),
          endContent: (
            <>
              <FormControlLabel
                label="Compact cards"
                control={
                  <Switch
                    size="small"
                    checked={useCompactCard}
                    onChange={(_, checked) => setUseCompactCard(checked)}
                  />
                }
              />
              <IconButton
                onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                aria-label="toggle dark/light theme"
              >
                {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
            </>
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
