import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import { DataTableBody } from "../components/DataTableBody";
import { DataTableHeaderRow } from "../components/DataTableHeaderRow";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { dataTableClasses } from "../styles";
import { createSelectionColumn } from "./selection";
import { createExpansionColumn } from "./expansion";

type Row = { id: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  createSelectionColumn<Row>(),
  createExpansionColumn<Row>(),
  helper.accessor("id", {
    enableResizing: false,
    meta: { enableColumnMenu: false },
  }),
]);
const data = [{ id: "a" }, { id: "b" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        selectAllCheckbox: { borderRadius: "7px" },
        selectRowCheckbox: { borderRadius: "7px" },
        expandRowButton: { borderRadius: "7px" },
        expandAllButton: { borderRadius: "7px" },
      },
    },
  },
});
function mount(disabled = false) {
  function Fixture() {
    const table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: (row) => !disabled || row.id !== "b",
      getRowCanExpand: () => !disabled,
    });
    return (
      <table.AppTable>
        <DataTableAccessibilityProvider>
          <DataTableDensityProvider>
            <Table>
              <TableHead>
                <DataTableHeaderRow
                  table={table}
                  headerGroup={table.getHeaderGroups()[0]}
                  headerRowIndex={0}
                />
              </TableHead>
              <DataTableBody
                table={table}
                renderDetailPanel={({ row }) => <span>Details {row.id}</span>}
              />
            </Table>
          </DataTableDensityProvider>
        </DataTableAccessibilityProvider>
      </table.AppTable>
    );
  }
  return render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
}
it("applies utility control overrides without changing expansion geometry", () => {
  const { container } = mount();
  for (const slot of [
    "selectAllCheckbox",
    "selectRowCheckbox",
    "expandRowButton",
    "expandAllButton",
  ] as const) {
    expect(container.querySelector(`.${dataTableClasses[slot]}`)).toHaveStyle({
      borderRadius: "7px",
    });
  }
  expect(
    screen.getByRole("button", { name: "Expand details for row a" }),
  ).toHaveStyle({ width: "28px", height: "28px" });
});
it("preserves individual, indeterminate and select-all page behavior", () => {
  mount();
  const all = screen.getByRole("checkbox", {
    name: "Select all rows on current page",
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Select row a" }));
  expect(screen.getByRole("checkbox", { name: "Select row a" })).toBeChecked();
  expect(all).toHaveAttribute("data-indeterminate", "true");
  fireEvent.click(all);
  expect(screen.getByRole("checkbox", { name: "Select row b" })).toBeChecked();
  expect(all).toBeChecked();
  fireEvent.click(all);
  expect(
    screen.getByRole("checkbox", { name: "Select row a" }),
  ).not.toBeChecked();
});
it("links row expansion to its real detail panel and supports expand-all", () => {
  mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Expand details for row a" }),
  );
  const button = screen.getByRole("button", {
    name: "Collapse details for row a",
  });
  const panel = document.getElementById(button.getAttribute("aria-controls")!);
  expect(panel).toHaveAttribute("role", "region");
  expect(panel).toHaveAttribute("aria-labelledby", button.id);
  expect(panel).toHaveTextContent("Details a");
  fireEvent.click(
    screen.getByRole("button", { name: "Expand all expandable rows" }),
  );
  expect(screen.getByText("Details b")).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Collapse all expandable rows" }),
  );
  expect(screen.queryByText("Details a")).toBeNull();
});
it("respects non-selectable and non-expandable rows", () => {
  mount(true);
  expect(screen.getByRole("checkbox", { name: "Select row b" })).toBeDisabled();
  expect(
    screen.queryByRole("button", { name: "Expand details for row a" }),
  ).toBeNull();
  expect(
    screen.getByRole("button", { name: "Expand all expandable rows" }),
  ).toBeDisabled();
});
