import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableDensityProvider } from "../../density";
import { DataTableFilterDisplayProvider } from "../../filter-display";
import { DataTableFullscreenProvider } from "../../fullscreen";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTableToolbar } from "./DataTableToolbar";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "alpha" }];
function Fixture() {
  const table = useMuiDataTable({
    columns,
    data,
    initialState: {
      globalFilter: "alpha",
      columnFilters: [{ id: "name", value: "alpha" }],
    },
  });
  return (
    <table.AppTable>
      <DataTableAccessibilityProvider>
        <DataTableDensityProvider>
          <DataTableFullscreenProvider>
            <DataTableFilterDisplayProvider defaultColumnFilterDisplayMode="subheader">
              <DataTableToolbar
                table={table}
                searchMode="collapsible"
                defaultSearchOpen
                showFilterStatus
                showSelectionSummary={false}
              />
            </DataTableFilterDisplayProvider>
          </DataTableFullscreenProvider>
        </DataTableDensityProvider>
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}
const slots = [
  "toolbarActions",
  "toolbarFilterStatus",
  "searchToggleButton",
  "filterToggleButton",
  "densityButton",
  "fullscreenButton",
  "columnManagerButton",
] as const;
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbarActions: { backgroundColor: "rgb(10, 20, 30)" },
        toolbarFilterStatus: { backgroundColor: "rgb(10, 20, 30)" },
        searchToggleButton: { backgroundColor: "rgb(10, 20, 30)" },
        filterToggleButton: { backgroundColor: "rgb(10, 20, 30)" },
        densityButton: { backgroundColor: "rgb(10, 20, 30)" },
        fullscreenButton: { backgroundColor: "rgb(10, 20, 30)" },
        columnManagerButton: { backgroundColor: "rgb(10, 20, 30)" },
      },
    },
  },
});
function mount() {
  return render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
}
it("applies all action/status overrides through the structural family", () => {
  const { container } = mount();
  for (const slot of slots)
    expect(container.querySelector(`.${dataTableClasses[slot]}`)).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });
});
it("toggles filter presentation and clears filters without clearing search", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Show column filters" }));
  expect(
    screen.getByRole("button", { name: "Hide column filters" }),
  ).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("button", { name: "Clear all column filters (1 active)" }),
  ).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Clear all column filters (1 active)" }),
  );
  expect(screen.queryByText("1 filter")).toBeNull();
  expect(screen.getByRole("textbox")).toHaveValue("alpha");
});
it("preserves fullscreen state and density selection", async () => {
  mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Enter fullscreen table" }),
  );
  expect(
    screen.getByRole("button", { name: "Exit fullscreen table" }),
  ).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: "Compact" }));
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  expect(await screen.findByRole("menuitem", { name: "Compact" })).toHaveClass(
    "Mui-selected",
  );
});
it("opens the column manager through its dedicated trigger", async () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Manage table columns" }));
  expect(await screen.findByRole("dialog")).toBeVisible();
});
