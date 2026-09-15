import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTableToolbar } from "./DataTableToolbar";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "alpha" }];
function Fixture({
  position = "center",
  collapsible = false,
}: {
  position?: "start" | "center" | "end";
  collapsible?: boolean;
}) {
  const table = useMuiDataTable({
    columns,
    data,
    initialState: { globalFilter: "alpha" },
  });
  return (
    <table.AppTable>
      <DataTableAccessibilityProvider>
        <DataTableToolbar
          table={table}
          searchPosition={position}
          searchMode={collapsible ? "collapsible" : "always"}
          defaultSearchOpen
          showSelectionSummary={false}
          enableFilterToggle={false}
          enableColumnManager={false}
          enableDensity={false}
          enableFullscreen={false}
          startContent={<span>Start action</span>}
          endContent={<span>End action</span>}
        />
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbar: { backgroundColor: "rgb(10, 20, 30)" },
        toolbarRow: { minHeight: "48px" },
        toolbarStart: { backgroundColor: "rgb(20, 30, 40)" },
        toolbarCenter: { backgroundColor: "rgb(30, 40, 50)" },
        toolbarEnd: { backgroundColor: "rgb(40, 50, 60)" },
        toolbarSearch: { borderRadius: "7px" },
        toolbarSearchRow: { paddingTop: "9px" },
      },
    },
  },
});
it.each(["start", "center", "end"] as const)(
  "preserves desktop %s search placement and themed regions",
  (position) => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture position={position} />
      </ThemeProvider>,
    );
    const root = container.querySelector(`.${dataTableClasses.toolbar}`)!;
    expect(root.tagName).toBe("HEADER");
    expect(root).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
    expect(
      container.querySelector(`.${dataTableClasses.toolbarRow}`),
    ).toHaveStyle({ minHeight: "48px" });
    const region =
      position === "start"
        ? "toolbarStart"
        : position === "end"
          ? "toolbarEnd"
          : "toolbarCenter";
    const search = screen.getByRole("search", { name: "Table search" });
    expect(
      container.querySelector(`.${dataTableClasses[region]}`),
    ).toContainElement(search);
    expect(search).toHaveStyle({ borderRadius: "7px" });
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByText("Start action")).toBeVisible();
    expect(screen.getByText("End action")).toBeVisible();
  },
);
it("hides and reopens search without clearing TanStack's query", () => {
  render(
    <ThemeProvider theme={theme}>
      <Fixture collapsible />
    </ThemeProvider>,
  );
  expect(screen.getByRole("textbox")).toHaveValue("alpha");
  fireEvent.click(screen.getByRole("button", { name: "Hide global search" }));
  expect(screen.queryByRole("search")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show global search" }));
  expect(screen.getByRole("textbox")).toHaveValue("alpha");
});

it("moves the single search field to its themed row on narrow screens", () => {
  const original = window.matchMedia;
  window.matchMedia = (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
  try {
    const { container, unmount } = render(
      <ThemeProvider theme={theme}>
        <Fixture position="end" />
      </ThemeProvider>,
    );
    const row = container.querySelector(
      `.${dataTableClasses.toolbarSearchRow}`,
    )!;
    expect(row).toHaveStyle({ paddingTop: "9px", width: "100%" });
    expect(row).toContainElement(screen.getByRole("search"));
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(
      container.querySelector(`.${dataTableClasses.toolbarCenter}`),
    ).toBeNull();
    unmount();
  } finally {
    window.matchMedia = original;
  }
});
