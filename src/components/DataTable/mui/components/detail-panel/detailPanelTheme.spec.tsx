import { Table, TableBody } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";

import { act, render, screen } from "@testing-library/react";

import {
  DataTableAccessibilityProvider,
  useDataTableAccessibility,
} from "../../accessibility";

import { dataTableClasses } from "../../styles";

import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";

import type { MuiDataTableInstance } from "../../table";

import { DataTableDetailPanelRow } from "./DataTableDetailPanelRow";

import type { DataTableDetailPanelRenderer } from "./types";

type Row = {
  readonly id: string;

  readonly name: string;

  readonly role: string;
};

const ROW_ID = "alpha";

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
  }),

  helper.accessor("role", {
    header: "Role",
  }),
]);

const data: readonly Row[] = [
  {
    id: ROW_ID,

    name: "Alpha",

    role: "Administrator",
  },
];

const defaultDetailRenderer: DataTableDetailPanelRenderer<Row> = ({ row }) => (
  <span>Details for {row.original.name}</span>
);

interface DetailPanelFixtureOptions {
  readonly expanded?: boolean;

  readonly renderDetailPanel?: DataTableDetailPanelRenderer<Row>;

  readonly theme?: Theme;
}

/**
 * Test-only accessibility companion.
 *
 * Production uses DataTableExpandRowButton, which consumes the same:
 *
 *   getExpandButtonId()
 *   getDetailPanelId()
 *
 * contract.
 *
 * This probe keeps the test focused on DetailPanel itself instead of
 * coupling 6E.4 to expansion-button presentation.
 */
function DetailPanelAccessibilityProbe(props: { readonly rowId: string }) {
  const { rowId } = props;

  const { getExpandButtonId, getDetailPanelId } = useDataTableAccessibility();

  const expandButtonId = getExpandButtonId(rowId);

  const detailPanelId = getDetailPanelId(rowId);

  return (
    <button
      id={expandButtonId}
      aria-controls={detailPanelId}
      aria-expanded={true}
    >
      Toggle details
    </button>
  );
}

function mount(options: DetailPanelFixtureOptions = {}) {
  const {
    expanded = true,

    renderDetailPanel = defaultDetailRenderer,

    theme = createTheme(),
  } = options;

  let table: MuiDataTableInstance<Row>;

  function Fixture() {
    table = useMuiDataTable({
      columns,

      data: [...data],

      getRowId: (row) => row.id,

      /**
       * Detail panels are a custom-expansion use case rather than
       * hierarchical subRows.
       *
       * TanStack's own sub-component/detail-panel pattern uses
       * getRowCanExpand() for exactly this case.
       */
      getRowCanExpand: () => true,

      initialState: {
        expanded: expanded
          ? {
              [ROW_ID]: true,
            }
          : {},
      },
    });

    const row = table.getRowModel().rows[0];

    if (!row) {
      throw new Error("Detail-panel fixture did not produce a row.");
    }

    return (
      <table.AppTable>
        <DataTableAccessibilityProvider>
          <DetailPanelAccessibilityProbe rowId={ROW_ID} />

          <Table>
            <TableBody>
              <DataTableDetailPanelRow
                table={table}
                row={row}
                renderDetailPanel={renderDetailPanel}
              />
            </TableBody>
          </Table>
        </DataTableAccessibilityProvider>
      </table.AppTable>
    );
  }

  const result = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );

  return {
    ...result,

    getTable: () => table,
  };
}

describe("DataTable detail panel", () => {
  it("themes the row, spanning cell and semantic detail region", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          styleOverrides: {
            detailPanelRow: {
              backgroundColor: "rgb(10, 20, 30)",
            },

            detailPanelCell: {
              padding: "7px",
            },

            detailPanel: {
              backgroundColor: "rgb(30, 40, 50)",
            },
          },
        },
      },
    });

    const { container } = mount({
      theme,
    });

    const detailRow = container.querySelector<HTMLElement>(
      `[data-detail-panel-row="${ROW_ID}"]`,
    );

    const detailCell = screen.getByRole("cell");

    const region = screen.getByRole("region", {
      name: "Toggle details",
    });

    const expandButton = screen.getByRole("button", {
      name: "Toggle details",
    });

    expect(detailRow).not.toBeNull();

    expect(detailRow).toHaveClass(dataTableClasses.detailPanelRow);

    expect(detailRow).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });

    expect(detailCell).toHaveClass(dataTableClasses.detailPanelCell);

    expect(detailCell).toHaveAttribute("colspan", "2");

    expect(detailCell).toHaveStyle({
      padding: "7px",
    });

    expect(region).toHaveClass(dataTableClasses.detailPanel);

    expect(region).toHaveAttribute("data-detail-panel", ROW_ID);

    expect(region).toHaveStyle({
      backgroundColor: "rgb(30, 40, 50)",
    });

    /**
     * Accessibility relationship remains bidirectional:
     *
     * button
     *   aria-controls -> region.id
     *
     * region
     *   aria-labelledby -> button.id
     */
    expect(expandButton).toHaveAttribute("aria-controls", region.id);

    expect(region).toHaveAttribute("aria-labelledby", expandButton.id);

    expect(screen.getByText("Details for Alpha")).toBeInTheDocument();
  });

  it("does not invoke or render detail content while the row is collapsed", () => {
    let renderCount = 0;

    const renderer: DataTableDetailPanelRenderer<Row> = ({ row }) => {
      renderCount += 1;

      return <span>Details for {row.original.name}</span>;
    };

    const { container } = mount({
      expanded: false,

      renderDetailPanel: renderer,
    });

    expect(renderCount).toBe(0);

    expect(
      container.querySelector(`[data-detail-panel-row="${ROW_ID}"]`),
    ).toBeNull();

    expect(screen.queryByRole("region")).toBeNull();

    expect(screen.queryByText("Details for Alpha")).toBeNull();
  });

  it("suppresses the complete detail row when the application renderer returns no content", () => {
    const first = mount({
      renderDetailPanel: () => null,
    });

    expect(
      first.container.querySelector(`[data-detail-panel-row="${ROW_ID}"]`),
    ).toBeNull();

    first.unmount();

    const second = mount({
      renderDetailPanel: () => false,
    });

    expect(
      second.container.querySelector(`[data-detail-panel-row="${ROW_ID}"]`),
    ).toBeNull();

    expect(screen.queryByRole("region")).toBeNull();
  });

  it("updates native colSpan when visible leaf columns change", () => {
    const { getTable } = mount();

    const cell = () => screen.getByRole("cell");

    expect(cell()).toHaveAttribute("colspan", "2");

    act(() => {
      getTable().setColumnVisibility({
        role: false,
      });
    });

    expect(cell()).toHaveAttribute("colspan", "1");

    act(() => {
      getTable().setColumnVisibility({
        role: true,
      });
    });

    expect(cell()).toHaveAttribute("colspan", "2");
  });
});
