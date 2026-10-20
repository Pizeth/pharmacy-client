import { useLayoutEffect } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createMuiDataTableColumnHelper, useMuiDataTable, type MuiDataTableInstance } from "../table";
import { createSelectionColumn } from "../columns/selection";
import type { DataTableRowPinningDisplayMode } from "../row-pinning";
import { DataTable } from "./DataTable";

type RecordRow = { id: string; name: string };
const data: RecordRow[] = [
  { id: "a", name: "Alpha" }, { id: "b", name: "Bravo" },
  { id: "c", name: "Charlie" }, { id: "d", name: "Delta" },
];
const helper = createMuiDataTableColumnHelper<RecordRow>();
const columns = helper.columns([createSelectionColumn<RecordRow>(),
  helper.accessor("name", { header: "Name", filterFn: "includesString" })]);
const modes: DataTableRowPinningDisplayMode[] = [
  "top", "bottom", "top-and-bottom", "sticky", "select-top", "select-bottom", "select-sticky",
];

describe.each(["ltr", "rtl"] as const)("selection/pinning in %s", direction => {
  it.each(modes.flatMap(mode => [true, false].map(keep => [mode, keep] as const)))(
    "%s keeps unique identities through sort/filter/page with keepPinnedRows=%s", (mode, keep) => {
      let table: MuiDataTableInstance<RecordRow>;
      function Fixture() {
        const instance = useMuiDataTable({ data, columns, getRowId: row => row.id,
          enableRowSelection: true, enableRowPinning: true, keepPinnedRows: keep,
          autoResetPageIndex: false, enableColumnPinning: true,
          initialState: { pagination: { pageIndex: 0, pageSize: 4 },
            columnPinning: { start: ["__dataTableSelection"], end: ["name"] } },
        });
        useLayoutEffect(() => { table = instance; });
        return <DataTable table={instance} toolbar={false} pagination={false}
          defaultDensity="compact" rowPinning={{ displayMode: mode }} />;
      }
      const { container } = render(<ThemeProvider theme={createTheme({ direction })}><Fixture /></ThemeProvider>);
      const ids = () => Array.from(container.querySelectorAll("tr[data-row-id]"), row => row.getAttribute("data-row-id"));
      const assertUnique = (expected: string[]) => {
        expect(ids()).toEqual(expected);
        expect(new Set(ids()).size).toBe(ids().length);
      };
      // Reverse click order makes an insertion-order sticky-offset bug visible.
      for (const id of ["d", "b"]) {
        fireEvent.click(screen.getByRole("checkbox", { name: `Select row ${id}` }));
        if (!mode.startsWith("select-")) act(() => table!.getRow(id).pin(
          mode === "bottom" || ((mode === "sticky" || mode === "top-and-bottom") && id === "d") ? "bottom" : "top",
        ));
      }
      const sticky = mode.includes("sticky");
      const bottom = mode === "bottom" || mode === "select-bottom";
      const split = mode === "top-and-bottom" || mode === "sticky";
      assertUnique(sticky ? ["a", "b", "c", "d"] : bottom ? ["a", "c", "d", "b"] : split ? ["b", "a", "c", "d"] : ["d", "b", "a", "c"]);
      if (mode === "select-sticky") {
        const b = container.querySelector('tr[data-row-id="b"]');
        const d = container.querySelector('tr[data-row-id="d"]');
        expect(b).toHaveStyle({ "--DataTable-row-pinned-offset": "36px", "--DataTable-row-pinned-bottom-offset": "37px" });
        expect(d).toHaveStyle({ "--DataTable-row-pinned-offset": "73px", "--DataTable-row-pinned-bottom-offset": "0px" });
      }
      act(() => table!.setSorting([{ id: "name", desc: true }]));
      assertUnique(sticky ? ["d", "c", "b", "a"] : bottom ? ["c", "a", "d", "b"] : split ? ["b", "c", "a", "d"] : ["d", "b", "c", "a"]);
      if (mode === "select-sticky") expect(container.querySelector('tr[data-row-id="d"]'))
        .toHaveStyle({ "--DataTable-row-pinned-offset": "36px", "--DataTable-row-pinned-bottom-offset": "37px" });
      act(() => table!.setPageSize(2));
      assertUnique(!keep ? (!sticky && (bottom || split) ? ["c", "d"] : ["d", "c"]) : sticky ? ["b", "d", "c"] : bottom ? ["c", "d", "b"] : split ? ["b", "c", "d"] : ["d", "b", "c"]);
      act(() => table!.setGlobalFilter("Charlie"));
      assertUnique(!keep ? ["c"] : bottom ? ["c", "d", "b"] : split ? ["b", "c", "d"] : ["d", "b", "c"]);
      expect(table!.store.get().rowSelection).toEqual({ d: true, b: true });
      act(() => { table!.setGlobalFilter(""); table!.setPageSize(4); });
      fireEvent.click(screen.getByRole("checkbox", { name: "Select row b" }));
      expect(table!.getRow("b").getIsSelected()).toBe(false);
      if (mode.startsWith("select-")) expect(table!.getRow("b").getIsPinned()).toBe(false);
      expect(ids()).toHaveLength(4);
      expect(new Set(ids()).size).toBe(4);
    },
  );
});
