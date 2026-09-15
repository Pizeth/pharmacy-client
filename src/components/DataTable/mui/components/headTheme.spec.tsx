import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import { DataTableFilterDisplayProvider } from "../filter-display";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHead } from "./DataTableHead";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableSorting: false,
    enableResizing: false,
    meta: { headerAlign: "center", enableColumnMenu: false },
  }),
]);
const data = [{ name: "A" }];
function Fixture({ showFilters }: { showFilters: boolean }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <DataTableFilterDisplayProvider
          columnFilterDisplayMode="subheader"
          showColumnFilters={showFilters}
        >
          <DataTableAccessibilityProvider>
            <Table>
              <DataTableHead table={table} />
            </Table>
          </DataTableAccessibilityProvider>
        </DataTableFilterDisplayProvider>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        head: { backgroundColor: "rgb(11, 22, 33)" },
        headerCell: { color: "rgb(44, 55, 66)" },
      },
    },
  },
});
it.each([false, true])(
  "themes the real head and preserves filter-row visibility: %s",
  (showFilters) => {
    render(
      <ThemeProvider theme={theme}>
        <Fixture showFilters={showFilters} />
      </ThemeProvider>,
    );
    const head = screen.getByRole("rowgroup");
    expect(head.tagName).toBe("THEAD");
    expect(head).toHaveClass(dataTableClasses.head);
    expect(head).toHaveStyle({ backgroundColor: "rgb(11, 22, 33)" });
    expect(screen.getAllByRole("row")).toHaveLength(showFilters ? 2 : 1);
    const cell = screen.getByRole("columnheader", { name: "Name" });
    expect(cell).toHaveStyle({ color: "rgb(44, 55, 66)" });
    const track = cell.querySelector(`.${dataTableClasses.headerLabelTrack}`)!;
    // The intentional header accent remains independent of the body/cell text.
    expect(track).toHaveStyle({ color: theme.palette.error.main });
    expect(cell).toHaveAttribute("scope", "col");
  },
);
