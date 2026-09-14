import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableResizing: false,
    enableColumnFilter: false,
    meta: { headerAlign: "center" },
  }),
]);
const data = [{ name: "A" }];
function Fixture() {
  const table = useMuiDataTable({ columns, data, enableColumnResizing: false });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <Table>
          <TableHead>
            <DataTableHeaderRow
              table={table}
              headerGroup={table.getHeaderGroups()[0]}
              headerRowIndex={0}
            />
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}

it("preserves centered action geometry and opens the themed menu without sorting", async () => {
  render(
    <ThemeProvider
      theme={createTheme({
        components: {
          RazethDataTable: {
            styleOverrides: {
              columnMenuButton: { backgroundColor: "rgb(10, 20, 30)" },
            },
          },
        },
      })}
    >
      <Fixture />
    </ThemeProvider>,
  );
  const label = screen.getByRole("button", { name: "Name" });
  const menu = screen.getByRole("button", {
    name: "Open options for column name",
  });
  expect(menu).toHaveStyle({
    width: "20px",
    height: "20px",
    backgroundColor: "rgb(10, 20, 30)",
  });
  const content = document.querySelector(`.${dataTableClasses.headerContent}`)!;
  expect(content).toHaveStyle({
    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  });
  const track = document.querySelector(
    `.${dataTableClasses.headerLabelTrack}`,
  )!;
  expect(track).toContainElement(label);
  expect(track).not.toContainElement(menu);
  fireEvent.click(menu);
  expect(await screen.findByRole("menu")).toBeVisible();
  expect(menu).toHaveAttribute("aria-expanded", "true");
  expect(menu).toHaveStyle({ opacity: "1" });
  expect(label).not.toHaveAttribute("aria-pressed");
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  fireEvent.click(label);
  expect(label).toHaveAttribute("data-direction", "asc");
  expect(
    document.querySelector(`.${dataTableClasses.sortIcon}`),
  ).toHaveAttribute("data-direction", "asc");
  fireEvent.click(document.querySelector(`.${dataTableClasses.sortButton}`)!);
  expect(label).toHaveAttribute("data-direction", "desc");
});
