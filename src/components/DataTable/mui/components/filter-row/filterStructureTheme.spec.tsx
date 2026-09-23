import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableDensityProvider } from "../../density";
import type { MuiDataTableDensity } from "../../density";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { dataTableClasses } from "../../styles";
import { DataTableFilterRow } from "./DataTableFilterRow";
import { DataTableColumnGroup } from "../DataTableColumnGroup";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableColumnFilter: true,
    meta: { filterVariant: "text", filterLabel: "Name" },
  }),
  helper.display({ id: "actions", enableColumnFilter: false }),
]);
const data = [{ name: "Example" }];

function FilterStructure({
  density = "comfortable",
  headerRowCount = 1,
}: {
  density?: MuiDataTableDensity;
  headerRowCount?: number;
}) {
  const table = useMuiDataTable({ columns, data });
  return (
    <DataTableAccessibilityProvider>
      <DataTableDensityProvider density={density}>
        <button
          onClick={() => table.setColumnSizing({ name: 240, actions: 80 })}
        >
          Resize
        </button>
        <button
          onClick={() =>
            table.setColumnPinning({ start: ["name", "actions"], end: [] })
          }
        >
          Pin start
        </button>
        <button
          onClick={() =>
            table.setColumnPinning({ start: [], end: ["name", "actions"] })
          }
        >
          Pin end
        </button>
        <button onClick={() => table.setColumnPinning({ start: [], end: [] })}>
          Unpin
        </button>
        <table>
          <DataTableColumnGroup table={table} />
          <thead>
            <DataTableFilterRow table={table} headerRowCount={headerRowCount} />
          </thead>
        </table>
        <button onClick={() => table.setColumnPinning({ start: ["actions"], end: [] })}>Pin actions</button>
        <button onClick={() => table.setColumnOrder(["actions", "name"])}>Reorder</button>
        <button onClick={() => table.setColumnVisibility({ actions: false })}>Hide actions</button>
      </DataTableDensityProvider>
    </DataTableAccessibilityProvider>
  );
}

it("applies family overrides to the real filter row and retains non-filterable grid cells", () => {
  const theme = createTheme({
    components: {
      RazethDataTable: {
        styleOverrides: {
          filterRow: { backgroundColor: "rgb(10, 20, 30)" },
          filterCell: {
            backgroundColor: "rgb(30, 20, 10)",
            paddingInline: "12px",
          },
        },
      },
    },
  });
  render(
    <ThemeProvider theme={theme}>
      <FilterStructure />
    </ThemeProvider>,
  );
  const row = screen.getByRole("row", { name: "Column filters" });
  expect(row).toHaveClass(dataTableClasses.filterRow);
  expect(row).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
  expect(row.children).toHaveLength(2);
  for (const cell of Array.from(row.children)) {
    expect(cell).toHaveClass(dataTableClasses.filterCell);
    expect(cell).toHaveStyle({
      backgroundColor: "rgb(30, 20, 10)",
      paddingInline: "12px",
    });
  }
  expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  const actionsCell = row.querySelector('[data-filter-column-id="actions"]');
  expect(actionsCell?.firstElementChild).toHaveAttribute("aria-hidden", "true");
  expect(actionsCell?.querySelector("input")).toBeNull();
});

it("keeps filter cells and column widths in the same order across pinning, reordering, and hiding", () => {
  const { container } = render(<FilterStructure />);
  const expectOrder = (ids: string[]) => {
    expect(Array.from(container.querySelectorAll("col")).map((col) => col.getAttribute("data-column-id"))).toEqual(ids);
    expect(Array.from(screen.getByRole("row", { name: "Column filters" }).children).map((cell) => cell.getAttribute("data-filter-column-id"))).toEqual(ids);
  };
  fireEvent.click(screen.getByRole("button", { name: "Resize" }));
  expectOrder(["name", "actions"]);
  fireEvent.click(screen.getByRole("button", { name: "Pin actions" }));
  expectOrder(["actions", "name"]);
  expect(container.querySelector("col")).toHaveStyle({ width: "80px" });
  fireEvent.click(screen.getByRole("button", { name: "Unpin" }));
  expectOrder(["name", "actions"]);
  fireEvent.click(screen.getByRole("button", { name: "Reorder" }));
  expectOrder(["actions", "name"]);
  fireEvent.click(screen.getByRole("button", { name: "Hide actions" }));
  expectOrder(["name"]);
});

it.each(["ltr", "rtl"] as const)(
  "updates sizing and logical pin geometry in %s",
  (direction) => {
    render(
      <ThemeProvider theme={createTheme({ direction })}>
        <FilterStructure />
      </ThemeProvider>,
    );
    const row = screen.getByRole("row", { name: "Column filters" });
    const nameCell = row.querySelector<HTMLElement>(
      '[data-filter-column-id="name"]',
    )!;
    const actionsCell = row.querySelector<HTMLElement>(
      '[data-filter-column-id="actions"]',
    )!;
    fireEvent.click(screen.getByRole("button", { name: "Resize" }));
    expect(nameCell.style.getPropertyValue("--DataTable-column-size")).toBe(
      "240px",
    );
    expect(actionsCell.style.getPropertyValue("--DataTable-column-size")).toBe(
      "80px",
    );

    fireEvent.click(screen.getByRole("button", { name: "Pin start" }));
    expect(
      actionsCell.style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("240px");
    expect(actionsCell).toHaveAttribute("data-pinned-boundary", "true");
    expect(nameCell).not.toHaveAttribute("data-pinned-boundary");
    expect(actionsCell).toHaveStyle({
      insetInlineStart: "var(--DataTable-column-pinned-offset)",
      zIndex: "4",
    });

    fireEvent.click(screen.getByRole("button", { name: "Pin end" }));
    expect(
      nameCell.style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("80px");
    expect(nameCell).toHaveAttribute("data-pinned-boundary", "true");
    expect(actionsCell).not.toHaveAttribute("data-pinned-boundary");
    expect(nameCell).toHaveStyle({
      insetInlineEnd: "var(--DataTable-column-pinned-offset)",
    });

    fireEvent.click(screen.getByRole("button", { name: "Unpin" }));
    expect(nameCell).not.toHaveAttribute("data-pinned");
    expect(nameCell).not.toHaveAttribute("data-pinned-boundary");
    expect(
      nameCell.style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("");
    expect(nameCell).toHaveStyle({ zIndex: "3" });
  },
);

it("updates sticky geometry when density or header depth changes", () => {
  const { rerender } = render(
    <FilterStructure density="compact" headerRowCount={2} />,
  );
  const cell = screen.getByRole("row", { name: "Column filters" })
    .firstElementChild as HTMLElement;
  expect(cell.style.getPropertyValue("--DataTable-filter-sticky-top")).toBe(
    "72px",
  );
  expect(cell.style.getPropertyValue("--DataTable-filter-cell-height")).toBe(
    "40px",
  );
  rerender(<FilterStructure density="spacious" headerRowCount={3} />);
  expect(cell.style.getPropertyValue("--DataTable-filter-sticky-top")).toBe(
    "216px",
  );
  expect(cell.style.getPropertyValue("--DataTable-filter-cell-height")).toBe(
    "68px",
  );
});
