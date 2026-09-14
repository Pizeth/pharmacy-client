import { Table, TableHead } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { render } from "@testing-library/react";

import { DataTableDensityProvider } from "../density";

import { dataTableClasses } from "../styles";

import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";

import { DataTableHeaderRow } from "./DataTableHeaderRow";

type Row = {
  readonly centered: string;
  readonly start: string;
  readonly end: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

/**
 * Keep these fixture columns semantically simple.
 *
 * This suite tests the HeaderContent layout/theme contract, not:
 *
 * - sort behavior
 * - filters
 * - column menus
 * - resize interaction
 *
 * Those have dedicated tests/phases.
 */
const columns = helper.columns([
  helper.accessor("centered", {
    header: "Centered",
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    meta: {
      headerAlign: "center",
      enableColumnMenu: false,
    },
  }),

  helper.accessor("start", {
    header: "Start",
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    meta: {
      headerAlign: "start",
      enableColumnMenu: false,
    },
  }),

  helper.accessor("end", {
    header: "End",
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    meta: {
      headerAlign: "end",
      enableColumnMenu: false,
    },
  }),
]);

const data: readonly Row[] = [
  {
    centered: "Centered",
    start: "Start",
    end: "End",
  },
];

function HeaderContentFixture() {
  const table = useMuiDataTable({
    columns,
    data: [...data],
    enableColumnResizing: false,
  });

  const headerGroup = table.getHeaderGroups()[0];

  if (!headerGroup) {
    throw new Error("Header content fixture did not produce a header group.");
  }

  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        {/**
         * MUI TableHead is required so styled TableCell instances
         * render with proper header semantics:
         *
         *   <th role="columnheader">
         */}
        <Table>
          <TableHead>
            <DataTableHeaderRow
              table={table}
              headerGroup={headerGroup}
              headerRowIndex={0}
            />
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}

function getHeaderCell(columnId: keyof Row): HTMLElement {
  const cell = document.querySelector<HTMLElement>(
    `[data-column-id="${columnId}"]`,
  );

  if (!cell) {
    throw new Error(`Missing header cell "${columnId}".`);
  }

  return cell;
}

function getPart(
  cell: HTMLElement,

  className: string,
): HTMLElement {
  const part = cell.querySelector<HTMLElement>(`.${className}`);

  if (!part) {
    throw new Error(`Missing "${className}" inside header cell.`);
  }

  return part;
}

describe("DataTable header content theme", () => {
  it("preserves the symmetric centered-label geometry through named structural slots", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          styleOverrides: {
            headerContent: {
              backgroundColor: "rgb(10, 20, 30)",
            },
            headerLabelTrack: {
              backgroundColor: "rgb(30, 20, 10)",
            },
            headerActions: {
              backgroundColor: "rgb(20, 30, 40)",
            },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <HeaderContentFixture />
      </ThemeProvider>,
    );

    const cell = getHeaderCell("centered");

    const content = getPart(cell, dataTableClasses.headerContent);

    const labelTrack = getPart(cell, dataTableClasses.headerLabelTrack);

    const actions = getPart(cell, dataTableClasses.headerActions);

    expect(content).toHaveAttribute("data-align", "center");

    expect(content).toHaveStyle({
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
      backgroundColor: "rgb(10, 20, 30)",
    });

    /**
     * Track 2 remains the mathematically centered label track.
     */
    expect(labelTrack).toHaveClass(dataTableClasses.headerLabelTrack);

    expect(labelTrack).toHaveStyle({
      gridColumn: "2",
      justifySelf: "center",
      backgroundColor: "rgb(30, 20, 10)",
    });

    /**
     * Track 3 starts immediately after the centered label.
     *
     * Its width has no influence over the label center.
     */
    expect(actions).toHaveClass(dataTableClasses.headerActions);

    expect(actions).toHaveAttribute("data-align", "center");

    expect(actions).toHaveStyle({
      gridColumn: "3",
      justifySelf: "start",
      opacity: "0.4",
      backgroundColor: "rgb(20, 30, 40)",
    });
  });

  it("uses ordinary flex alignment for explicit start and end headers", () => {
    render(<HeaderContentFixture />);

    const startCell = getHeaderCell("start");

    const endCell = getHeaderCell("end");

    const startContent = getPart(startCell, dataTableClasses.headerContent);

    const endContent = getPart(endCell, dataTableClasses.headerContent);

    /**
     * DataTableHeaderCell currently resolves logical:
     *
     *   start -> left
     *   end   -> right
     *
     * before passing alignment into HeaderContent.
     */
    expect(startContent).toHaveAttribute("data-align", "left");

    expect(startContent).toHaveStyle({
      display: "flex",
      justifyContent: "flex-start",
    });

    expect(endContent).toHaveAttribute("data-align", "right");

    expect(endContent).toHaveStyle({
      display: "flex",
      justifyContent: "flex-end",
    });

    /**
     * Edge-aligned headers must not instantiate the special
     * centered label track.
     */
    expect(
      startCell.querySelector(`.${dataTableClasses.headerLabelTrack}`),
    ).toBeNull();

    expect(
      endCell.querySelector(`.${dataTableClasses.headerLabelTrack}`),
    ).toBeNull();

    /**
     * The action structural slot still exists for both layouts,
     * even when no actions are currently enabled.
     */
    expect(getPart(startCell, dataTableClasses.headerActions)).toHaveAttribute(
      "data-align",
      "left",
    );

    expect(getPart(endCell, dataTableClasses.headerActions)).toHaveAttribute(
      "data-align",
      "right",
    );
  });
});
