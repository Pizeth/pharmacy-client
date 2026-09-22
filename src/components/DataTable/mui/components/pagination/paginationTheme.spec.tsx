import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  DataTableDensityProvider,
  getDataTableDensityMetrics,
} from "../../density";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTablePagination } from "./DataTablePagination";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "A" }];
function Fixture({
  count = 3,
  showSize = true,
  rowCount,
}: {
  count?: number;
  showSize?: boolean;
  rowCount?: number;
}) {
  const table = useMuiDataTable({
    columns,
    data,
    manualPagination: true,
    pageCount: count,
    rowCount,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });
  return (
    <table.AppTable>
      <DataTablePagination
        table={table}
        pageSizeOptions={[10, 25]}
        showPageSizeSelector={showSize}
      />
    </table.AppTable>
  );
}
const slots = [
  "pagination",
  "paginationDivider",
  "paginationStart",
  "paginationControls",
  "paginationStatus",
  "paginationActions",
  "paginationButton",
  "pageSize",
  "pageSizeLabel",
  "pageSizeSelect",
] as const;
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: Object.fromEntries(
        slots.map((slot) => [slot, { backgroundColor: "rgb(10, 20, 30)" }]),
      ),
    },
  },
});
function mount(
  count = 3,
  density: "compact" | "comfortable" | "spacious" = "comfortable",
  showSize = true,
) {
  return render(
    <ThemeProvider theme={theme}>
      <DataTableDensityProvider density={density}>
        <Fixture count={count} showSize={showSize} />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
}
it("exposes all pagination theme slots", () => {
  const { container } = mount();
  for (const slot of slots)
    expect(container.querySelector(`.${dataTableClasses[slot]}${slot === "paginationButton" ? ":not([disabled])" : ""}`)).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });
  expect(
    container.querySelector(`.${dataTableClasses.pagination}`)?.tagName,
  ).toBe("FOOTER");
});
it.each(["compact", "comfortable", "spacious"] as const)(
  "keeps %s footer geometry",
  (density) => {
    const { container } = mount(3, density);
    const metrics = getDataTableDensityMetrics(density);
    expect(
      container.querySelector(`.${dataTableClasses.pagination}`),
    ).toHaveStyle({
      minHeight: `${metrics.footerHeight}px`,
      paddingBlock: theme.spacing(metrics.footerPaddingBlock),
    });
  },
);
it("navigates known pages and disables boundary controls", () => {
  mount();
  expect(screen.getByText("Page 1 of 3")).toBeVisible();
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByText("Page 2 of 3")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Last page" }));
  expect(screen.getByText("Page 3 of 3")).toBeVisible();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "First page" }));
  expect(screen.getByText("Page 1 of 3")).toBeVisible();
});
it("renders an MRT-style row range when the exact total is known", () => {
  render(
    <ThemeProvider theme={theme}>
      <DataTableDensityProvider density="comfortable">
        <Fixture count={3} rowCount={26} />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );

  expect(screen.getByText("1–10 of 26")).toBeVisible();

  fireEvent.click(screen.getByRole("button", { name: "Next page" }));

  expect(screen.getByText("11–20 of 26")).toBeVisible();

  fireEvent.click(screen.getByRole("button", { name: "Last page" }));

  expect(screen.getByText("21–26 of 26")).toBeVisible();
});

it("keeps unknown totals open-ended and hides first/last controls", () => {
  mount(-1);
  expect(screen.getByText("Page 1")).toBeVisible();
  expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
  expect(screen.queryByRole("button", { name: "First page" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByText("Page 2")).toBeVisible();
});
it("preserves the empty-page display and optional size selector", () => {
  mount(0, "comfortable", false);
  expect(screen.getByText("Page 1 of 1")).toBeVisible();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  expect(screen.queryByRole("combobox")).toBeNull();
});
it("commits a selected page size to TanStack", async () => {
  mount();
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Rows per page" }));
  fireEvent.click(
    await screen.findByRole("option", { name: "25" }),
  );
  expect(
    screen.getByRole("combobox", { name: "Rows per page" }),
  ).toHaveTextContent("25");
});
