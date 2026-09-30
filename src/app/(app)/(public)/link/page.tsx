"use client";

// src/app/(app)/(public)/link/page.tsx
//
// Static public document directory, mirroring
// https://public-service-docs.web.app/ on top of the RAZETH DataTable.
//
// Deliberately simple:
//
// - data is a hard-coded array, no server/Refine/live wiring
// - client-side sorting + search + category filter come for free from
//   the MUI feature family (muiDataTableFeatures), which already
//   registers filtered/sorted/paginated row models for every table in
//   this family — this page just leaves manualFiltering/manualSorting/
//   manualPagination unset so they run
// - each row either opens a Google Drive link (driveUrl) or falls back
//   to a synthetic same-origin download, so this can also just be a
//   thin index page that links out to Drive-hosted files
//
// If this ever needs to grow into a real resource (server data, live
// updates, its own columns/ and table/ folders) follow the pattern in
// src/features/documents instead of growing this file.

import { useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import {
  Download,
  FileText,
  HardDrive,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";

import {
  DataTable,
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "@/components/DataTable";

/**
 * ------------------------------------------------------------------
 * Static data
 * ------------------------------------------------------------------
 *
 * driveUrl is optional: when present the row opens that Google Drive
 * link in a new tab instead of the synthetic local download.
 */
interface PublicDocumentRecord {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly fileSize: string;
  readonly lastUpdated: string;
  readonly fileType: string;
  readonly description: string;
  readonly driveUrl?: string;
}

const DOCUMENTS: readonly PublicDocumentRecord[] = [
  {
    id: "DOC-2026-001",
    title: "Individual Annual Tax Return Form 1040",
    category: "Taxes & Finance",
    fileSize: "1.2 MB",
    lastUpdated: "2026-01-15",
    fileType: "PDF",
    description:
      "Official annual personal income tax declaration guidelines and worksheet.",
  },
  {
    id: "DOC-2026-002",
    title: "Commercial Business License Application",
    category: "Permits & Licenses",
    fileSize: "840 KB",
    lastUpdated: "2026-02-10",
    fileType: "PDF",
    description:
      "Application for new enterprise registration or annual municipal operating renewal.",
  },
  {
    id: "DOC-2026-003",
    title: "Civil Registration & National Identity Card Application",
    category: "Legal & Civil",
    fileSize: "2.1 MB",
    lastUpdated: "2025-11-20",
    fileType: "PDF",
    description:
      "First-time identification card applicant guidelines and biometric scheduling.",
  },
  {
    id: "DOC-2026-004",
    title: "Residential Zoning Compliance & Permit Request",
    category: "Permits & Licenses",
    fileSize: "3.4 MB",
    lastUpdated: "2026-03-01",
    fileType: "DOCX",
    description:
      "Structural inspection and local zoning board petition documentation.",
  },
  {
    id: "DOC-2026-005",
    title: "Voter Registration & Electoral Roll Address Update",
    category: "Legal & Civil",
    fileSize: "450 KB",
    lastUpdated: "2026-01-05",
    fileType: "PDF",
    description:
      "Register as a voter or request a change of registered polling precinct.",
  },
  {
    id: "DOC-2026-006",
    title: "Public Health Sanitation Standard Operating Procedures",
    category: "Public Health",
    fileSize: "1.1 MB",
    lastUpdated: "2025-12-18",
    fileType: "PDF",
    description:
      "Regulatory compliance manual for food services, hygiene, and public venues.",
  },
  {
    id: "DOC-2026-007",
    title: "Higher Education Student Aid Application Guidelines",
    category: "Education",
    fileSize: "1.8 MB",
    lastUpdated: "2026-02-28",
    fileType: "PDF",
    description:
      "Grant application forms, income verification thresholds, and deadline details.",
  },
  {
    id: "DOC-2026-008",
    title: "Municipal Property Assessment Appeal Form",
    category: "Taxes & Finance",
    fileSize: "920 KB",
    lastUpdated: "2025-10-12",
    fileType: "DOCX",
    description:
      "Formal petition form to dispute local municipal real estate tax appraisals.",
  },
];

const CATEGORIES = [
  "All",
  "Legal & Civil",
  "Taxes & Finance",
  "Permits & Licenses",
  "Public Health",
  "Education",
] as const;

/**
 * ------------------------------------------------------------------
 * A few small presentational pieces, kept local since this page is
 * deliberately self-contained.
 * ------------------------------------------------------------------
 */
const HeroBanner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: 24,
  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
  color: "#ffffff",
  boxShadow: theme.vars.palette.customShadows.neumorphic,
}));

const FormatBadge = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: "4px",
  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
  color: theme.vars.palette.primary.main,
  fontFamily: "monospace",
  marginRight: theme.spacing(1),
}));

const columnHelper = createMuiDataTableColumnHelper<PublicDocumentRecord>();

function createColumns(onDownload: (doc: PublicDocumentRecord) => void) {
  return columnHelper.columns([
    columnHelper.accessor(
      (row) => `${row.title} ${row.id} ${row.description}`,
      {
        id: "document",
        header: "Document Title & Reference",
        size: 900,
        minSize: 320,
        maxSize: 4000,
        enableSorting: false,
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                display: "flex",
                color: "primary.main",
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
      header: "Category",
      size: 180,
      enableSorting: true,
      sortFn: "alphanumeric",
      enableGlobalFilter: false,
      filterFn: "equals",
      cell: ({ getValue }) => (
        <Chip label={getValue()} size="small" variant="outlined" />
      ),
    }),

    columnHelper.display({
      id: "fileSpecs",
      header: "File Specs",
      size: 140,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FormatBadge>{row.original.fileType}</FormatBadge>
          <Typography variant="caption" color="text.secondary">
            {row.original.fileSize}
          </Typography>
        </Box>
      ),
    }),

    columnHelper.display({
      id: "action",
      header: "Action",
      size: 140,
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { align: "end", headerAlign: "end" },
      cell: ({ row }) => (
        <Button
          variant="contained"
          size="small"
          disableElevation
          startIcon={<Download size={14} />}
          onClick={() => onDownload(row.original)}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
        >
          Download
        </Button>
      ),
    }),
  ]);
}

function downloadDocument(doc: PublicDocumentRecord): void {
  if (doc.driveUrl) {
    window.open(doc.driveUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const blob = new Blob(
    [`Official Public Document Content: ${doc.title} (${doc.id})`],
    { type: "text/plain" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${doc.id.toLowerCase()}_${doc.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")}.${doc.fileType.toLowerCase()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function PublicDocumentsPage() {
  const { mode, setMode } = useColorScheme();
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [downloadedTitle, setDownloadedTitle] = useState<string | null>(null);

  const handleDownload = (doc: PublicDocumentRecord) => {
    downloadDocument(doc);
    setDownloadedTitle(doc.title);
  };

  const columns = useMemo(
    () => createColumns(handleDownload),
    // handleDownload only closes over stable setState setters, so an
    // empty dependency array keeps column identity stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useMuiDataTable({
    data: DOCUMENTS,
    columns,
    getRowId: (row) => row.id,

    // No getCoreRowModel/getFilteredRowModel/getSortedRowModel/
    // getPaginationRowModel here: the MUI feature family
    // (muiDataTableFeatures) already registers filtered/sorted/
    // paginated row models for every table in this family, and they
    // run automatically because manualFiltering/manualSorting/
    // manualPagination are left unset (false) below.

    enableGlobalFilter: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableRowSelection: false,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnFilters:
        selectedCategory === "All"
          ? []
          : [{ id: "category", value: selectedCategory }],
    },

    meta: {
      emptyContent: "No documents to display.",
      noResultsContent: "No documents match the current search or filters.",
    },
  });

  const handleCategoryChange = (
    _: SyntheticEvent,
    value: (typeof CATEGORIES)[number],
  ) => {
    setSelectedCategory(value);
    table
      .getColumn("category")
      ?.setFilterValue(value === "All" ? undefined : value);
  };

  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 4 }, py: 2 }}>
      <HeroBanner>
        <Box maxWidth={650}>
          <Chip
            icon={<ShieldCheck size={14} color="#ffffff" />}
            label="Official Verified Repository"
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: "0.75rem",
              color: "#ffffff",
              bgcolor: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Document Directory & Forms
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
            Search and download public record forms, tax worksheets, and service
            applications.
          </Typography>
        </Box>
      </HeroBanner>

      <DataTable
        table={table}
        pagination={{}}
        toolbar={{
          search: true,
          searchPosition: "center",
          searchPlaceholder: "Search title, ID, or keyword…",
          startContent: (
            <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {CATEGORIES.map((cat) => (
                  <Tab
                    key={cat}
                    label={cat}
                    value={cat}
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
          ),
          enableColumnManager: false,
          enableFilterToggle: false,
        }}
      />

      <Box
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
      </Box>

      <Snackbar
        open={Boolean(downloadedTitle)}
        autoHideDuration={4000}
        onClose={() => setDownloadedTitle(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setDownloadedTitle(null)}
          severity="success"
          variant="filled"
        >
          Downloading: <strong>{downloadedTitle}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
}
