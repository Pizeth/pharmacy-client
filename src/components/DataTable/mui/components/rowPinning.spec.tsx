import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { DataTable } from "./DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { createRowPinningColumn } from "../columns/row-pinning";
import { createSelectionColumn } from "../columns/selection";

type Row = {
  id: string;
  name: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
  }),
]);

const data: Row[] = [
  { id: "a", name: "A" },
  { id: "b", name: "B" },
  { id: "c", name: "C" },
  { id: "d", name: "D" },
];

const theme = createTheme();

function Fixture({
  displayMode = "sticky",
}: {
  displayMode?:
    | "sticky"
    | "top"
    | "bottom"
    | "top-and-bottom"
    | "select-sticky"
    | "select-top"
    | "select-bottom";
}) {
  const table = useMuiDataTable({
    columns,
    data,
    getRowId: (row) => row.id,
    enableRowPinning: true,
    initialState: {
      rowPinning: {
        top: ["b", "c"],
        bottom: ["d"],
      },
    },
  });

  return (
    <>
      <output data-testid="top-rows">
        {table.getTopRows().map((row) => row.id).join(",")}
      </output>
      <output data-testid="center-rows">
        {table.getCenterRows().map((row) => row.id).join(",")}
      </output>
      <output data-testid="bottom-rows">
        {table.getBottomRows().map((row) => row.id).join(",")}
      </output>

      <DataTable
        table={table}
        toolbar={false}
        pagination={false}
        defaultDensity="compact"
        rowPinning={{ displayMode }}
      />
    </>
  );
}

it("exposes TanStack top, center and bottom row pinning APIs", () => {
  const { getByTestId } = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );

  expect(getByTestId("top-rows")).toHaveTextContent("b,c");
  expect(getByTestId("center-rows")).toHaveTextContent("a");
  expect(getByTestId("bottom-rows")).toHaveTextContent("d");
});

it("renders pinned rows with deterministic sticky offsets", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );

  const topFirst = container.querySelector('[data-row-id="b"]');
  const topSecond = container.querySelector('[data-row-id="c"]');
  const bottom = container.querySelector('[data-row-id="d"]');

  expect(topFirst).toHaveAttribute("data-row-pinned", "top");
  expect(topSecond).toHaveAttribute("data-row-pinned", "top");
  expect(bottom).toHaveAttribute("data-row-pinned", "bottom");

  /**
   * Compact density:
   *
   *   sticky header  = 36px
   *   body row       = 37px
   *
   * Therefore two top rows stack at:
   *
   *   36px
   *   73px
   *
   * The single bottom row begins at the container bottom edge.
   */
  expect(topFirst).toHaveStyle({
    "--DataTable-row-pinned-offset": "36px",
  });

  expect(topSecond).toHaveStyle({
    "--DataTable-row-pinned-offset": "73px",
  });

  expect(bottom).toHaveStyle({
    "--DataTable-row-pinned-offset": "0px",
  });
});


it("physically groups pinned rows in static modes without sticky positioning", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Fixture displayMode="top-and-bottom" />
    </ThemeProvider>,
  );

  const renderedRowIds = Array.from(
    container.querySelectorAll("[data-row-id]"),
  ).map((row) => row.getAttribute("data-row-id"));

  expect(renderedRowIds).toEqual(["b", "c", "a", "d"]);

  const top = container.querySelector('[data-row-id="b"]');
  const bottom = container.querySelector('[data-row-id="d"]');

  expect(top).toHaveAttribute("data-row-pinned", "top");
  expect(bottom).toHaveAttribute("data-row-pinned", "bottom");

  expect(top).not.toHaveAttribute("data-row-pinning-sticky");
  expect(bottom).not.toHaveAttribute("data-row-pinning-sticky");
});

it("preserves final row-model order in sticky mode", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Fixture displayMode="sticky" />
    </ThemeProvider>,
  );

  const renderedRowIds = Array.from(
    container.querySelectorAll("[data-row-id]"),
  ).map((row) => row.getAttribute("data-row-id"));

  expect(renderedRowIds).toEqual(["a", "b", "c", "d"]);

  expect(container.querySelector('[data-row-id="b"]')).toHaveAttribute(
    "data-row-pinning-sticky",
    "true",
  );
});

function PinningControlsFixture() {
  const pinningColumns = helper.columns([
    createRowPinningColumn<Row>({
      displayMode: "top-and-bottom",
    }),
    helper.accessor("name", {
      header: "Name",
    }),
  ]);

  const table = useMuiDataTable({
    columns: pinningColumns,
    data,
    getRowId: (row) => row.id,
    enableRowPinning: true,
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

it("delegates explicit pin and unpin commands to TanStack row APIs", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <PinningControlsFixture />
    </ThemeProvider>,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Pin row b to bottom",
    }),
  );

  const renderedAfterPin = Array.from(
    container.querySelectorAll("[data-row-id]"),
  ).map((row) => row.getAttribute("data-row-id"));

  expect(renderedAfterPin).toEqual(["a", "c", "d", "b"]);
  expect(container.querySelector('[data-row-id="b"]')).toHaveAttribute(
    "data-row-pinned",
    "bottom",
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Unpin row b",
    }),
  );

  const renderedAfterUnpin = Array.from(
    container.querySelectorAll("[data-row-id]"),
  ).map((row) => row.getAttribute("data-row-id"));

  expect(renderedAfterUnpin).toEqual(["a", "b", "c", "d"]);
});


function SelectStickyFixture() {
  const selectStickyColumns = helper.columns([
    createSelectionColumn<Row>(),
    helper.accessor("name", {
      header: "Name",
    }),
  ]);

  const table = useMuiDataTable({
    columns: selectStickyColumns,
    data,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableRowPinning: true,
  });

  return (
    <>
      <output data-testid="select-sticky-top-rows">
        {table.getTopRows().map((row) => row.id).join(",")}
      </output>

      <DataTable
        table={table}
        toolbar={false}
        pagination={false}
        defaultDensity="compact"
        rowPinning={{ displayMode: "select-sticky" }}
      />
    </>
  );
}

it("pins individual selections but select-all clears sticky pins", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <SelectStickyFixture />
    </ThemeProvider>,
  );

  /**
   * Individual selection owns one sticky pin.
   */
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Select row a",
    }),
  );

  expect(screen.getByTestId("select-sticky-top-rows")).toHaveTextContent("a");
  expect(container.querySelector('[data-row-id="a"]')).toHaveAttribute(
    "data-row-pinned",
    "top",
  );

  /**
   * Page-level select-all must not turn every selected row into a sticky row.
   *
   * All rows remain selected, but the pinning state is intentionally empty.
   * This prevents the selected page from stacking into a viewport-sized sticky
   * block above the remaining scrolling content.
   */
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Select all rows on current page",
    }),
  );

  for (const row of data) {
    expect(
      screen.getByRole("checkbox", {
        name: `Select row ${row.id}`,
      }),
    ).toBeChecked();
  }

  expect(screen.getByTestId("select-sticky-top-rows")).toBeEmptyDOMElement();

  for (const row of data) {
    expect(
      container.querySelector(`[data-row-id="${row.id}"]`),
    ).not.toHaveAttribute("data-row-pinned");
  }
});
