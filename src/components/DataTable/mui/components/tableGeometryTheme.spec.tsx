import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";

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
