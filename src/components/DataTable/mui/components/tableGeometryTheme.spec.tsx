import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, fireEvent, render } from "@testing-library/react";

import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTable } from "./DataTable";

type Row = {
  readonly name: string;
  readonly status: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    size: 120,
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    meta: {
      enableColumnMenu: false,
    },
  }),
  helper.accessor("status", {
    header: "Status",
    size: 180,
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    meta: {
      enableColumnMenu: false,
    },
  }),
]);

const data: readonly Row[] = [
  {
    name: "Alpha",
    status: "Enabled",
  },
];

interface FixtureProps {
  readonly tableWidth?: React.CSSProperties["width"];
  readonly tableMinWidth?: React.CSSProperties["minWidth"];
}

function Fixture(props: FixtureProps) {
  const { tableWidth, tableMinWidth } = props;

  const table = useMuiDataTable({
    columns,
    data: [...data],
    enableColumnResizing: false,
  });

  return (
    <DataTable
      table={table}
      toolbar={false}
      pagination={false}
      tableWidth={tableWidth}
      tableMinWidth={tableMinWidth}
    />
  );
}

function getTable(container: HTMLElement): HTMLTableElement {
  const table = container.querySelector<HTMLTableElement>(
    `.${dataTableClasses.table}`,
  );

  if (!table) {
    throw new Error("Missing DataTable native table slot.");
  }

  return table;
}

describe("DataTable table geometry", () => {
  it("uses TanStack total width as the default table width and minimum width", () => {
    const { container } = render(<Fixture />);

    const table = getTable(container);

    expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("300px");
    expect(table.style.getPropertyValue("--DataTable-table-width")).toBe(
      "300px",
    );
    expect(table.style.getPropertyValue("--DataTable-table-min-width")).toBe(
      "300px",
    );
  });

  it("allows the table to fill its container without tableProps sx", () => {
    const { container } = render(<Fixture tableWidth="100%" />);

    const table = getTable(container);

    expect(table.style.getPropertyValue("--DataTable-table-width")).toBe(
      "100%",
    );

    /**
     * Keep the TanStack column model as the minimum by default.
     *
     * A narrow container therefore scrolls instead of silently compressing
     * the configured column geometry.
     */
    expect(table.style.getPropertyValue("--DataTable-table-min-width")).toBe(
      "300px",
    );
  });

  it("accepts an explicit minimum width when the consumer wants to replace the TanStack minimum", () => {
    const { container } = render(
      <Fixture tableWidth="100%" tableMinWidth="100%" />,
    );

    const table = getTable(container);

    expect(table.style.getPropertyValue("--DataTable-table-width")).toBe(
      "100%",
    );
    expect(table.style.getPropertyValue("--DataTable-table-min-width")).toBe(
      "100%",
    );
  });

  it("normalizes numeric geometry values to pixel CSS custom-property values", () => {
    const { container } = render(
      <Fixture tableWidth={960} tableMinWidth={640} />,
    );

    const table = getTable(container);

    expect(table.style.getPropertyValue("--DataTable-table-width")).toBe(
      "960px",
    );
    expect(table.style.getPropertyValue("--DataTable-table-min-width")).toBe(
      "640px",
    );
  });

  it("supports theme-level table width defaults and lets explicit props win", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          defaultProps: {
            tableWidth: "100%",
            tableMinWidth: "50%",
          },
        },
      },
    });

    const { container, rerender } = render(
      <ThemeProvider theme={theme}>
        <Fixture />
      </ThemeProvider>,
    );

    let table = getTable(container);

    expect(table.style.getPropertyValue("--DataTable-table-width")).toBe(
      "100%",
    );
    expect(table.style.getPropertyValue("--DataTable-table-min-width")).toBe(
      "50%",
    );

    rerender(
      <ThemeProvider theme={theme}>
        <Fixture tableWidth="75%" tableMinWidth={720} />
      </ThemeProvider>,
    );

    table = getTable(container);

    expect(table.style.getPropertyValue("--DataTable-table-width")).toBe(
      "75%",
    );
    expect(table.style.getPropertyValue("--DataTable-table-min-width")).toBe(
      "720px",
    );
  });
});

const windowingRows = Array.from({ length: 30 }, (_, index) => ({
  name: `Record ${index + 1}`,
  status: "Enabled",
}));

const windowingColumns = helper.columns([
  ...columns,
  helper.display({
    id: "pin",
    cell: ({ row }) => <input
      type="checkbox"
      aria-label={"Pin " + row.id}
      onChange={() => row.pin(row.getIsPinned() ? false : "top")}
    />,
  }),
]);

/** Exercises the same stable row body with and without active pins. */
function WindowingFallbackFixture({ reason }: {
  readonly reason: "detail" | "activation" | "pin" | "eligible" | "nonsticky";
}) {
  const table = useMuiDataTable({
    columns: reason === "eligible" ? windowingColumns : columns,
    data: windowingRows,
    getRowId: row => row.name,
    enableRowPinning: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 30 },
      rowPinning: { top: reason === "pin" ? ["Record 1"] : [], bottom: [] },
    },
  });

  return <DataTable
    table={table}
    windowRows
    tableProps={{ stickyHeader: reason !== "nonsticky" }}
    toolbar={false}
    pagination={false}
    renderDetailPanel={reason === "detail" ? ({ row }) => row.original.name : undefined}
    onRowClick={reason === "activation" ? () => {} : undefined}
  />;
}

it.each(["detail", "activation", "pin", "nonsticky"] as const)(
  "keeps the full renderer when the windowing opt-in encounters %s",
  reason => {
    const { container } = render(<WindowingFallbackFixture reason={reason} />);
    const table = getTable(container);

    expect(table.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(30);
    expect(table.querySelectorAll("tbody tr[aria-hidden]")).toHaveLength(0);
    expect(table).not.toHaveAttribute("aria-rowcount");
    if (reason === "activation") {
      expect(table.querySelectorAll('tbody tr[data-row-clickable="true"]')).toHaveLength(30);
    }
    if (reason === "pin") {
      expect(table.querySelectorAll('tbody tr[data-row-pinned="top"]')).toHaveLength(1);
    }
  },
);

/** Verifies that scrolling changes the mounted range and Tab restores native order. */
it("mounts a bounded row range and moves it when the table scrolls", () => {
  const originalObserver = window.ResizeObserver;
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  const viewportHeight = jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(185);
  const rowHeight = jest.spyOn(HTMLTableRowElement.prototype, "getBoundingClientRect")
    .mockReturnValue(new DOMRect(0, 0, 300, 37));

  try {
    const { container, getByRole, unmount } = render(<WindowingFallbackFixture reason="eligible" />);
    const table = getTable(container);
    const viewport = table.closest<HTMLElement>("." + dataTableClasses.container)!;
    const mounted = () => Array.from(table.querySelectorAll("tbody tr[data-row-id]"))
      .map(row => row.getAttribute("data-row-id"));

    expect(mounted().length).toBeLessThan(30);
    expect(mounted()[0]).toBe("Record 1");
    viewport.scrollTop = 1000;
    fireEvent.scroll(viewport);
    expect(mounted()).toContain("Record 30");
    expect(mounted()).not.toContain("Record 1");
    fireEvent.keyDown(viewport, { key: "Tab" });
    expect(mounted()).toHaveLength(30);
    const checkbox = getByRole("checkbox", { name: "Pin Record 30" });
    act(() => checkbox.focus());
    fireEvent.click(checkbox);
    expect(checkbox).toHaveFocus();
    expect(checkbox.closest("tr")).toHaveAttribute("data-row-pinned", "top");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveFocus();
    expect(checkbox.closest("tr")).not.toHaveAttribute("data-row-pinned");
    unmount();
  } finally {
    rowHeight.mockRestore();
    viewportHeight.mockRestore();
    window.ResizeObserver = originalObserver;
  }
});