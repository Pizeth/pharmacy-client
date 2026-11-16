/** Local acceptance entry only; never imported by the application routes. */
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Refine, type DataProvider } from "@refinedev/core";
import { Box, Button, CssBaseline, Stack, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { DataTable } from "../../src/components/DataTable";
import { darkTheme } from "../../src/theme/razeth";
import { createProductionLiveProvider } from "../../src/lib/realtime/productionLiveProvider";
import { useTranslationKeyDataTable } from "../../src/features/i18n/translation-keys/table/useTranslationKeyDataTable";
import { translationKeyRefineDataProvider } from "../../src/features/i18n/translation-keys/refine/translationKeyRefineDataProvider";
import { TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME } from "../../src/features/i18n/translation-keys/refine/translationKeyRefineDataTableAdapter";
import { updateTranslationKey } from "../../src/features/i18n/translation-keys/api";

const unsupported = async (): Promise<never> => { throw new Error("Unsupported fixture operation"); };
const fallback = { getList: unsupported, getOne: unsupported, create: unsupported,
  update: unsupported, deleteOne: unsupported, getApiUrl: () => location.origin } as DataProvider;
const theme = createTheme(darkTheme);
function Table() {
  const controller = useTranslationKeyDataTable({ enableRowSelection: true, enableTranslationDetails: true });
  const [mode, setMode] = useState<"table" | "card">("table");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const key = controller.table.getRowModel().rows.find(row => row.original.key.endsWith("_browser"))?.original;
  const save = async () => {
    if (!key) return;
    try { await updateTranslationKey(key.id, { description }); setResult("Saved through translation API"); }
    catch (error) { setResult(error instanceof Error ? error.message : "Save failed"); }
  };
  return <Stack spacing={2} padding={3}>
    <Typography variant="h5">Authenticated realtime acceptance</Typography>
    <Typography>{location.hostname === "localhost" ? "Session A" : "Session B"} · real cookies, database, production provider and DataTable</Typography>
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={() => setMode(value => value === "table" ? "card" : "table")}>Switch presentation</Button>
      <TextField label="Description" value={description} onChange={event => setDescription(event.target.value)} size="small" />
      <Button variant="contained" disabled={!key || !description} onClick={() => { void save(); }}>Save description</Button>
      <Button onClick={() => { void fetch("/acceptance/finish", { method: "POST", credentials: "include" }); }}>Finish and clean up</Button>
    </Stack>
    <output aria-label="Save result">{result}</output>
    <output aria-label="Selected rows">{JSON.stringify(controller.table.state.rowSelection)}</output>
    <Box><DataTable table={controller.table} displayMode={mode} pagination={false}
      card={{ renderBody: ({ row }) => <Stack><Typography>{row.original.key}</Typography><Typography>{row.original.description}</Typography></Stack> }} /></Box>
  </Stack>;
}
function Acceptance() {
  const live = useMemo(() => createProductionLiveProvider({ enabled: true }), []);
  return <ThemeProvider theme={theme}><CssBaseline /><Refine liveProvider={live}
    dataProvider={{ default: fallback, [TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME]: translationKeyRefineDataProvider }}
    options={{ disableTelemetry: true, liveMode: "off" }}><Table /></Refine></ThemeProvider>;
}
createRoot(document.getElementById("root")!).render(<Acceptance />);
