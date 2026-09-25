import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import type { MuiDataTableDensity } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

type Row = {
  readonly name: string;
  readonly role: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    meta: {
      enableColumnMenu: false,
    },
  }),

  helper.accessor("role", {
    header: "Role",
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
    name: "Alice",
    role: "Administrator",
  },
];

function HeaderStructure(props: {
  readonly density?: MuiDataTableDensity;
  readonly headerRowIndex?: number;
}) {
  const { density = "comfortable", headerRowIndex = 0 } = props;

  const table = useMuiDataTable({
    columns,
    data: [...data],
    /**
     * Resizing is deliberately disabled for this structural fixture.
     *
     * The fixture is testing:
     *
     * - header slots
     * - sizing geometry
     * - sticky geometry
     * - logical pinning
     * - density
     *
     * Interactive resize-handle behavior gets its own focused tests
     * during Phase 6C.5.
     */
    enableColumnResizing: false,
  });

  return (
    /**
     * REQUIRED TanStack v9 application-table context.
     *
     * Production DataTable installs this exact boundary before any
     * renderer components.
     *
     * DataTableHeaderCell renders:
     *
     *   <table.AppHeader>
     *     ...
     *     <appHeader.ResizeHandle />
     *   </table.AppHeader>
     *
     * DataTableResizeHandle consumes both:
     *
     *   useMuiDataTableContext()
     *   useMuiDataTableHeaderContext()
     *
     * Therefore testing the real header renderer without AppTable is
     * an invalid renderer hierarchy even when column resizing itself
     * is disabled.
     */
    <table.AppTable>
      <DataTableDensityProvider density={density}>
        <button
          onClick={() => {
            table.setColumnSizing({
              name: 240,
              role: 80,
            });
          }}
        >
          Resize
        </button>

        <button
          onClick={() => {
            table.setColumnPinning({
              start: ["name", "role"],
              end: [],
            });
          }}
        >
          Pin start
        </button>

        <button
          onClick={() => {
            table.setColumnPinning({
              start: [],
              end: ["name", "role"],
            });
          }}
        >
          Pin end
        </button>

        <button
          onClick={() => {
            table.setColumnPinning({
              start: [],
              end: [],
            });
          }}
        >
          Unpin
        </button>

        {/**
         * Use MUI's Table + TableHead rather than native table/head elements.
         *
         * DataTableHeaderCell renders a styled MUI TableCell.
         *
         * MUI TableHead supplies the table-level variant context that tells
         * TableCell:
         *
         *   this is a header cell
         *
         * which results in:
         *
         *   <th role="columnheader">
         *
         * rather than:
         *
         *   <td role="cell">
         *
         * This mirrors the real DataTableHead production hierarchy.
         */}
        <Table>
          <TableHead>
            <table.Subscribe
              selector={(state) => ({
                columnVisibility: state.columnVisibility,
                columnOrder: state.columnOrder,
                columnPinning: state.columnPinning,
              })}
            >
              {() => {
                const headerGroup = table.getHeaderGroups()[0];

                if (!headerGroup) {
                  return null;
                }

                return (
                  <DataTableHeaderRow
                    table={table}
                    headerGroup={headerGroup}
                    headerRowIndex={headerRowIndex}
                  />
                );
              }}
            </table.Subscribe>
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}

/**
 * Resolve one physical header cell from the fixture.
 */
function getHeaderCell(columnId: string): HTMLElement {
  const cell = document.querySelector<HTMLElement>(
    `[data-column-id="${columnId}"]`,
  );

  if (!cell) {
    throw new Error(`Missing header cell "${columnId}".`);
  }

  return cell;
}

describe("DataTable header structure theme", () => {
  it("applies RazethDataTable structural overrides to the real header row and cell", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          styleOverrides: {
            headerRow: {
              backgroundColor: "rgb(10, 20, 30)",
            },

            headerCell: {
              backgroundColor: "rgb(30, 20, 10)",
              paddingInline: "12px",
            },

            headerCellContent: {
              backgroundColor: "rgb(20, 30, 40)",
            },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <HeaderStructure />
      </ThemeProvider>,
    );

    const row = screen.getByRole("row");

    expect(row).toHaveClass(dataTableClasses.headerRow);

    expect(row).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });

    const headerCells = screen.getAllByRole("columnheader");

    expect(headerCells).toHaveLength(2);

    for (const cell of headerCells) {
      expect(cell).toHaveClass(dataTableClasses.headerCell);

      expect(cell).toHaveStyle({
        backgroundColor: "rgb(30, 20, 10)",
        paddingInline: "12px",
      });

      const content = cell.querySelector(
        `.${dataTableClasses.headerCellContent}`,
      );

      expect(content).not.toBeNull();

      expect(content).toHaveStyle({
        backgroundColor: "rgb(20, 30, 40)",
      });
    }
  });

  it.each(["ltr", "rtl"] as const)(
    "updates sizing and logical pinned header geometry in %s",
    (direction) => {
      render(
        <ThemeProvider
          theme={createTheme({
            direction,
          })}
        >
          <HeaderStructure />
        </ThemeProvider>,
      );

      const nameCell = getHeaderCell("name");

      const roleCell = getHeaderCell("role");

      /**
       * ----------------------------------------------------------
       * Column sizing
       * ----------------------------------------------------------
       */
      fireEvent.click(
        screen.getByRole("button", {
          name: "Resize",
        }),
      );

      expect(nameCell.style.getPropertyValue("--DataTable-column-size")).toBe(
        "240px",
      );

      expect(roleCell.style.getPropertyValue("--DataTable-column-size")).toBe(
        "80px",
      );

      /**
       * ----------------------------------------------------------
       * Start pinning
       * ----------------------------------------------------------
       *
       * name:
       *   offset = 0
       *
       * role:
       *   offset = name width = 240
       *   center boundary = true
       */
      fireEvent.click(
        screen.getByRole("button", {
          name: "Pin start",
        }),
      );

      expect(
        roleCell.style.getPropertyValue("--DataTable-column-pinned-offset"),
      ).toBe("240px");

      expect(roleCell).toHaveAttribute("data-pinned", "start");

      expect(roleCell).toHaveAttribute("data-pinned-boundary", "true");

      expect(nameCell).not.toHaveAttribute("data-pinned-boundary");

      expect(roleCell).toHaveStyle({
        insetInlineStart: "var(--DataTable-column-pinned-offset)",
        zIndex: "4",
      });

      /**
       * ----------------------------------------------------------
       * End pinning
       * ----------------------------------------------------------
       *
       * role:
       *   offset = 0
       *
       * name:
       *   offset = role width = 80
       *   center boundary = true
       */
      fireEvent.click(
        screen.getByRole("button", {
          name: "Pin end",
        }),
      );

      expect(
        nameCell.style.getPropertyValue("--DataTable-column-pinned-offset"),
      ).toBe("80px");

      expect(nameCell).toHaveAttribute("data-pinned", "end");

      expect(nameCell).toHaveAttribute("data-pinned-boundary", "true");

      expect(roleCell).not.toHaveAttribute("data-pinned-boundary");

      expect(nameCell).toHaveStyle({
        insetInlineEnd: "var(--DataTable-column-pinned-offset)",
        zIndex: "4",
      });

      /**
       * ----------------------------------------------------------
       * Unpin
       * ----------------------------------------------------------
       */
      fireEvent.click(
        screen.getByRole("button", {
          name: "Unpin",
        }),
      );

      expect(nameCell).not.toHaveAttribute("data-pinned");

      expect(nameCell).not.toHaveAttribute("data-pinned-boundary");

      expect(
        nameCell.style.getPropertyValue("--DataTable-column-pinned-offset"),
      ).toBe("");

      expect(nameCell).toHaveStyle({
        zIndex: "3",
      });
    },
  );

  it("updates sticky header geometry from header depth and density", () => {
    const { rerender } = render(
      <HeaderStructure density="compact" headerRowIndex={2} />,
    );

    let cell = getHeaderCell("name");

    /**
     * compact header:
     *
     *   36px
     *
     * row index:
     *
     *   2
     *
     * top:
     *
     *   2 × 36 = 72px
     */
    expect(cell.style.getPropertyValue("--DataTable-header-sticky-top")).toBe(
      "72px",
    );

    expect(cell).toHaveAttribute("data-density", "compact");

    expect(cell).toHaveStyle({
      height: "36px",
      minHeight: "36px",
    });

    rerender(<HeaderStructure density="spacious" headerRowIndex={3} />);

    cell = getHeaderCell("name");

    /**
     * spacious header:
     *
     *   72px
     *
     * row index:
     *
     *   3
     *
     * top:
     *
     *   3 × 72 = 216px
     */
    expect(cell.style.getPropertyValue("--DataTable-header-sticky-top")).toBe(
      "216px",
    );

    expect(cell).toHaveAttribute("data-density", "spacious");

    expect(cell).toHaveStyle({
      height: "72px",
      minHeight: "72px",
    });
  });
});
