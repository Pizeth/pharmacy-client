import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";
import type { DataTableRowClickHandler } from "./DataTableBodyRow";

type Row = { id: string; name: string };

const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    cell: (info) => `Cell: ${info.getValue()}`,
  }),
  helper.display({
    id: "action",
    header: "Action",
    cell: () => <button type="button">Run</button>,
  }),
]);

const data: Row[] = [
  { id: "a", name: "alpha" },
  { id: "b", name: "beta" },
];

function mount(onRowClick?: DataTableRowClickHandler<Row>) {
  let table!: MuiDataTableInstance<Row>;

  function Fixture() {
    table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
    });

    return (
      <table.AppTable>
        <DataTableDensityProvider density="comfortable">
          <Table>
            <DataTableBody table={table} onRowClick={onRowClick} />
          </Table>
        </DataTableDensityProvider>
      </table.AppTable>
    );
  }

  return render(
    <ThemeProvider theme={createTheme()}>
      <Fixture />
    </ThemeProvider>,
  );
}

function getRowElement(container: HTMLElement, rowId: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(
    `.${dataTableClasses.bodyRow}[data-row-id="${rowId}"]`,
  );

  if (!element) {
    throw new Error(`Row ${rowId} not rendered.`);
  }

  return element;
}

describe("DataTable row click", () => {
  it("is inert when no handler is supplied", () => {
    const { container } = mount();
    const row = getRowElement(container, "a");

    expect(row).not.toHaveAttribute("data-row-clickable");
    expect(row).not.toHaveAttribute("tabindex");
  });

  it("marks rows clickable and focusable when a handler is supplied", () => {
    const { container } = mount(jest.fn());
    const row = getRowElement(container, "a");

    expect(row).toHaveAttribute("data-row-clickable", "true");
    expect(row).toHaveAttribute("tabindex", "0");
  });

  it("calls the handler with the clicked TanStack row", () => {
    const onRowClick = jest.fn();
    mount(onRowClick);

    fireEvent.click(screen.getByText("Cell: beta"));

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0].id).toBe("b");
    expect(onRowClick.mock.calls[0][0].original).toEqual({
      id: "b",
      name: "beta",
    });
  });

  it("ignores clicks that originate from interactive descendants", () => {
    const onRowClick = jest.fn();
    mount(onRowClick);

    fireEvent.click(screen.getAllByRole("button", { name: "Run" })[0]);

    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("activates with Enter or Space only when the row itself is focused", () => {
    const onRowClick = jest.fn();
    const { container } = mount(onRowClick);
    const row = getRowElement(container, "a");

    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });
    fireEvent.keyDown(row, { key: "Tab" });

    expect(onRowClick).toHaveBeenCalledTimes(2);

    // Keys typed inside a descendant (e.g. a button) must not activate the row.
    fireEvent.keyDown(screen.getAllByRole("button", { name: "Run" })[0], {
      key: "Enter",
    });

    expect(onRowClick).toHaveBeenCalledTimes(2);
  });
});
