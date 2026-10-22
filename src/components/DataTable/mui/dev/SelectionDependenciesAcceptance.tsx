"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import type { Row, RowSelectionState } from "@tanstack/table-core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { MuiDataTableFeatures } from "../features";
import { createMuiDataTableColumnHelper, useMuiDataTable, type MuiDataTableInstance } from "../table";
import { createSelectionColumn } from "../columns/selection";
import { DataTableRowActions } from "../columns/actions/DataTableRowActions";
import type { DataTableRowAction } from "../columns/actions";
import { DataTable } from "../components/DataTable";
import { DataTableRenderDiagnosticsContext, type DataTableRenderDiagnostics } from "../diagnostics/renderDiagnostics";
import { SelectionDependencyBoundary } from "../diagnostics/SelectionDependencyBoundary";

export type DependencyRecord = { id: string; name: string };
export type DependencyTable = MuiDataTableInstance<DependencyRecord>;
type DependencyRow = Row<MuiDataTableFeatures, DependencyRecord>;
export type DependencyVariant = "default" | "boundaries";
export type OutputCommit = (id: string) => void;
const records: DependencyRecord[] = [
  { id: "a", name: "Alpha" }, { id: "b", name: "Bravo" },
  { id: "c", name: "Charlie" }, { id: "d", name: "Delta" },
];
const helper = createMuiDataTableColumnHelper<DependencyRecord>();
const noCommit: OutputCommit = () => {};

function Output({ id, children, commit }: {
  readonly id: string; readonly children: ReactNode; readonly commit: OutputCommit;
}) {
  useLayoutEffect(() => { commit(id); });
  return <output data-testid={id}>{children}</output>;
}

function OwnOutput({ table, row, commit }: {
  readonly table: DependencyTable; readonly row: DependencyRow; readonly commit: OutputCommit;
}) {
  // Subscribe and the actual row are stable; a newly created hook wrapper is
  // deliberately not a dependency. Reading live state is not copying it.
  const Subscribe = table.Subscribe;
  const render = useCallback(() => <Output id={`own-${row.id}`} commit={commit}>
    {row.getIsSelected() ? "selected" : "clear"}
  </Output>, [row, commit]);
  return <SelectionDependencyBoundary Subscribe={Subscribe} selectionDependency="row"
    rowId={row.id} render={render} />;
}

function GlobalOutput({ table, row, commit, prefix = "global" }: {
  readonly table: DependencyTable; readonly row: DependencyRow; readonly commit: OutputCommit;
  readonly prefix?: string;
}) {
  return <SelectionDependencyBoundary Subscribe={table.Subscribe} render={() =>
    <Output id={`${prefix}-${row.id}`} commit={commit}>
      {Object.values(table.store.get().rowSelection).filter(Boolean).length}
    </Output>} />;
}

function LocalParent({ table, row, commit }: {
  readonly table: DependencyTable; readonly row: DependencyRow; readonly commit: OutputCommit;
}) {
  const render = useCallback(() => <>
    <Output id={`parent-${row.id}`} commit={commit}>{row.original.name}</Output>
    <GlobalOutput table={table} row={row} commit={commit} prefix="nested" />
  </>, [table, row, commit]);
  return <SelectionDependencyBoundary Subscribe={table.Subscribe} selectionDependency="row"
    rowId={row.id} render={render} />;
}

export interface SelectionDependenciesFixtureProps {
  readonly variant?: DependencyVariant;
  readonly onTable?: (table: DependencyTable) => void;
  readonly commit?: OutputCommit;
  readonly diagnostics?: DataTableRenderDiagnostics;
  readonly direction?: "ltr" | "rtl";
  readonly controlled?: boolean;
  /** Adversarial existing callback API: reads the hook wrapper's snapshot. */
  readonly snapshotCallbacks?: boolean;
  readonly conditionalDetail?: boolean;
}

/** Local fixture only: the full-state adapter below is NOT a production API. */
export function SelectionDependenciesFixture({ variant = "default", onTable,
  commit = noCommit, diagnostics, direction = "ltr", controlled = false,
  snapshotCallbacks = false, conditionalDetail = false }: SelectionDependenciesFixtureProps) {
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [blocked, setBlocked] = useState(false);
  const [mode, setMode] = useState<"table" | "card">("table");
  const [generation, setGeneration] = useState(0);
  const [limited, setLimited] = useState(false);
  const actions = useMemo<readonly DataTableRowAction<DependencyRecord>[]>(() => [{
    id: "guarded", label: "Guarded action", inline: true,
    isDisabled: ({ table }) => blocked || Object.values(snapshotCallbacks
      ? table.state.rowSelection ?? {} : table.store.get().rowSelection).filter(Boolean).length >= 2,
    onClick: () => {},
  }], [blocked, snapshotCallbacks]);
  const columns = useMemo(() => helper.columns([
    createSelectionColumn<DependencyRecord>(),
    helper.accessor("name", { header: "Name", filterFn: "includesString" }),
    helper.display({ id: "own", cell: ({ row }) => <OwnOutput table={table} row={row} commit={commit} /> }),
    helper.display({ id: "global", cell: ({ row, table: core }) => variant === "default"
      ? <Output id={`global-${row.id}`} commit={commit}>{Object.values(core.store.get().rowSelection).filter(Boolean).length}</Output>
      : <GlobalOutput table={table} row={row} commit={commit} /> }),
    // No dependency declaration: reads a different stable identity.
    helper.display({ id: "other", cell: ({ row, table: core }) => {
      const render = () => <Output id={`other-${row.id}`} commit={commit}>
        {core.getRow("b").getIsSelected() ? "B selected" : "B clear"}
      </Output>;
      return variant === "default" ? render()
        : <SelectionDependencyBoundary Subscribe={table.Subscribe} render={render} />;
    } }),
    helper.display({ id: "nested", cell: ({ row }) => <LocalParent table={table} row={row} commit={commit} /> }),
    helper.display({ id: "actions", cell: ({ row }) => {
      const render = () => <DataTableRowActions row={row} actions={actions} maxInlineActions={1} />;
      return variant === "default" ? render()
        : <SelectionDependencyBoundary Subscribe={table.Subscribe} render={render} />;
    } }),
  ]), [variant, actions, commit]);
  const subscribed = useMuiDataTable({
    data: records, columns, getRowId: row => row.id, enableRowPinning: true,
    enableRowSelection: (row): boolean => !limited || row.id === "a" || !table.store.get().rowSelection.a,
    getRowCanExpand: () => true, autoResetPageIndex: false,
    ...(controlled ? { state: { rowSelection: selection }, onRowSelectionChange: setSelection } : {}),
    initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
  }, state => variant === "default" ? state : { globalFilter: state.globalFilter });
  // Fixture-only full snapshot adaptation. A narrow hook's selected state is
  // NOT a full live TableState contract. This is a rollout blocker, not a cast.
  const table: DependencyTable = Object.assign({}, subscribed, { state: subscribed.store.get() });
  useLayoutEffect(() => { onTable?.(table); });
  useLayoutEffect(() => { diagnostics?.commit("owner", "selection-fixture"); });
  const observer = useMemo<DataTableRenderDiagnostics>(() => ({
    narrowRowSelection: variant === "boundaries", commit: diagnostics?.commit ?? (() => {}),
    measureRowModel: diagnostics?.measureRowModel ?? (read => read()),
  }), [variant, diagnostics]);
  return <DataTableRenderDiagnosticsContext.Provider value={observer}>
    <button onClick={() => controlled ? setSelection({ a: true, b: true }) : table.setRowSelection({ a: true, b: true })}>External select A and B</button>
    <button onClick={() => controlled ? setSelection({}) : table.setRowSelection({})}>External clear</button>
    <button onClick={() => setBlocked(value => !value)}>Toggle external policy</button>
    <button onClick={() => setMode(value => value === "table" ? "card" : "table")}>Switch presentation</button>
    <button onClick={() => setGeneration(value => value + 1)}>Remount renderer</button>
    <button onClick={() => setLimited(value => !value)}>Toggle eligibility policy</button>
    <button onClick={() => table.getRow("a").toggleExpanded()}>Expand A</button>
    <button onClick={() => table.getColumn("name")?.toggleSorting()}>Sort names</button>
    <label>Filter names <input value={String(subscribed.state.globalFilter ?? "")}
      onChange={event => table.setGlobalFilter(event.target.value)} /></label>
    <table.Subscribe selector={state => state}>{state => <>
      <output data-testid="raw-count">{Object.values(state.rowSelection).filter(Boolean).length}</output>
      <output data-testid="selected-ids">{Object.keys(state.rowSelection).filter(id => state.rowSelection[id]).sort().join(",")}</output>
      <output data-testid="filtered-count">{table.getFilteredSelectedRowModel().rows.length}</output>
    </>}</table.Subscribe>
    <div dir={direction}>
      <DataTable key={generation} table={table} toolbar={false} displayMode={mode}
        selectionBar={{}} pagination={{ pageSizeOptions: [2, 4] }}
        rowPinning={{ displayMode: "select-sticky" }}
        card={{ enableSelection: true, enableExpansion: true,
          renderHeader: ({ row }) => row.original.name,
          renderBody: ({ row, table: callbackTable }) => <>
            {snapshotCallbacks && <output data-testid={`snapshot-${row.id}`}>
              Callback snapshot: {Object.values(callbackTable.state.rowSelection ?? {}).filter(Boolean).length}
            </output>}
            <OwnOutput table={table} row={row} commit={commit} />
            <GlobalOutput table={table} row={row} commit={commit} />
            <LocalParent table={table} row={row} commit={commit} />
          </>, actions }}
        renderDetailPanel={({ row }) => conditionalDetail && !Object.values(table.store.get().rowSelection).some(Boolean)
          ? null : <GlobalOutput table={table} row={row} commit={commit} prefix="detail" />} />
    </div>
  </DataTableRenderDiagnosticsContext.Provider>;
}

export function SelectionDependenciesAcceptance() {
  const [variant, setVariant] = useState<DependencyVariant>("default");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [snapshots, setSnapshots] = useState(false);
  const [environment, setEnvironment] = useState("");
  useEffect(() => {
    const update = () => setEnvironment(`${navigator.userAgent}; viewport ${innerWidth}×${innerHeight}; development`);
    update();
    addEventListener("resize", update);
    return () => removeEventListener("resize", update);
  }, []);
  const theme = useMemo(() => createTheme({ direction }), [direction]);
  return <ThemeProvider theme={theme}>
    <h1>Selection dependency acceptance — fixture only</h1>
    <p>Independent outputs; no production subscription defaults changed.</p>
    <p data-testid="environment">{environment}</p>
    <label>Variant <select value={variant} onChange={event => setVariant(event.target.value === "boundaries" ? "boundaries" : "default")}>
      <option value="default">Production default</option><option value="boundaries">Experimental output boundaries</option>
    </select></label>
    <button onClick={() => setDirection(value => value === "ltr" ? "rtl" : "ltr")}>Toggle direction</button>
    <label><input type="checkbox" checked={snapshots} onChange={event => setSnapshots(event.target.checked)} />
      Existing callback snapshot probe (expected failure in experimental mode)</label>
    <SelectionDependenciesFixture key={`${variant}/${snapshots}`} variant={variant} direction={direction}
      snapshotCallbacks={snapshots} />
  </ThemeProvider>;
}
