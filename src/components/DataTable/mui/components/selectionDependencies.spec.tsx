import { useLayoutEffect, useState } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { RowSelectionState } from "@tanstack/table-core";
import { createMuiDataTableColumnHelper, useMuiDataTable, type MuiDataTableInstance } from "../table";
import { createSelectionColumn } from "../columns/selection";
import { createActionsColumn, type DataTableRowAction } from "../columns/actions";
import { DataTableRenderDiagnosticsContext } from "../diagnostics/renderDiagnostics";
import { DataTable } from "./DataTable";

type RecordRow = { id: string; name: string };
const data: RecordRow[] = [
  { id: "a", name: "Alpha" }, { id: "b", name: "Bravo" },
  { id: "c", name: "Charlie" }, { id: "d", name: "Delta" },
];
const helper = createMuiDataTableColumnHelper<RecordRow>();
const actions: DataTableRowAction<RecordRow>[] = [{
  id: "guarded", label: "Guarded action", inline: true,
  isDisabled: ({ table }) => table.getSelectedRowModel().rows.length >= 2,
  onClick: () => {},
}];
const columns = helper.columns([
  createSelectionColumn<RecordRow>(),
  helper.accessor("name", { header: "Name", filterFn: "includesString" }),
  // Deliberately reads global state without its own subscription. This is a
  // valid existing cell contract, not a promise that cells are row-local.
  helper.display({ id: "global", cell: ({ row, table }) =>
    <output data-testid={`global-${row.id}`}>{table.getSelectedRowModel().rows.length}</output> }),
  createActionsColumn({ actions }),
]);
const theme = createTheme();

function setup({ narrow = false, controlled = false, mode = "table" }: {
  narrow?: boolean; controlled?: boolean; mode?: "table" | "card";
} = {}) {
  let table: MuiDataTableInstance<RecordRow>;
  const commit = jest.fn();
  function Fixture() {
    const [selection, setSelection] = useState<RowSelectionState>({});
    const subscribed = useMuiDataTable({
      data, columns, getRowId: row => row.id, enableRowSelection: true,
      getRowCanExpand: () => true, autoResetPageIndex: false,
      initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
      ...(controlled ? { state: { rowSelection: selection }, onRowSelectionChange: setSelection } : {}),
    }, state => ({ globalFilter: state.globalFilter }));
    // Same fixture-only adapter as the profiling harness. No cast or second store.
    const instance = Object.assign({}, subscribed, { state: subscribed.store.get() });
    useLayoutEffect(() => { table = instance; });
    return <>
      <button onClick={() => setSelection({ b: true })}>External selection</button>
      <instance.Subscribe selector={state => state.rowSelection}>
        {selection => <output data-testid="count">{Object.values(selection).filter(Boolean).length}</output>}
      </instance.Subscribe>
      <DataTable table={instance} toolbar={false} pagination={false} displayMode={mode}
        selectionBar={{}}
        card={{ renderBody: ({ row }) => row.original.name, actions }}
        renderDetailPanel={({ row }) => <span>Detail {row.id}</span>} />
    </>;
  }
  const rendered = render(<ThemeProvider theme={theme}>
    <DataTableRenderDiagnosticsContext.Provider value={{ narrowRowSelection: narrow,
      commit, measureRowModel: read => read() }}>
      <Fixture />
    </DataTableRenderDiagnosticsContext.Provider>
  </ThemeProvider>);
  return { ...rendered, commit, table: () => table!, row: (id: string) =>
    rendered.container.querySelector<HTMLElement>(`[data-row-id="${id}"]`)! };
}

it("A1–A3, A6–A8: selection, deselection and cross-row global cells/actions stay current", () => {
  const { table, row } = setup();
  act(() => table().getRow("a").toggleSelected(true));
  expect(row("a")).toHaveAttribute("data-selected", "true");
  expect(row("b")).not.toHaveAttribute("data-selected");
  expect(screen.getByTestId("global-b")).toHaveTextContent("1");
  act(() => table().getRow("b").toggleSelected(true));
  expect(row("a")).toHaveAttribute("data-selected", "true");
  expect(screen.getByTestId("global-a")).toHaveTextContent("2");
  expect(within(row("a")).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
  act(() => table().getRow("b").toggleSelected(false));
  expect(row("b")).not.toHaveAttribute("data-selected");
  expect(screen.getByTestId("global-a")).toHaveTextContent("1");
  expect(within(row("a")).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
});

it("proves the row-local probe leaves a globally dependent cell and action stale", () => {
  const { table, row, commit } = setup({ narrow: true });
  act(() => table().getRow("a").toggleSelected(true));
  commit.mockClear();
  act(() => table().getRow("b").toggleSelected(true));
  expect(commit).toHaveBeenCalledWith("row", "b");
  expect(commit).not.toHaveBeenCalledWith("row", "a");
  expect(table().getSelectedRowModel().rows).toHaveLength(2);
  expect(screen.getByTestId("count")).toHaveTextContent("2");
  // Expected counterexample: this probe must not be rolled out as an optimization.
  expect(screen.getByTestId("global-a")).toHaveTextContent("1");
  expect(within(row("a")).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
});

it("A4–A5: page select-all and clear agree with rows, header and global count", () => {
  const { table, row } = setup();
  const all = screen.getByRole("checkbox", { name: /select all/i });
  fireEvent.click(all);
  expect(all).toBeChecked();
  expect(screen.getByTestId("count")).toHaveTextContent("2");
  expect(screen.getByText("2 rows selected")).toBeVisible();
  for (const id of ["a", "b"]) expect(row(id)).toHaveAttribute("data-selected", "true");
  fireEvent.click(screen.getByRole("button", { name: "Clear all selected rows" }));
  expect(all).not.toBeChecked();
  expect(screen.getByTestId("count")).toHaveTextContent("0");
  expect(screen.queryByText("2 rows selected")).not.toBeInTheDocument();
  for (const id of ["a", "b"]) {
    expect(row(id)).not.toHaveAttribute("data-selected");
    expect(screen.getByTestId(`global-${id}`)).toHaveTextContent("0");
  }
});

it("A9–A11: off-page/filtered selection survives with stable IDs after sorting", () => {
  const { table, row } = setup();
  act(() => table().getRow("a").toggleSelected(true));
  act(() => table().setPageIndex(1));
  expect(row("a")).toBeNull();
  expect(screen.getByTestId("global-c")).toHaveTextContent("1");
  act(() => table().getRow("c").toggleSelected(true));
  expect(screen.getByTestId("count")).toHaveTextContent("2");
  act(() => { table().setPageIndex(0); table().setGlobalFilter("Bravo"); });
  expect(row("b")).not.toHaveAttribute("data-selected");
  expect(screen.getByTestId("global-b")).toHaveTextContent("2");
  act(() => { table().setGlobalFilter(""); table().setSorting([{ id: "name", desc: true }]); });
  expect(row("d")).not.toHaveAttribute("data-selected");
  expect(row("c")).toHaveAttribute("data-selected", "true");
  expect(screen.getByTestId("count")).toHaveTextContent("2");
});

it("A12: external controlled selection reaches all consumers", () => {
  const { row } = setup({ controlled: true });
  fireEvent.click(screen.getByRole("button", { name: "External selection" }));
  expect(row("b")).toHaveAttribute("data-selected", "true");
  expect(screen.getByTestId("global-a")).toHaveTextContent("1");
  expect(screen.getByTestId("count")).toHaveTextContent("1");
});

it("card actions preserve the same cross-row guard", () => {
  const { table, row, commit } = setup({ mode: "card", narrow: true });
  act(() => table().getRow("a").toggleSelected(true));
  commit.mockClear();
  act(() => table().getRow("b").toggleSelected(true));
  expect(commit).toHaveBeenCalledWith("row", "a");
  expect(commit).toHaveBeenCalledWith("row", "b");
  expect(within(row("a")).getByRole("button", { name: /^Guarded action/ })).toBeDisabled();
  act(() => table().resetRowSelection(true));
  expect(within(row("a")).getByRole("button", { name: /^Guarded action/ })).toBeEnabled();
});

