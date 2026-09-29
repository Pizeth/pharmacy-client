"use client";

// import React, { useState, useMemo } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Button,
//   Chip,
//   Box,
//   Tabs,
//   Tab,
//   Snackbar,
//   Alert,
//   CssBaseline,
//   ThemeProvider,
//   createTheme,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// // Lucide-React SVG icons mapped for MUI usage
// import {
//   Search,
//   FileText,
//   Download,
//   XCircle,
//   Building2,
//   Calendar,
//   HardDrive,
//   ShieldCheck,
//   Moon,
//   Sun,
//   X,
// } from "lucide-react";

// const MOCK_DOCUMENTS = [
//   {
//     id: "DOC-2026-001",
//     title: "Individual Annual Tax Return Form 1040",
//     category: "Taxes & Finance",
//     fileSize: "1.2 MB",
//     lastUpdated: "2026-01-15",
//     fileType: "PDF",
//     description:
//       "Official annual personal income tax declaration guidelines and worksheet.",
//   },
//   {
//     id: "DOC-2026-002",
//     title: "Commercial Business License Application",
//     category: "Permits & Licenses",
//     fileSize: "840 KB",
//     lastUpdated: "2026-02-10",
//     fileType: "PDF",
//     description:
//       "Application for new enterprise registration or annual municipal operating renewal.",
//   },
//   {
//     id: "DOC-2026-003",
//     title: "Civil Registration & National Identity Card Application",
//     category: "Legal & Civil",
//     fileSize: "2.1 MB",
//     lastUpdated: "2025-11-20",
//     fileType: "PDF",
//     description:
//       "First-time identification card applicant guidelines and biometric scheduling.",
//   },
//   {
//     id: "DOC-2026-004",
//     title: "Residential Zoning Compliance & Permit Request",
//     category: "Permits & Licenses",
//     fileSize: "3.4 MB",
//     lastUpdated: "2026-03-01",
//     fileType: "DOCX",
//     description:
//       "Structural inspection and local zoning board petition documentation.",
//   },
//   {
//     id: "DOC-2026-005",
//     title: "Voter Registration & Electoral Roll Address Update",
//     category: "Legal & Civil",
//     fileSize: "450 KB",
//     lastUpdated: "2026-01-05",
//     fileType: "PDF",
//     description:
//       "Register as a voter or request a change of registered polling precinct.",
//   },
//   {
//     id: "DOC-2026-006",
//     title: "Public Health Sanitation Standard Operating Procedures",
//     category: "Public Health",
//     fileSize: "1.1 MB",
//     lastUpdated: "2025-12-18",
//     fileType: "PDF",
//     description:
//       "Regulatory compliance manual for food services, hygiene, and public venues.",
//   },
//   {
//     id: "DOC-2026-007",
//     title: "Higher Education Student Aid Application Guidelines",
//     category: "Education",
//     fileSize: "1.8 MB",
//     lastUpdated: "2026-02-28",
//     fileType: "PDF",
//     description:
//       "Grant application forms, income verification thresholds, and deadline details.",
//   },
//   {
//     id: "DOC-2026-008",
//     title: "Municipal Property Assessment Appeal Form",
//     category: "Taxes & Finance",
//     fileSize: "920 KB",
//     lastUpdated: "2025-10-12",
//     fileType: "DOCX",
//     description:
//       "Formal petition form to dispute local municipal real estate tax appraisals.",
//   },
// ];

// const CATEGORIES = [
//   "All",
//   "Legal & Civil",
//   "Taxes & Finance",
//   "Permits & Licenses",
//   "Public Health",
//   "Education",
// ];

// const MainWrapper = styled(Box)(({ theme }) => ({
//   minHeight: "100vh",
//   backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#f8fafc",
//   color: theme.palette.mode === "dark" ? "#f1f5f9" : "#0f172a",
//   paddingBottom: theme.spacing(6),
// }));

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
//   color: theme.palette.mode === "dark" ? "#ffffff" : "#0f172a",
//   borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"}`,
//   boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
// }));

// const HeaderLogoContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   gap: theme.spacing(1.5),
// }));

// const IconBadge = styled(Box)(({ theme }) => ({
//   backgroundColor: "#2563eb",
//   color: "#ffffff",
//   padding: theme.spacing(1),
//   borderRadius: theme.shape.borderRadius,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const HeroBanner = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   marginTop: theme.spacing(4),
//   marginBottom: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
//   color: "#ffffff",
//   boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2)",
// }));

// const CategoryTag = styled(Chip)(({ theme }) => ({
//   backgroundColor: "rgba(255, 255, 255, 0.2)",
//   color: "#ffffff",
//   fontWeight: 600,
//   fontSize: "0.75rem",
//   marginBottom: theme.spacing(1.5),
//   border: "1px solid rgba(255, 255, 255, 0.3)",
// }));

// const SearchFilterBar = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(2),
//   marginBottom: theme.spacing(3),
//   borderRadius: theme.shape.borderRadius * 1.5,
//   display: "flex",
//   flexDirection: "column",
//   gap: theme.spacing(2),
//   backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
//   border: `1px solid ${theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"}`,
//   [theme.breakpoints.up("md")]: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//   width: "100%",
//   [theme.breakpoints.up("md")]: {
//     width: "360px",
//   },
//   "& .MuiOutlinedInput-root": {
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#f8fafc",
//     "& fieldset": {
//       borderColor: theme.palette.mode === "dark" ? "#334155" : "#e2e8f0",
//     },
//     "&:hover fieldset": {
//       borderColor: "#2563eb",
//     },
//   },
// }));

// const ClickableTableRow = styled(TableRow)(({ theme }) => ({
//   cursor: "pointer",
//   transition: "all 0.15s ease-in-out",
//   "&:hover": {
//     backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f0f9ff",
//     "& .doc-title": {
//       color: "#2563eb",
//     },
//     "& .download-btn": {
//       backgroundColor: "#1d4ed8",
//       transform: "scale(1.03)",
//     },
//   },
// }));

// const FormatBadge = styled("span")(({ theme }) => ({
//   fontSize: "0.6875rem",
//   fontWeight: 700,
//   padding: "2px 6px",
//   borderRadius: "4px",
//   backgroundColor: theme.palette.mode === "dark" ? "#1e3a8a" : "#dbeafe",
//   color: theme.palette.mode === "dark" ? "#93c5fd" : "#1e40af",
//   fontFamily: "monospace",
//   marginRight: theme.spacing(1),
// }));

// const TableFooterBar = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#f8fafc",
//   borderTop: `1px solid ${theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"}`,
// }));

// export default function App() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [snackbarState, setSnackbarState] = useState({
//     open: false,
//     docName: "",
//   });

//   // Custom MUI theme setup
//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: darkMode ? "dark" : "light",
//           primary: {
//             main: "#2563eb",
//           },
//         },
//         typography: {
//           fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
//         },
//       }),
//     [darkMode],
//   );

//   // Instant filtering based on title, ID, or description
//   const filteredDocs = useMemo(() => {
//     return MOCK_DOCUMENTS.filter((doc) => {
//       const q = searchQuery.toLowerCase();
//       const matchesSearch =
//         doc.title.toLowerCase().includes(q) ||
//         doc.id.toLowerCase().includes(q) ||
//         doc.description.toLowerCase().includes(q);
//       const matchesCategory =
//         selectedCategory === "All" || doc.category === selectedCategory;
//       return matchesSearch && matchesCategory;
//     });
//   }, [searchQuery, selectedCategory]);

//   // Clickable row event handler simulating file download
//   const handleDownload = (doc, event) => {
//     if (event) {
//       event.stopPropagation();
//     }

//     // Trigger synthetic file download
//     const blob = new Blob(
//       [`Official Public Document Content: ${doc.title} (${doc.id})`],
//       {
//         type: "text/plain",
//       },
//     );
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${doc.id.toLowerCase()}_${doc.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${doc.fileType.toLowerCase()}`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     // Show feedback snackbar banner
//     setSnackbarState({ open: true, docName: doc.title });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarState({ open: false, docName: "" });
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <MainWrapper>
//         {/* Navigation / Header */}
//         <StyledAppBar position="sticky" elevation={0}>
//           <Toolbar>
//             <Container maxWidth="lg" disableGutters>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <HeaderLogoContainer>
//                   <IconBadge>
//                     <Building2 size={24} />
//                   </IconBadge>
//                   <Box>
//                     <Typography variant="h6" fontWeight="700" lineHeight="1.1">
//                       Public Service Documents
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Official Municipal & National Portal
//                     </Typography>
//                   </Box>
//                 </HeaderLogoContainer>

//                 <IconButton
//                   onClick={() => setDarkMode(!darkMode)}
//                   color="inherit"
//                   aria-label="toggle dark/light theme"
//                 >
//                   {darkMode ? (
//                     <Sun size={20} color="#f59e0b" />
//                   ) : (
//                     <Moon size={20} />
//                   )}
//                 </IconButton>
//               </Box>
//             </Container>
//           </Toolbar>
//         </StyledAppBar>

//         <Container maxWidth="lg">
//           {/* Portal Hero Banner */}
//           <HeroBanner elevation={0}>
//             <Box maxWidth="650px">
//               <CategoryTag
//                 icon={<ShieldCheck size={14} color="#ffffff" />}
//                 label="Official Verified Repository"
//               />
//               <Typography variant="h4" fontWeight="800" gutterBottom>
//                 Document Directory & Forms
//               </Typography>
//               <Typography
//                 variant="body1"
//                 style={{ opacity: 0.9, lineHeight: 1.6 }}
//               >
//                 Search, inspect, and download public record forms, tax
//                 worksheets, and service applications.
//                 <strong> Click any document row directly</strong> to download
//                 files.
//               </Typography>
//             </Box>
//           </HeroBanner>

//           {/* Search & Filtering Control Bar */}
//           <SearchFilterBar elevation={0}>
//             <StyledTextField
//               placeholder="Search title, ID, or keyword..."
//               size="small"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search size={18} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchQuery && (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={() => setSearchQuery("")}>
//                       <X size={16} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box overflow="auto" maxWidth="100%">
//               <Tabs
//                 value={selectedCategory}
//                 onChange={(_, val) => setSelectedCategory(val)}
//                 variant="scrollable"
//                 scrollButtons="auto"
//                 indicatorColor="primary"
//                 textColor="primary"
//               >
//                 {CATEGORIES.map((cat) => (
//                   <Tab
//                     key={cat}
//                     label={cat}
//                     value={cat}
//                     style={{ textTransform: "none", fontWeight: 600 }}
//                   />
//                 ))}
//               </Tabs>
//             </Box>
//           </SearchFilterBar>

//           {/* Main Documents Table */}
//           <TableContainer
//             component={Paper}
//             elevation={0}
//             variant="outlined"
//             style={{ borderRadius: "12px", overflow: "hidden" }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow
//                   style={{ backgroundColor: darkMode ? "#1e293b" : "#f8fafc" }}
//                 >
//                   <TableCell style={{ fontWeight: 700 }}>
//                     Document Title & Reference
//                   </TableCell>
//                   <TableCell style={{ fontWeight: 700 }}>Category</TableCell>
//                   <TableCell style={{ fontWeight: 700 }}>File Specs</TableCell>
//                   <TableCell style={{ fontWeight: 700 }}>
//                     Last Updated
//                   </TableCell>
//                   <TableCell align="right" style={{ fontWeight: 700 }}>
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredDocs.length > 0 ? (
//                   filteredDocs.map((doc) => (
//                     <ClickableTableRow
//                       key={doc.id}
//                       onClick={(e) => handleDownload(doc, e)}
//                       title={`Click row to download ${doc.title}`}
//                     >
//                       {/* Document Details Cell */}
//                       <TableCell>
//                         <Box display="flex" alignItems="flex-start" gap={2}>
//                           <Box
//                             style={{
//                               padding: "8px",
//                               borderRadius: "8px",
//                               backgroundColor: darkMode ? "#0f172a" : "#f1f5f9",
//                               color: "#2563eb",
//                               marginTop: "2px",
//                             }}
//                           >
//                             <FileText size={20} />
//                           </Box>
//                           <Box>
//                             <Typography
//                               variant="subtitle2"
//                               className="doc-title"
//                               style={{
//                                 fontWeight: 600,
//                                 transition: "color 0.15s ease",
//                               }}
//                             >
//                               {doc.title}
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               color="text.secondary"
//                               style={{ fontSize: "0.75rem", marginTop: "2px" }}
//                             >
//                               {doc.description}
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               color="primary"
//                               style={{
//                                 fontFamily: "monospace",
//                                 fontWeight: 600,
//                               }}
//                             >
//                               {doc.id}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>

//                       {/* Category Cell */}
//                       <TableCell>
//                         <Chip
//                           label={doc.category}
//                           size="small"
//                           variant="outlined"
//                           style={{ fontWeight: 500 }}
//                         />
//                       </TableCell>

//                       {/* File Specs Cell */}
//                       <TableCell>
//                         <Box display="flex" alignItems="center">
//                           <FormatBadge>{doc.fileType}</FormatBadge>
//                           <Typography variant="caption" color="text.secondary">
//                             {doc.fileSize}
//                           </Typography>
//                         </Box>
//                       </TableCell>

//                       {/* Date Cell */}
//                       <TableCell>
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <Calendar size={14} color="#94a3b8" />
//                           <Typography variant="caption" color="text.secondary">
//                             {doc.lastUpdated}
//                           </Typography>
//                         </Box>
//                       </TableCell>

//                       {/* Action Cell */}
//                       <TableCell align="right">
//                         <Button
//                           variant="contained"
//                           size="small"
//                           disableElevation
//                           className="download-btn"
//                           onClick={(e) => handleDownload(doc, e)}
//                           startIcon={<Download size={14} />}
//                           style={{
//                             textTransform: "none",
//                             fontWeight: 600,
//                             borderRadius: "6px",
//                             transition: "all 0.15s ease",
//                           }}
//                         >
//                           Download
//                         </Button>
//                       </TableCell>
//                     </ClickableTableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={5}
//                       align="center"
//                       style={{ padding: "48px 16px" }}
//                     >
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                         gap={1}
//                       >
//                         <XCircle size={36} color="#94a3b8" />
//                         <Typography variant="subtitle1" fontWeight="600">
//                           No document records found
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Try adjusting your search criteria or resetting the
//                           active category filter.
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>

//             {/* Directory Footer */}
//             <TableFooterBar>
//               <Typography variant="caption" color="text.secondary">
//                 Showing <strong>{filteredDocs.length}</strong> of{" "}
//                 <strong>{MOCK_DOCUMENTS.length}</strong> entries
//               </Typography>
//               <Box display="flex" alignItems="center" gap={0.5}>
//                 <HardDrive size={14} color="#94a3b8" />
//                 <Typography variant="caption" color="text.secondary">
//                   Storage Node: Public Document Cluster #01
//                 </Typography>
//               </Box>
//             </TableFooterBar>
//           </TableContainer>
//         </Container>

//         {/* Download Feedback Notification Banner */}
//         <Snackbar
//           open={snackbarState.open}
//           autoHideDuration={4000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity="success"
//             variant="filled"
//             elevation={6}
//             style={{ fontWeight: 500 }}
//           >
//             Downloading: <strong>{snackbarState.docName}</strong>
//           </Alert>
//         </Snackbar>
//       </MainWrapper>
//     </ThemeProvider>
//   );
// }

// src/app/(app)/(public)/documents/page.tsx
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
  Container,
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
  Calendar,
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
        size: 420,
        minSize: 280,
        enableSorting: false,
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                p: 1,
                mt: 0.25,
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
              <Typography
                variant="caption"
                color="primary"
                fontFamily="monospace"
                fontWeight={600}
              >
                {row.original.id}
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

    columnHelper.accessor("lastUpdated", {
      id: "lastUpdated",
      header: "Last Updated",
      size: 160,
      enableSorting: true,
      sortFn: "alphanumeric",
      enableGlobalFilter: false,
      cell: ({ getValue }) => (
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Calendar size={14} />
          <Typography variant="caption" color="text.secondary">
            {getValue()}
          </Typography>
        </Stack>
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
    <Container maxWidth="lg">
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
          searchPosition: "start",
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
    </Container>
  );
}
