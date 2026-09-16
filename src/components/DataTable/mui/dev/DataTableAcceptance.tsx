"use client";

import { useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataTable } from "../components/DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";

type ExampleRow = { id: string; start: string; center: string; end: string };
const helper = createMuiDataTableColumnHelper<ExampleRow>();
const columns = helper.columns([
  helper.accessor("start", {
    header: "Start pinned",
    size: 180,
    meta: { align: "start" },
  }),
  helper.accessor("center", {
    header: "Centered",
    size: 700,
    meta: { align: "center" },
  }),
  helper.accessor("end", {
    header: "End pinned",
    size: 180,
    meta: { align: "end" },
  }),
]);
const data = Array.from({ length: 60 }, (_, index) => ({
  id: String(index),
  start: `Start ${index + 1}`,
  center: `Scrolling content ${index + 1} — ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
  end: `End ${index + 1}`,
}));
function ExampleTable({ direction }: { direction: "ltr" | "rtl" }) {
  const table = useMuiDataTable({
    columns,
    data,
    getRowId: (row) => row.id,
    columnResizeDirection: direction,
    initialState: {
      columnPinning: { start: ["start"], end: ["end"] },
      pagination: { pageIndex: 0, pageSize: 50 },
    },
  });
  return (
    <>
      <button onClick={() => table.setRowSelection({ "0": true })}>
        Select first row
      </button>
      <button onClick={() => table.setRowSelection({})}>Clear selection</button>
      <DataTable
        table={table}
        selectionBar={{}}
        containerProps={{
          style: { maxHeight: "55vh" },
          tabIndex: 0,
          "aria-label": "Acceptance scroll viewport",
        }}
      />
    </>
  );
}
/** Synthetic, development-only browser acceptance surface. */
export function DataTableAcceptance() {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [narrow, setNarrow] = useState(false);
  const theme = useMemo(
    () => createTheme({ direction, palette: { mode } }),
    [direction, mode],
  );
  return (
    <ThemeProvider theme={theme}>
      <main
        style={{
          padding: 16,
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
        }}
      >
        <h1>DataTable acceptance</h1>
        <label>
          Direction{" "}
          <select
            aria-label="Direction"
            value={direction}
            onChange={(event) =>
              setDirection(event.target.value as "ltr" | "rtl")
            }
          >
            <option value="ltr">LTR</option>
            <option value="rtl">RTL</option>
          </select>
        </label>{" "}
        <label>
          Color mode{" "}
          <select
            aria-label="Color mode"
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as "light" | "dark")
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>{" "}
        <label>
          <input
            type="checkbox"
            checked={narrow}
            onChange={(event) => setNarrow(event.target.checked)}
          />
          Narrow container
        </label>
        <p>
          Use the scroll viewport with arrow keys. Check both pinned edges,
          selected and hovered rows, horizontal and vertical scrolling, density
          and column menus, column filtering, column management, page-size
          selection, and fullscreen in both directions and color modes.
        </p>
        <div style={{ width: narrow ? 420 : 900, maxWidth: "100%" }}>
          <ExampleTable direction={direction} />
        </div>
      </main>
    </ThemeProvider>
  );
}
