import { StrictMode, createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { RowSelectionState } from "@tanstack/table-core";
import { createMuiDataTableColumnHelper, useMuiDataTable, useMuiDataTableContext, type MuiDataTableInstance } from "../table";
import { createSelectionColumn } from "../columns/selection";
import { createExpansionColumn } from "../columns/expansion";
import { DataTable } from "./DataTable";
import type { DataTableCardConfig } from "../presentation/card/types";
import { DataTableCardItem } from "../presentation/card/DataTableCardItem";
import { DataTableDetailPanelRow } from "./detail-panel/DataTableDetailPanelRow";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import { SelectionDependencyBoundary } from "../diagnostics/SelectionDependencyBoundary";

type RecordRow = { id: string; name: string };
type Table = MuiDataTableInstance<RecordRow>;
const data = [{ id: "a", name: "Alpha" }, { id: "b", name: "Bravo" }];
const helper = createMuiDataTableColumnHelper<RecordRow>();
const Policy = createContext(true);
const count = (table: Table) => Object.values(table.state.rowSelection).filter(Boolean).length;

function GlobalCell() {
  const table = useMuiDataTableContext<RecordRow>();
  return <output>{count(table)}</output>;
}
const columns = helper.columns([
  createExpansionColumn<RecordRow>(), createSelectionColumn<RecordRow>(),
  helper.accessor("name", { header: "Name", filterFn: "includesString" }),
  helper.display({ id: "global", cell: GlobalCell }),
]);
const emptyOutputs = { null: null, undefined, false: false, fragment: <></>, zero: 0, text: "" };
type Empty = keyof typeof emptyOutputs;

function setup({ empty = "null", mode = "table", flip = false, custom = false, controlled = false, strict = false, compact = false }: {
  empty?: Empty; mode?: "table" | "card"; flip?: boolean; custom?: boolean;
  controlled?: boolean; strict?: boolean; compact?: boolean;
} = {}) {
  let current: Table;
  const invoked = jest.fn();
  const committed = jest.fn();
  function Detail({ children }: { children: ReactNode }) {
    const allowed = useContext(Policy);
    useLayoutEffect(() => { committed(); });
    return <output data-testid="detail-output">{allowed ? children : "context blocked"}</output>;
  }
  function Fixture() {
    const [selection, setSelection] = useState<RowSelectionState>({});
    const [policy, setPolicy] = useState(true);
    const [presentation, setPresentation] = useState(mode);
    const [generation, setGeneration] = useState(0);
    const table = useMuiDataTable({ data, columns, getRowId: row => row.id,
      getRowCanExpand: () => true, autoResetPageIndex: false,
      ...(controlled ? { state: { rowSelection: selection }, onRowSelectionChange: setSelection } : {}),
    });
    useLayoutEffect(() => { current = table; });
    const detail: DataTableCardConfig<RecordRow>["renderDetail"] = ({ table: callback, row }) => {
      invoked(row.id, callback);
      if (row.id !== "a" || !policy || count(callback) === 0) return emptyOutputs[empty];
      return <Detail>{count(callback)}</Detail>;
    };
    const slot = (name: string): DataTableCardConfig<RecordRow>["renderBody"] =>
      function renderSlot({ table: callback, row }) {
        return count(callback) ? <output data-testid={`${name}-${row.id}`}>{count(callback)}</output> : null;
      };
    return <Policy.Provider value={policy}>
      <button onClick={() => setPolicy(value => !value)}>Policy</button>
      <button onClick={() => setSelection({ a: true, unloaded: true })}>External selection</button>
      <button onClick={() => setPresentation(value => value === "table" ? "card" : "table")}>Presentation</button>
      <button onClick={() => setGeneration(value => value + 1)}>Remount</button>
      <DataTable<RecordRow> key={generation} table={table} toolbar={false} displayMode={presentation} pagination={false}
        renderDetailPanel={detail}
        card={{ renderBody: slot("body"), enableSelection: !custom, enableExpansion: !custom,
          compactCard: compact, detailMode: flip ? "flip" : "inline", flip: { flipOnHover: false },
          ...(custom ? { renderHeader: slot("header"), renderMetadata: slot("metadata"),
            renderSelection: slot("selection"), renderExpansion: slot("expansion"),
            renderActions: ({ table: callback, row }) => count(callback) ?
              <button data-testid={`guard-${row.id}`} disabled={!policy || count(callback) > 1}>Guard</button> : null } : {}),
        }} />
    </Policy.Provider>;
  }
  const children = <ThemeProvider theme={createTheme()}><Fixture /></ThemeProvider>;
  const view = render(strict ? <StrictMode>{children}</StrictMode> : children);
  return { ...view, table: () => current!, invoked, committed,
    select: (id: string, selected = true) => act(() => current!.getRow(id).toggleSelected(selected)),
    expand: (expanded = true) => act(() => current!.getRow("a").toggleExpanded(expanded)),
    click: (name: string) => fireEvent.click(screen.getByRole("button", { name })),
    detailRow: () => view.container.querySelector('[data-detail-panel-row="a"]'),
    card: () => view.container.querySelector<HTMLElement>('[role="listitem"][data-row-id="a"]')!,
  };
}

it.each<Empty>(["null", "undefined", "false"])("N1–N4/N7/N10: %s physically inserts/removes a native detail row on B-only selection", empty => {
  const f = setup({ empty });
  expect(f.invoked).not.toHaveBeenCalled();
  f.expand();
  expect(f.detailRow()).toBeNull();
  f.select("b");
  expect(f.invoked.mock.calls.at(-1)?.[1]).toBe(f.table());
  const row = f.detailRow()!;
  expect(row.tagName).toBe("TR");
  expect(row.parentElement?.tagName).toBe("TBODY");
  expect(row.children).toHaveLength(1);
  expect(row.firstElementChild?.tagName).toBe("TD");
  expect(row.firstElementChild).toHaveAttribute("colspan", "4");
  const region = within(row as HTMLElement).getByRole("region");
  expect(document.getElementById(region.getAttribute("aria-labelledby")!)).toHaveAttribute("aria-controls", region.id);
  expect(screen.getByTestId("detail-output")).toHaveTextContent("1");
  expect(f.table().getRow("a").getIsSelected()).toBe(false);
  f.select("b", false);
  expect(f.detailRow()).toBeNull();
  expect(f.container.querySelectorAll("tbody > tr")).toHaveLength(2);
});

it.each<Empty>(["fragment", "zero", "text"])("N5/N6: preserves legacy physical renderable semantics for %s", empty => {
  const f = setup({ empty }); f.expand();
  expect(f.detailRow()).not.toBeNull();
  f.select("b"); expect(screen.getByTestId("detail-output")).toHaveTextContent("1");
  f.select("b", false); expect(screen.queryByTestId("detail-output")).not.toBeInTheDocument();
  expect(f.detailRow()).not.toBeNull();
});

it("N8–N12: policy, column membership, collapse, remount and Strict Mode retain valid physical structure", () => {
  const f = setup({ strict: true }); f.expand(); f.select("b");
  expect(f.container.querySelectorAll('[data-detail-panel-row="a"]')).toHaveLength(1);
  act(() => f.table().setColumnVisibility({ global: false }));
  expect(f.detailRow()?.firstElementChild).toHaveAttribute("colspan", "3");
  f.click("Policy"); expect(f.detailRow()).toBeNull();
  f.click("Policy"); expect(f.detailRow()).not.toBeNull();
  f.expand(false); expect(f.detailRow()).toBeNull();
  f.expand(); expect(f.detailRow()).not.toBeNull();
  f.click("Remount"); expect(screen.getByTestId("detail-output")).toHaveTextContent("1");
  f.unmount(); f.invoked.mockClear(); f.committed.mockClear();
  act(() => f.table().setRowSelection({}));
  expect(f.invoked).not.toHaveBeenCalled(); expect(f.committed).not.toHaveBeenCalled();
});

it.each([false, true])("C1/C3/C7: nullable physical card slots and global guards update (controlled=%s)", controlled => {
  const f = setup({ mode: "card", custom: true, controlled }); f.expand();
  expect(f.card().querySelector('[class*="-cardHeader"]')).toBeNull();
  expect(f.card().querySelector('[data-detail-panel]')).toBeNull();
  f.select("a"); f.select("b");
  for (const slot of ["header", "body", "metadata", "selection", "expansion"]) {
    expect(screen.getByTestId(`${slot}-a`)).toHaveTextContent("2");
  }
  expect(screen.getByTestId("guard-a")).toBeDisabled();
  expect(screen.getByTestId("detail-output")).toHaveTextContent("2");
  if (controlled) {
    f.click("External selection");
    expect(screen.getByTestId("body-a")).toHaveTextContent("2");
    expect(f.table().state.rowSelection).toEqual({ a: true, unloaded: true });
  }
  f.select("a", false); f.select("b", false);
  act(() => f.table().setRowSelection({}));
  expect(f.card().querySelector('[class*="-cardHeader"]')).toBeNull();
  expect(f.card().querySelector('[data-detail-panel]')).toBeNull();
});

it.each([false, true])("C4–C6/C8: defaults, compact=%s flip focus and table/card continuity", compact => {
  const f = setup({ mode: "card", flip: true, compact });
  const show = within(f.card()).getByRole("button", { name: "Show details" });
  act(() => show.focus()); fireEvent.click(show);
  expect(within(f.card()).getByRole("button", { name: "Back to front" })).toHaveFocus();
  expect(f.card().querySelector('[data-face="front"]')).toHaveAttribute("inert");
  f.select("a"); f.select("b");
  expect(screen.getByTestId("detail-output")).toHaveTextContent("2");
  f.click("Presentation");
  expect(f.detailRow()).not.toBeNull();
  expect(f.table().getRow("a").getIsExpanded()).toBe(true);
  f.click("Presentation");
  expect(within(f.card()).getByRole("checkbox")).toBeChecked();
  expect(screen.getByTestId("detail-output")).toHaveTextContent("2");
  f.click("Remount");
  expect(f.table().state.rowSelection).toEqual({ a: true, b: true });
  f.select("a", false); f.select("b", false);
  expect(screen.queryByTestId("detail-output")).not.toBeInTheDocument();
});

it.each(["table", "card"] as const)("S7: production %s detail updates below a row-local parent which skips B", mode => {
  let current: Table;
  const parentCommit = jest.fn();
  const callback = jest.fn(({ table }: { table: Table }) => count(table) ? <output data-testid="independent">{count(table)}</output> : null);
  function ParentCommit() {
    useLayoutEffect(() => { parentCommit(); });
    return null;
  }
  function Fixture() {
    const table = useMuiDataTable({ data, columns, getRowId: row => row.id,
      getRowCanExpand: () => true, initialState: { expanded: { a: true } } });
    useLayoutEffect(() => { current = table; });
    // Retain a genuine initial hook wrapper solely as a deliberately unchanged
    // low-level prop. The invocation boundary must receive the current genuine
    // AppTable value, not this old prop or a manufactured store snapshot.
    const [initialTable] = useState(() => table);
    const row = table.getRow("a");
    const Subscribe = table.Subscribe;
    const localRender = useMemo(() => function renderLocalParent() { return <>
      <ParentCommit />
      {mode === "table" ? <DataTableDetailPanelRow table={initialTable} row={row} renderDetailPanel={callback} /> :
        <DataTableCardItem row={row} config={{ renderBody: () => "Alpha", renderDetail: callback }} />}
    </>; }, [initialTable, row]);
    const output = <SelectionDependencyBoundary Subscribe={Subscribe} selectionDependency="row" rowId="a" render={localRender} />;
    return <table.AppTable><DataTableAccessibilityProvider><DataTableDensityProvider>
      {mode === "table" ? <table><tbody>{output}</tbody></table> : <div role="list">{output}</div>}
    </DataTableDensityProvider></DataTableAccessibilityProvider></table.AppTable>;
  }
  const f = render(<ThemeProvider theme={createTheme()}><Fixture /></ThemeProvider>);
  expect(screen.queryByTestId("independent")).not.toBeInTheDocument();
  parentCommit.mockClear();
  act(() => current!.getRow("b").toggleSelected(true));
  expect(parentCommit).not.toHaveBeenCalled();
  expect(screen.getByTestId("independent")).toHaveTextContent("1");
  expect(callback.mock.calls.at(-1)?.[0].table).toBe(current!);
  act(() => current!.getRow("b").toggleSelected(false));
  expect(parentCommit).not.toHaveBeenCalled();
  expect(screen.queryByTestId("independent")).not.toBeInTheDocument();
  expect(f.container.querySelector('[data-detail-panel-row="a"]')).toBeNull();
});
