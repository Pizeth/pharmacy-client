import { useState } from "react";
import { createPortal } from "react-dom";
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

const shortWindowingRows = windowingRows.slice(0, 20);
const reversedWindowingRows = [...windowingRows].reverse();

const windowingColumns = helper.columns([
  ...columns,
  helper.display({
    id: "pin",
    cell: ({ row }) => <>
      {row.id === "Record 1" && <PortalRowControl />}
      <input
      type="checkbox"
      aria-label={`Pin ${row.id}`}
      onChange={() => { row.pin(row.getIsPinned() ? false : "top"); }}
    /></>,
  }),
]);

const groupedWindowingColumns = helper.columns([helper.group({ id: "outer", header: "Outer", columns: [
  helper.group({ id: "middle", header: "Middle", columns: [
    helper.group({ id: "inner", header: "Inner", columns: windowingColumns }),
  ] }),
] })]);

/** Exercises the same stable row body with and without active pins. */
function WindowingFallbackFixture({ reason, reverse = false, short = false, grouped = false }: {
  readonly reverse?: boolean;
  readonly short?: boolean;
  readonly grouped?: boolean;
  readonly reason: "detail" | "activation" | "pin" | "eligible" | "nonsticky" | "filters" | "loading" | "error" | "interactive";
}) {
  const table = useMuiDataTable({
    columns: grouped ? groupedWindowingColumns : reason === "eligible" || reason === "interactive" ? windowingColumns : columns,
    data: short ? shortWindowingRows : reverse ? reversedWindowingRows : windowingRows,
    meta: { loading: reason === "loading", error: reason === "error" ? "Fixture error" : undefined },
    getRowId: row => row.name,
    enableRowPinning: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 30 },
      rowPinning: { top: reason === "pin" ? ["Record 1"] : [], bottom: [] },
    },
  });

  return <DataTable
    table={table}
    windowRows={reason === "interactive" ? "interactive" : true}
    showColumnFilters={reason === "filters"}
    tableProps={{ stickyHeader: reason !== "nonsticky" }}
    toolbar={false}
    pagination={false}
    renderDetailPanel={(reason === "detail" || reason === "interactive") ? ({ row }) => row.original.name : undefined}
    onRowClick={(reason === "activation" || reason === "interactive") ? () => { /* This fixture only exercises activation eligibility. */ } : undefined}
  />;
}

it.each(["detail", "activation", "pin", "nonsticky", "filters"] as const)(
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
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  };
  const viewportHeight = jest.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(185);
  const rowHeight = jest.spyOn(Element.prototype, "getBoundingClientRect")
    .mockReturnValue(new DOMRect(0, 0, 300, 37));

  try {
    const { container, getByRole, unmount } = render(<WindowingFallbackFixture reason="eligible" />);
    const table = getTable(container);
    const viewport = getViewport(table);
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
    act(() => { checkbox.focus(); });
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

/** Supplies DOM measurements while keeping observer cleanup observable. */
function mockWindowMeasurements(height: (row: HTMLTableRowElement) => number) {
  const originalObserver = window.ResizeObserver;
  const disconnects: jest.Mock[] = [];
  window.ResizeObserver = class {
    disconnect = jest.fn();
    constructor() { disconnects.push(this.disconnect); }
    observe = jest.fn();
    unobserve = jest.fn();
  };
  const viewport = jest.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(185);
  const row = jest.spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLTableRowElement) {
      return new DOMRect(0, 0, 300, height(this));
    });
  return {
    disconnects,
    restore() {
      row.mockRestore();
      viewport.mockRestore();
      window.ResizeObserver = originalObserver;
    },
  };
}

it("uses the full body when ResizeObserver is unavailable", () => {
  const originalObserver = window.ResizeObserver;
  // The browser capability is optional, even though DOM types declare it.
  Object.defineProperty(window, "ResizeObserver", { configurable: true, writable: true, value: undefined });
  try {
    const { container, unmount } = render(<WindowingFallbackFixture reason="eligible" />);
    expect(container.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(30);
    expect(container.querySelectorAll("tbody tr[aria-hidden]")).toHaveLength(0);
    unmount();
  } finally { window.ResizeObserver = originalObserver; }
});

it.each(["mixed", "missing"] as const)("uses the full body for %s row measurements", kind => {
  const measurements = mockWindowMeasurements(row => kind === "missing" ? 0 : row.dataset.rowId === "Record 2" ? 60 : 37);
  try {
    const { container, unmount } = render(<WindowingFallbackFixture reason="eligible" />);
    expect(container.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(30);
    expect(container.querySelectorAll("tbody tr[aria-hidden]")).toHaveLength(0);
    unmount();
  } finally { measurements.restore(); }
});

it("keeps spacer heights and row indices aligned with the current order after scrolling", () => {
  const measurements = mockWindowMeasurements(() => 37);
  try {
    const { container, rerender, unmount } = render(<WindowingFallbackFixture reason="eligible" />);
    const table = getTable(container);
    const viewport = getViewport(table);
    viewport.scrollTop = 740;
    fireEvent.scroll(viewport);
    const check = (reverse: boolean) => {
      const rows = [...table.querySelectorAll("tbody tr[data-row-id]")];
      expect(rows.length).toBeLessThan(30);
      const firstIndex = Number(rows[0].getAttribute("aria-rowindex")) - 2;
      expect(firstIndex).toBeGreaterThan(0);
      rows.forEach((row, index) => {
        expect(row).toHaveAttribute("aria-rowindex", String(firstIndex + index + 2));
        expect(row).toHaveAttribute("data-row-id", `Record ${reverse ? 30 - firstIndex - index : firstIndex + index + 1}`);
      });
      const spacers = table.querySelectorAll<HTMLTableCellElement>("tbody tr[aria-hidden] td");
      expect(spacers[0].style.height).toBe(`${firstIndex * 37}px`);
      expect(spacers[1].style.height).toBe(`${(30 - firstIndex - rows.length) * 37}px`);
    };
    check(false);
    rerender(<WindowingFallbackFixture reason="eligible" reverse />);
    check(true);
    unmount();
  } finally { measurements.restore(); }
});

it("removes viewport and keyboard listeners and disconnects observers on unmount", () => {
  const measurements = mockWindowMeasurements(() => 37);
  const removeDocumentListener = jest.spyOn(document, "removeEventListener");
  try {
    const { container, unmount } = render(<WindowingFallbackFixture reason="eligible" />);
    const viewport = getViewport(getTable(container));
    const removeScrollListener = jest.spyOn(viewport, "removeEventListener");
    unmount();
    expect(removeScrollListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeDocumentListener).toHaveBeenCalledWith("keydown", expect.any(Function), true);
    expect(removeDocumentListener).toHaveBeenCalledWith("pointerdown", expect.any(Function), true);
    expect(measurements.disconnects.length).toBeGreaterThan(0);
    measurements.disconnects.forEach(disconnect => { expect(disconnect).toHaveBeenCalled(); });
  } finally {
    removeDocumentListener.mockRestore();
    measurements.restore();
  }
});

function getViewport(table: HTMLTableElement): HTMLElement {
  const viewport = table.closest<HTMLElement>(`.${dataTableClasses.container}`);
  if (!viewport) throw new Error("Missing table viewport");
  return viewport;
}


it.each(["loading", "error"] as const)("does not expose windowed row geometry during %s", reason => {
  const { container, unmount } = render(<WindowingFallbackFixture reason={reason} />);
  const table = getTable(container);
  expect(table.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(0);
  expect(table.querySelectorAll("tbody tr[aria-hidden]")).toHaveLength(0);
  expect(table).not.toHaveAttribute("aria-rowcount");
  if (reason === "error") expect(container).toHaveTextContent("Fixture error");
  unmount();
});

it("windows interactive rows with detail and activation handlers, then preserves focused controls", () => {
  const measurements = mockWindowMeasurements(() => 37);
  try {
    const { container, getByRole, unmount } = render(<WindowingFallbackFixture reason="interactive" />);
    const mountedCount = () => container.querySelectorAll("tbody tr[data-row-id]").length;
    expect(mountedCount()).toBeLessThan(30);
    const checkbox = getByRole("checkbox", { name: "Pin Record 1" });
    act(() => { checkbox.focus(); });
    expect(mountedCount()).toBe(30);
    getViewport(getTable(container)).scrollTop = 1000;
    fireEvent.scroll(getViewport(getTable(container)));
    expect(checkbox).toHaveFocus();
    expect(mountedCount()).toBe(30);
    unmount();
  } finally { measurements.restore(); }
});


function PortalRowControl() {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => { setOpen(true); }}>Open row portal</button>
    {open && createPortal(<button onClick={() => { setOpen(false); }}>Portaled row action</button>, document.body)}
  </>;
}

it("keeps the owning row mounted while a portaled action has focus", () => {
  const measurements = mockWindowMeasurements(() => 37);
  try {
    const { container, getByRole, rerender, unmount } = render(<WindowingFallbackFixture reason="interactive" />);
    fireEvent.click(getByRole("button", { name: "Open row portal" }));
    const action = getByRole("button", { name: "Portaled row action" });
    act(() => { action.focus(); });
    fireEvent.pointerDown(action);
    rerender(<WindowingFallbackFixture reason="interactive" reverse />);
    const viewport = getViewport(getTable(container));
    viewport.scrollTop = 1000;
    fireEvent.scroll(viewport);
    expect(action).toHaveFocus();
    expect(action.isConnected).toBe(true);
    expect(container.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(30);
    unmount();
  } finally { measurements.restore(); }
});

it("preserves theme row heights outside windowed bodies", () => {
  const theme = createTheme({ components: { RazethDataTable: { styleOverrides: { bodyRow: { height: 120 } } } } });
  const { container, unmount } = render(<ThemeProvider theme={theme}><WindowingFallbackFixture reason="nonsticky" /></ThemeProvider>);
  const row = container.querySelector("tbody tr[data-row-id]");
  expect(row).toHaveStyle({ height: "120px" });
  expect(container.querySelector("tbody")).not.toHaveAttribute("data-window-row-height");
  unmount();
});

it("retains focused row controls when the data falls below the windowing threshold", () => {
  const measurements = mockWindowMeasurements(() => 37);
  try {
    const view = render(<WindowingFallbackFixture reason="eligible" />);
    const control = view.getByRole("checkbox", { name: "Pin Record 1" });
    act(() => { control.focus(); });
    view.rerender(<WindowingFallbackFixture reason="eligible" short />);
    expect(view.getByRole("checkbox", { name: "Pin Record 1" })).toBe(control);
    expect(control).toHaveFocus();
    expect(view.container.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(20);
    expect(view.container.querySelector("tbody")).not.toHaveAttribute("data-window-row-height");
    view.unmount();
  } finally { measurements.restore(); }
});

it("resumes windowing after keyboard focus moves outside the table", () => {
  const measurements = mockWindowMeasurements(() => 37);
  try {
    const view = render(<><button>Outside table</button><WindowingFallbackFixture reason="eligible" /></>);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(view.container.querySelectorAll("tbody tr[data-row-id]")).toHaveLength(30);
    act(() => { view.getByRole("button", { name: "Outside table" }).focus(); });
    expect(view.container.querySelectorAll("tbody tr[data-row-id]").length).toBeLessThan(30);
    view.unmount();
  } finally { measurements.restore(); }
});

it("lets the theme override the default windowed row height", () => {
  const measurements = mockWindowMeasurements(() => 120);
  const theme = createTheme({ components: { RazethDataTable: { styleOverrides: { bodyRow: { height: 120 } } } } });
  try {
    const view = render(<ThemeProvider theme={theme}><WindowingFallbackFixture reason="eligible" /></ThemeProvider>);
    expect(view.container.querySelector("tbody tr[data-row-id]")).toHaveStyle({ height: "120px" });
    view.unmount();
  } finally { measurements.restore(); }
});

it("keeps the body-relative scroll range with a tall sticky grouped header", () => {
  const measurements = mockWindowMeasurements(() => 37);
  const viewportHeight = jest.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(600);
  try {
    const view = render(<WindowingFallbackFixture reason="eligible" grouped />);
    const table = getTable(view.container);
    expect(table.querySelectorAll("thead tr")).toHaveLength(4);
    const viewport = getViewport(table);
    viewport.scrollTop = 370;
    fireEvent.scroll(viewport);
    // Sticky header offset cancels its flow offset: the first visible body row
    // is index 10; four overscan rows means mounting starts at index 6.
    expect(table.querySelector("tbody tr[data-row-id]")).toHaveAttribute("data-row-id", "Record 7");
    expect(view.getByRole("checkbox", { name: "Pin Record 11" })).toBeInTheDocument();
    view.unmount();
  } finally { viewportHeight.mockRestore(); measurements.restore(); }
});
