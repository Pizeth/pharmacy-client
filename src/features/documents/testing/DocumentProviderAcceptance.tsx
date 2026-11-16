"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DocumentTableFixturePreview } from "@/features/documents/testing/DocumentTableFixturePreview";

const theme = createTheme();

/** Reuse the existing fixture provider; no backend requests or mutation commands. */
export function DocumentProviderAcceptance() {
  return <ThemeProvider theme={theme}>
    <h1>Independent Document / Refine acceptance — fixture data only</h1>
    <DocumentTableFixturePreview defaultDisplayMode="table" />
  </ThemeProvider>;
}
