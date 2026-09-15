import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import type { RowSelectionState } from "@tanstack/table-core";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import type { MuiDataTableInstance } from "../../table";
import { DataTableToolbarSelection } from "./DataTableToolbarSelection";

type Row = { id: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([helper.accessor("id", { header: "ID" })]);
const data = [{ id: "visible" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbarSelection: { backgroundColor: "rgb(10, 20, 30)" },
      },
    },
  },
});
function mount(selection: RowSelectionState) {
  let table!: MuiDataTableInstance<Row>;
  function Fixture() {
    table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
      initialState: { rowSelection: selection },
      manualPagination: true,
    });
    return (
      <table.AppTable>
        <DataTableToolbarSelection table={table} />
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
it("themes the selection summary and counts selected IDs outside the loaded page", () => {
  const { container } = mount({ visible: true, offPage: true });
  expect(screen.getByText("2 selected")).toBeVisible();
  expect(
    container.querySelector(`.${dataTableClasses.toolbarSelection}`),
  ).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
  expect(screen.queryByRole("button")).toBeNull();
});
it("omits the summary when selection is empty", () => {
  const { container } = mount({});
  expect(container.querySelector(`.${dataTableClasses.toolbarSelection}`)).toBeNull();
});

it("tracks TanStack selection changes and removes the summary when cleared", () => {
  const { getTable } = mount({});
  act(() => getTable().setRowSelection({ visible: true }));
  expect(screen.getByText("1 selected")).toBeVisible();
  act(() => getTable().setRowSelection({ visible: true, offPage: true }));
  expect(screen.getByText("2 selected")).toBeVisible();
  act(() => getTable().setRowSelection({}));
  expect(screen.queryByText(/selected/)).toBeNull();
});
