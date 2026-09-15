import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTable, type DataTableProps } from "../components/DataTable";
import { DataTableDensityProvider, useDataTableDensity } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { DataTableThemeProps } from "./types";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "Alpha" }];
function Fixture(props: Omit<DataTableProps<{ name: string }>, "table">) {
  const table = useMuiDataTable({ columns, data });
  return <DataTable table={table} pagination={false} {...props} />;
}
function theme(defaultProps: DataTableThemeProps) {
  return createTheme({ components: { RazethDataTable: { defaultProps } } });
}
it("uses theme toolbar visibility while explicit true, object, and false win", () => {
  const hidden = theme({ enableToolbar: false });
  const view = render(
    <ThemeProvider theme={hidden}>
      <Fixture />
    </ThemeProvider>,
  );
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbar}`),
  ).toBeNull();
  for (const toolbar of [true, {}]) {
    view.rerender(
      <ThemeProvider theme={hidden}>
        <Fixture toolbar={toolbar} />
      </ThemeProvider>,
    );
    expect(
      view.container.querySelector(`.${dataTableClasses.toolbar}`),
    ).not.toBeNull();
  }
  view.rerender(
    <ThemeProvider theme={theme({ enableToolbar: true })}>
      <Fixture toolbar={false} />
    </ThemeProvider>,
  );
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbar}`),
  ).toBeNull();
});
it("uses action and search defaults with explicit toolbar overrides", () => {
  const configured = theme({
    enableGlobalSearch: false,
    enableColumnManager: false,
    enableDensityToggle: false,
    enableFullscreen: false,
  });
  const view = render(
    <ThemeProvider theme={configured}>
      <Fixture />
    </ThemeProvider>,
  );
  expect(screen.queryByRole("search")).toBeNull();
  for (const slot of [
    "columnManagerButton",
    "densityButton",
    "fullscreenButton",
  ] as const)
    expect(
      view.container.querySelector(`.${dataTableClasses[slot]}`),
    ).toBeNull();
  view.rerender(
    <ThemeProvider theme={configured}>
      <Fixture
        toolbar={{
          search: true,
          enableColumnManager: true,
          enableDensity: true,
          enableFullscreen: true,
        }}
      />
    </ThemeProvider>,
  );
  expect(screen.getByRole("search")).toBeVisible();
  for (const slot of [
    "columnManagerButton",
    "densityButton",
    "fullscreenButton",
  ] as const)
    expect(
      view.container.querySelector(`.${dataTableClasses[slot]}`),
    ).not.toBeNull();
});
it("applies themed search mode and placement and allows explicit overrides", () => {
  const configured = theme({
    searchMode: "collapsible",
    searchPosition: "start",
  });
  const view = render(
    <ThemeProvider theme={configured}>
      <Fixture />
    </ThemeProvider>,
  );
  expect(screen.queryByRole("search")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show global search" }));
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbarStart}`),
  ).toContainElement(screen.getByRole("search"));
  view.rerender(
    <ThemeProvider theme={configured}>
      <Fixture toolbar={{ searchMode: "always", searchPosition: "end" }} />
    </ThemeProvider>,
  );
  expect(
    view.container.querySelector(`.${dataTableClasses.toolbarEnd}`),
  ).toContainElement(screen.getByRole("search"));
  expect(
    screen.queryByRole("button", { name: "Hide global search" }),
  ).toBeNull();
});
function DensityProbe() {
  const { density, setDensity } = useDataTableDensity();
  return <button onClick={() => setDensity("spacious")}>{density}</button>;
}
it("initializes theme density without controlling it or resetting mounted state", () => {
  const view = render(
    <ThemeProvider theme={theme({ density: "compact" })}>
      <DataTableDensityProvider>
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "compact" }));
  expect(screen.getByRole("button", { name: "spacious" })).toBeVisible();
  view.rerender(
    <ThemeProvider theme={theme({ density: "comfortable" })}>
      <DataTableDensityProvider>
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  expect(screen.getByRole("button", { name: "spacious" })).toBeVisible();
});
it("prioritizes explicit initial density and preserves controlled callback semantics", () => {
  const onChange = jest.fn();
  const view = render(
    <ThemeProvider theme={theme({ density: "compact" })}>
      <DataTableDensityProvider
        defaultDensity="comfortable"
        onDensityChange={onChange}
      >
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  expect(screen.getByRole("button", { name: "comfortable" })).toBeVisible();
  view.rerender(
    <ThemeProvider theme={theme({ density: "compact" })}>
      <DataTableDensityProvider
        density="comfortable"
        onDensityChange={onChange}
      >
        <DensityProbe />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "comfortable" }));
  expect(onChange).toHaveBeenCalledWith("spacious");
  expect(screen.getByRole("button", { name: "comfortable" })).toBeVisible();
});
