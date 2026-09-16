import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";

type Row = { a: string; b: string; c: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("a", { size: 100, meta: { align: "start" } }),
  helper.accessor("b", { size: 120, meta: { align: "center" } }),
  helper.accessor("c", { size: 140, meta: { align: "end" } }),
]);
const data = [{ a: "A", b: "B", c: "C" }];
function mount(direction: "ltr" | "rtl" = "ltr") {
  let table!: MuiDataTableInstance<Row>;
  function Fixture() {
    table = useMuiDataTable({ columns, data });
    return (
      <table.AppTable>
        <DataTableDensityProvider density="comfortable">
          <Table>
            <DataTableBody table={table} />
          </Table>
        </DataTableDensityProvider>
      </table.AppTable>
    );
  }
  const result = render(
    <ThemeProvider
      theme={createTheme({
        direction,
        components: {
          RazethDataTable: {
            styleOverrides: { bodyCell: { color: "rgb(10, 20, 30)" } },
          },
        },
      })}
    >
      <Fixture />
    </ThemeProvider>,
  );
  return { ...result, getTable: () => table };
}
function cell(name: string) {
  return screen.getByRole("cell", { name });
}
it("themes the cell and preserves width variables and physical alignment", () => {
  const { getTable } = mount();
  expect(cell("A")).toHaveClass(dataTableClasses.bodyCell);
  expect(cell("A")).toHaveStyle({
    color: "rgb(10, 20, 30)",
    textAlign: "left",
  });
  expect(cell("B")).toHaveStyle({ textAlign: "center" });
  expect(cell("C")).toHaveStyle({ textAlign: "right" });
  expect(cell("A").style.getPropertyValue("--DataTable-column-size")).toBe(
    "100px",
  );
  expect(cell("A").style.width).toBe("");
  act(() => getTable().setColumnSizing({ a: 160 }));
  expect(cell("A").style.getPropertyValue("--DataTable-column-size")).toBe(
    "160px",
  );
});
it.each(["ltr", "rtl"] as const)(
  "updates logical pin offsets and boundaries in %s",
  (direction) => {
    const { getTable } = mount(direction);
    act(() => getTable().setColumnPinning({ start: ["a", "b"], end: ["c"] }));
    expect(
      cell("B").style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("100px");
    expect(cell("B")).toHaveAttribute("data-pinned-boundary", "true");
    expect(cell("A")).not.toHaveAttribute("data-pinned-boundary");
    expect(cell("B")).toHaveStyle({
      position: "sticky",
      insetInlineStart: "var(--DataTable-column-pinned-offset)",
    });
    expect(cell("C")).toHaveStyle({
      insetInlineEnd: "var(--DataTable-column-pinned-offset)",
    });
    act(() => getTable().setColumnSizing({ a: 160 }));
    expect(
      cell("B").style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("160px");
    act(() => getTable().setColumnVisibility({ b: false }));
    expect(screen.queryByRole("cell", { name: "B" })).toBeNull();
    expect(cell("A")).toHaveAttribute("data-pinned-boundary", "true");
    act(() => getTable().setColumnPinning({ start: [], end: [] }));
    expect(cell("A")).not.toHaveAttribute("data-pinned");
    expect(
      cell("A").style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("");
  },
);
it("reacts to column ordering without remounting the row", () => {
  const { getTable } = mount();
  act(() => getTable().setColumnOrder(["c", "a", "b"]));
  expect(screen.getAllByRole("cell").map((node) => node.textContent)).toEqual([
    "C",
    "A",
    "B",
  ]);
});

it("paints pinned state tints over a solid paper base", () => {
  const { getTable } = mount();
  act(() => getTable().setColumnPinning({ start: ["a"], end: [] }));
  expect(cell("A")).toHaveStyle({
    backgroundColor: "rgb(255, 255, 255)",
    backgroundImage:
      "linear-gradient(var(--DataTable-row-background), var(--DataTable-row-background))",
  });
  act(() => getTable().setRowSelection({ "0": true }));
  expect(cell("A")).toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" });
});
