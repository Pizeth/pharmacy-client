import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import type { RowPinningState } from "@tanstack/table-core";

import { createRowPinningColumn } from "../columns/row-pinning";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTable } from "./DataTable";

type Row = {
  readonly id: string;
  readonly name: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
    meta: {
      enableColumnMenu: false,
    },
  }),
]);

const data: Row[] = [
  { id: "a", name: "Delta" },
  { id: "b", name: "Charlie" },
  { id: "c", name: "Bravo" },
  { id: "d", name: "Alpha" },
];

const theme = createTheme();

function renderedRowIds(container: HTMLElement): Array<string | null> {
  return Array.from(container.querySelectorAll("[data-row-id]")).map((row) =>
    row.getAttribute("data-row-id"),
  );
}

describe("DataTable row-pinning cross-feature hardening", () => {
  it("supports uncontrolled initial state, imperative updates, and reset", () => {
    function Fixture() {
      const table = useMuiDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        enableRowPinning: true,
        initialState: {
          rowPinning: {
            top: ["b"],
            bottom: ["d"],
          },
        },
      });

      return (
        <>
          <output data-testid="row-pinning-state">
            {JSON.stringify(table.state.rowPinning)}
          </output>

          <button
            type="button"
            onClick={() => {
              table.getRow("c").pin("top");
            }}
          >
            Pin c
          </button>

          <button
            type="button"
            onClick={() => {
              table.resetRowPinning();
            }}
          >
            Reset pinning
          </button>

          <button
            type="button"
            onClick={() => {
              table.resetRowPinning(true);
            }}
          >
            Reset pinning to default
          </button>
        </>
      );
    }

    render(<Fixture />);

    expect(screen.getByTestId("row-pinning-state")).toHaveTextContent(
      JSON.stringify({
        top: ["b"],
        bottom: ["d"],
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Pin c" }));

    expect(screen.getByTestId("row-pinning-state")).toHaveTextContent(
      JSON.stringify({
        top: ["b", "c"],
        bottom: ["d"],
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset pinning" }));

    expect(screen.getByTestId("row-pinning-state")).toHaveTextContent(
      JSON.stringify({
        top: ["b"],
        bottom: ["d"],
      }),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Reset pinning to default" }),
    );

    expect(screen.getByTestId("row-pinning-state")).toHaveTextContent(
      JSON.stringify({
        top: [],
        bottom: [],
      }),
    );
  });

  it("supports fully controlled rowPinning through onRowPinningChange", () => {
    function Fixture() {
      const [rowPinning, setRowPinning] = useState<RowPinningState>({
        top: ["b"],
        bottom: [],
      });

      const table = useMuiDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        enableRowPinning: true,
        state: {
          rowPinning,
        },
        onRowPinningChange: setRowPinning,
      });

      return (
        <>
          <output data-testid="controlled-row-pinning">
            {JSON.stringify(rowPinning)}
          </output>

          <button
            type="button"
            onClick={() => {
              table.getRow("c").pin("bottom");
            }}
          >
            Pin c bottom
          </button>

          <button
            type="button"
            onClick={() => {
              table.getRow("b").pin(false);
            }}
          >
            Unpin b
          </button>
        </>
      );
    }

    render(<Fixture />);

    fireEvent.click(screen.getByRole("button", { name: "Pin c bottom" }));

    expect(screen.getByTestId("controlled-row-pinning")).toHaveTextContent(
      JSON.stringify({
        top: ["b"],
        bottom: ["c"],
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Unpin b" }));

    expect(screen.getByTestId("controlled-row-pinning")).toHaveTextContent(
      JSON.stringify({
        top: [],
        bottom: ["c"],
      }),
    );
  });

  it.each([
    {
      label: "column filtering",
      tableState: {
        columnFilters: [{ id: "name", value: "Alpha" }],
      },
    },
    {
      label: "global filtering",
      tableState: {
        globalFilter: "Alpha",
      },
    },
  ])(
    "respects keepPinnedRows while $label removes a pinned row from the center model",
    ({ tableState }) => {
      function Fixture({ keepPinnedRows }: { readonly keepPinnedRows: boolean }) {
        const table = useMuiDataTable({
          columns,
          data,
          getRowId: (row) => row.id,
          enableRowPinning: true,
          enableGlobalFilter: true,
          keepPinnedRows,
          initialState: {
            rowPinning: {
              top: ["b"],
              bottom: [],
            },
            ...tableState,
          },
        });

        return (
          <DataTable
            table={table}
            toolbar={false}
            pagination={false}
            defaultDensity="compact"
            rowPinning={{ displayMode: "sticky" }}
          />
        );
      }

      const kept = render(
        <ThemeProvider theme={theme}>
          <Fixture keepPinnedRows />
        </ThemeProvider>,
      );

      /**
       * Alpha is the only row left in the filtered center model.
       * Charlie ("b") is resurrected by TanStack's keepPinnedRows contract and
       * prepended by the sticky renderer because it is absent from getRowModel().
       */
      expect(renderedRowIds(kept.container)).toEqual(["b", "d"]);
      expect(kept.container.querySelector('[data-row-id="b"]')).toHaveAttribute(
        "data-row-pinned",
        "top",
      );

      kept.unmount();

      const pruned = render(
        <ThemeProvider theme={theme}>
          <Fixture keepPinnedRows={false} />
        </ThemeProvider>,
      );

      expect(renderedRowIds(pruned.container)).toEqual(["d"]);
      expect(pruned.container.querySelector('[data-row-id="b"]')).toBeNull();
    },
  );

  it("preserves sorted page order while keepPinnedRows controls off-page pinned rows", () => {
    function Fixture({ keepPinnedRows }: { readonly keepPinnedRows: boolean }) {
      const table = useMuiDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        enableRowPinning: true,
        keepPinnedRows,
        initialState: {
          sorting: [{ id: "name", desc: false }],
          pagination: {
            pageIndex: 0,
            pageSize: 2,
          },
          rowPinning: {
            top: ["b"],
            bottom: [],
          },
        },
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          defaultDensity="compact"
          rowPinning={{ displayMode: "sticky" }}
        />
      );
    }

    /**
     * Ascending names:
     *
     *   d Alpha
     *   c Bravo
     *   b Charlie
     *   a Delta
     *
     * Page 1 therefore contains d,c while b is pinned but off-page.
     */
    const kept = render(
      <ThemeProvider theme={theme}>
        <Fixture keepPinnedRows />
      </ThemeProvider>,
    );

    expect(renderedRowIds(kept.container)).toEqual(["b", "d", "c"]);

    kept.unmount();

    const pruned = render(
      <ThemeProvider theme={theme}>
        <Fixture keepPinnedRows={false} />
      </ThemeProvider>,
    );

    expect(renderedRowIds(pruned.container)).toEqual(["d", "c"]);
  });

  it("keeps an expanded detail panel attached to its pinned row without joining the sticky stack", () => {
    function Fixture() {
      const table = useMuiDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        enableRowPinning: true,
        getRowCanExpand: () => true,
        initialState: {
          rowPinning: {
            top: ["b", "c"],
            bottom: [],
          },
          expanded: {
            b: true,
          },
        },
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          defaultDensity="compact"
          rowPinning={{ displayMode: "sticky" }}
          renderDetailPanel={({ row }) => (
            <span>Details for {row.original.name}</span>
          )}
        />
      );
    }

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture />
      </ThemeProvider>,
    );

    const rowB = container.querySelector('[data-row-id="b"]');
    const detailB = container.querySelector('[data-detail-panel-row="b"]');
    const rowC = container.querySelector('[data-row-id="c"]');

    expect(rowB).toHaveAttribute("data-row-pinning-sticky", "true");
    expect(detailB).not.toBeNull();
    expect(detailB).not.toHaveAttribute("data-row-pinning-sticky");
    expect(screen.getByText("Details for Charlie")).toBeInTheDocument();

    /**
     * Only physical data rows participate in the sticky stack.
     *
     * The detail panel remains attached in DOM order but does not add its
     * arbitrary application height to the next pinned row's sticky offset.
     */
    expect(rowC).toHaveStyle({
      "--DataTable-row-pinned-offset": "73px",
    });

    expect(rowB?.nextElementSibling).toBe(detailB);
  });

  it("coexists with logical column pinning in RTL", () => {
    function Fixture() {
      const table = useMuiDataTable({
        columns,
        data,
        getRowId: (row) => row.id,
        enableRowPinning: true,
        enableColumnPinning: true,
        columnResizeDirection: "rtl",
        initialState: {
          rowPinning: {
            top: ["b"],
            bottom: [],
          },
          columnPinning: {
            start: ["name"],
            end: [],
          },
        },
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          defaultDensity="compact"
          rowPinning={{ displayMode: "sticky" }}
        />
      );
    }

    const { container } = render(
      <ThemeProvider theme={createTheme({ direction: "rtl" })}>
        <Fixture />
      </ThemeProvider>,
    );

    const row = container.querySelector('[data-row-id="b"]');
    const cell = container.querySelector(
      '[data-row-id="b"] [data-column-id="name"]',
    );

    expect(row).toHaveAttribute("data-row-pinned", "top");
    expect(row).toHaveStyle({
      "--DataTable-row-pinned-offset": "36px",
    });

    expect(cell).toHaveAttribute("data-pinned", "start");
    expect(cell).toHaveStyle({
      insetInlineStart: "var(--DataTable-column-pinned-offset)",
    });
  });

  it.each([
    {
      density: "compact" as const,
      firstOffset: "36px",
      secondOffset: "73px",
    },
    {
      density: "comfortable" as const,
      firstOffset: "56px",
      secondOffset: "114px",
    },
    {
      density: "spacious" as const,
      firstOffset: "72px",
      secondOffset: "145px",
    },
  ])(
    "uses $density density metrics for multi-row sticky offsets",
    ({ density, firstOffset, secondOffset }) => {
      function Fixture() {
        const table = useMuiDataTable({
          columns,
          data,
          getRowId: (row) => row.id,
          enableRowPinning: true,
          initialState: {
            rowPinning: {
              top: ["b", "c"],
              bottom: [],
            },
          },
        });

        return (
          <DataTable
            table={table}
            toolbar={false}
            pagination={false}
            density={density}
            rowPinning={{ displayMode: "sticky" }}
          />
        );
      }

      const { container } = render(
        <ThemeProvider theme={theme}>
          <Fixture />
        </ThemeProvider>,
      );

      expect(container.querySelector('[data-row-id="b"]')).toHaveStyle({
        "--DataTable-row-pinned-offset": firstOffset,
      });

      expect(container.querySelector('[data-row-id="c"]')).toHaveStyle({
        "--DataTable-row-pinned-offset": secondOffset,
      });
    },
  );

  it("honors the per-row enableRowPinning predicate in generic controls", () => {
    const pinningColumns = helper.columns([
      createRowPinningColumn<Row>({
        displayMode: "top-and-bottom",
      }),
      helper.accessor("name", {
        header: "Name",
      }),
    ]);

    function Fixture() {
      const table = useMuiDataTable({
        columns: pinningColumns,
        data,
        getRowId: (row) => row.id,
        enableRowPinning: (row) => row.id !== "c",
      });

      return (
        <DataTable
          table={table}
          toolbar={false}
          pagination={false}
          defaultDensity="compact"
          rowPinning={{ displayMode: "top-and-bottom" }}
        />
      );
    }

    render(
      <ThemeProvider theme={theme}>
        <Fixture />
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("button", {
        name: "Pin row b to top",
      }),
    ).toBeEnabled();

    expect(
      screen.queryByRole("button", {
        name: "Pin row c to top",
      }),
    ).toBeNull();

    expect(
      screen.queryByRole("button", {
        name: "Pin row c to bottom",
      }),
    ).toBeNull();
  });
});
