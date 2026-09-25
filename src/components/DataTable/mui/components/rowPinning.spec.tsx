import { render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { DataTable } from "./DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";

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

function Fixture() {
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
