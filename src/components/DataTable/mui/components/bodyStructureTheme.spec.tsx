import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import {
  DataTableDensityProvider,
  getDataTableDensityMetrics,
} from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";

type Row = { name: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    cell: (info) => `Cell: ${info.getValue()}`,
  }),
]);
const data = [{ name: "alpha" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        body: { backgroundColor: "rgb(10, 20, 30)" },
        bodyRow: { borderTopWidth: "3px" },
      },
    },
  },
});
function mount(
  state: "data" | "empty" | "loading" | "error" = "data",
  density: "compact" | "comfortable" | "spacious" = "comfortable",
) {
  let table!: MuiDataTableInstance<Row>;
  function Fixture() {
    table = useMuiDataTable({
      columns,
      data: state === "empty" ? [] : data,
      meta: {
        loading: state === "loading",
        error: state === "error" ? "Unavailable" : undefined,
      },
    });
    return (
      <table.AppTable>
        <DataTableDensityProvider density={density}>
          <Table>
            <DataTableBody table={table} />
          </Table>
        </DataTableDensityProvider>
      </table.AppTable>
    );
  }
  const result = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
  return { ...result, getTable: () => table };
}
it.each(["data", "empty", "loading", "error"] as const)(
  "themes the tbody in the %s branch",
  (state) => {
    mount(state);
    const body = screen.getByRole("rowgroup");
    expect(body.tagName).toBe("TBODY");
    expect(body).toHaveClass(dataTableClasses.body);
    expect(body).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
    if (state === "data")
      expect(screen.getByRole("cell", { name: "Cell: alpha" })).toBeVisible();
    if (state === "error")
      expect(screen.getByText("Unavailable")).toBeVisible();
  },
);
it.each(["compact", "comfortable", "spacious"] as const)(
  "preserves %s row height and row overrides",
  (density) => {
    const { container } = mount("data", density);
    expect(container.querySelector(`.${dataTableClasses.bodyRow}`)).toHaveStyle(
      {
        minHeight: `${getDataTableDensityMetrics(density).bodyRowHeight}px`,
        borderTopWidth: "3px",
      },
    );
  },
);
it("derives selected row appearance from TanStack without replacing cell rendering", () => {
  const { container, getTable } = mount();
  const row = container.querySelector(`.${dataTableClasses.bodyRow}`)!;
  expect(
    getComputedStyle(row).getPropertyValue("--DataTable-row-background"),
  ).toBe(theme.palette.background.paper);
  act(() => getTable().setRowSelection({ "0": true }));
  expect(row).toHaveAttribute("data-selected", "true");
  expect(row).toHaveClass("Mui-selected");
  expect(
    getComputedStyle(row).getPropertyValue("--DataTable-row-background"),
  ).toBe("var(--DataTable-row-selected-background)");

  expect(
    getComputedStyle(row).getPropertyValue(
      "--DataTable-row-selected-background",
    ),
  ).not.toBe("");
  expect(screen.getByRole("cell", { name: "Cell: alpha" })).toBeVisible();
  act(() => getTable().setRowSelection({}));
  expect(row).not.toHaveAttribute("data-selected");
});
