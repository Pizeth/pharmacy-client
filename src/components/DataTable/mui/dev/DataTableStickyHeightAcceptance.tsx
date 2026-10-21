"use client";

import { useState } from "react";
import { styled } from "@mui/material";
import { DataTable } from "../components/DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { createSelectionColumn } from "../columns/selection";
import { createExpansionColumn } from "../columns/expansion";
import type { DataTableRowPinningDisplayMode } from "../row-pinning";

type RecordRow = { id: string; name: string; lines: number };
const CellContent = styled("div", { name: "DataTableStickyHeightAcceptance", slot: "CellContent" })({
  whiteSpace: "normal", overflowWrap: "anywhere",
});
const helper = createMuiDataTableColumnHelper<RecordRow>();
const columns = helper.columns([
  createExpansionColumn<RecordRow>(),
  createSelectionColumn<RecordRow>(),
  helper.accessor("name", { header: "Sticky name", size: 280,
    cell: ({ row }) => <CellContent>{Array.from({ length: row.original.lines }, (_, index) =>
      <div key={index}>{row.original.name} wrapping content {index + 1}</div>)}</CellContent>,
  }),
]);
const data = Array.from({ length: 30 }, (_, index) => ({
  id: String(index + 1), name: `Record ${String(index + 1).padStart(2, "0")}`, lines: index % 3 + 1,
}));
const modes: DataTableRowPinningDisplayMode[] = ["sticky", "top", "bottom", "top-and-bottom", "select-sticky", "select-top", "select-bottom"];
const Root = styled("section", { name: "DataTableStickyHeightAcceptance", slot: "Root" })({ marginTop: 32 });

/** Synthetic controls are reachable only through the existing development-only route. */
export function DataTableStickyHeightAcceptance() {
  const [mode, setMode] = useState<DataTableRowPinningDisplayMode>("select-sticky");
  const [keep, setKeep] = useState(true);
  const [large, setLarge] = useState(false);
  const [card, setCard] = useState(false);
  const table = useMuiDataTable({
    data: large ? data.map(row => ({ ...row, lines: row.lines + 2 })) : data,
    columns, getRowId: row => row.id, enableRowSelection: true, enableRowPinning: true,
    keepPinnedRows: keep, autoResetPageIndex: false, getRowCanExpand: () => true,
    initialState: { pagination: { pageIndex: 0, pageSize: 25 } },
  });
  return <Root aria-label="Sticky height acceptance">
    <h2>Variable-height sticky rows</h2>
    <label>Pin mode <select aria-label="Pin mode" value={mode} onChange={event => {
      const next = modes.find(value => value === event.target.value);
      if (next) setMode(next);
    }}>{modes.map(value => <option key={value}>{value}</option>)}</select></label>
    <label><input type="checkbox" checked={keep} onChange={event => setKeep(event.target.checked)} />Keep pinned rows</label>
    <button onClick={() => {
      table.setRowSelection({ "7": true, "3": true, "2": true });
      table.setRowPinning(mode === "bottom" || mode === "select-bottom"
        ? { top: [], bottom: ["7", "3", "2"] }
        : { top: ["7", "3", "2"], bottom: [] });
    }}>Select unequal rows</button>
    <button onClick={() => { table.setRowSelection({}); table.setRowPinning({ top: [], bottom: [] }); }}>Clear sticky selection</button>
    <button onClick={() => table.setRowPinning({ top: ["7", "2"], bottom: ["4", "9"] })}>Pin independent bands</button>
    <button onClick={() => setLarge(value => !value)}>Change row content</button>
    <button onClick={() => setCard(value => !value)}>Toggle sticky cards</button>
    <button onClick={() => table.setSorting([{ id: "name", desc: true }])}>Sort sticky descending</button>
    <button onClick={() => table.setSorting([])}>Reset sticky sorting</button>
    <button onClick={() => table.setGlobalFilter("Record 02")}>Filter sticky rows</button>
    <button onClick={() => table.setGlobalFilter("")}>Clear sticky filter</button>
    <DataTable table={table} defaultDensity="compact" rowPinning={{ displayMode: mode }}
      displayMode={card ? "card" : "table"}
      card={{ renderBody: ({ row }) => row.original.name, enableSelection: true, enableExpansion: true }}
      renderDetailPanel={({ row }) => <p>Expanded detail for {row.id}</p>}
      containerProps={{ tabIndex: 0, "aria-label": "Sticky height scroll viewport" }} />
  </Root>;
}
